const dbChatMessage = require('../utils/db/db.chatmessage');
const dbChat = require('../utils/db/db.chat');
const dbUser = require('../utils/db/db.users');

class EventHandlers {
    constructor(socket) {
        this.socket = socket;
    }

    attach() {
        this.socket.on('message', (d, c) => this.onMessage(this.socket, d, c));
        this.socket.on('newchat', (d, c) => this.onNewChat(this.socket, d, c));
        this.socket.on('seen', (d, c) => this.onSeen(this.socket, d, c));
    }

    async onMessage(socket, data, listener) {
        /**
         * data: {
         *     chat: 'chat_id',
         *     from: 'from_id',
         *     message: 'message'
         * }
         */
        const {chat, from, message} = data;
        console.log('message', data);

        try {
            await dbChatMessage.saveMessage(from, chat, message);

            const chatInfo = await dbChat.getChatById(chat);
            // Send message to other participants
            chatInfo['participants']
                .filter(participantId => participantId !== from)
                .forEach(participantId => {
                    socket.in(participantId).emit('message', data);
                });

            listener('delivered');
        } catch (error) {
            console.log(error);
            listener('failed');
        }
    }

    async onNewChat(socket, data, listener) {
        /**
         * data: {
         *     from: 'from_id',
         *     to: 'to_id'
         * }
         */
        const {from, to} = data;
        console.log('newchat', data);

        try {
            await dbChat.getChatOrCreate(from, to);

            // Send event with new chats
            const toChats = await dbChat.getChatsWithUser(to);
            socket.in(to).emit('allchats', {chats: toChats});

            const fromChats = await dbChat.getChatsWithUser(from);
            socket.in(from).emit('allchats', {chats: fromChats});
            socket.emit('allchats', {chats: fromChats});
            listener('success');
        } catch (error) {
            console.log(error);
            listener('failed');
        }
    }

    async onSeen(socket, data, listener) {
        /**
         * data: {
         *     user: 'user_id',
         *     chat: 'chat_id'
         * }
         */
        const {user, chat} = data;
        console.log('seen', data);

        try {
            await dbChatMessage.markMessagesAsSeen(chat, user);
            listener('success');
        } catch (error) {
            console.log(error);
            listener('failed');
        }
    }
}

async function onConnect(socket) {
    try {
        const userId = socket.handshake.query.user;
        console.log('connection', userId);

        const userData = await dbUser.findUserById(userId);

        if (userData['meta'].success) {
            socket.join(userId);

            const handlers = new EventHandlers(socket);
            handlers.attach();
        } else {
            console.log('disc');
            socket.disconnect();
        }
    } catch (error) {
        console.log('disc');
        socket.disconnect();
    }
}

module.exports = {
    initialize: (io) => {
        io.on('connection', onConnect)
    }
};

