const dbChatMessage = require('../utils/db/db.chatmessage');
const Chat = require('../models/chat');

async function onConnect(socket) {
    try {
        const room = socket.handshake.query.chat;

        const chat = await Chat
            .findOne({_id: room})
            .exec();

        if (chat) {
            socket.join(room);

            socket.on('message', async function (data, listener) {
                const {from, message} = data;
                console.log(`From ${from}: ${message}`);

                await dbChatMessage.saveMessage(from, room, message);

                listener('delivered');
                socket.in(room).emit('message', data);
            });
        } else {
            socket.disconnect();
        }
    } catch (error) {
        socket.disconnect();
    }
}

module.exports = {
    initialize: (io) => {
        io.on('connection', onConnect)
    }
};

