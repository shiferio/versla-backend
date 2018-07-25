const Chat = require('../../models/chat');
const pre = require('preconditions').singleton();

module.exports = {
    getChatOrCreate: async (fromUserId, toUserId) => {
        pre
            .shouldBeString(toUserId, 'MISSED USER ID')
            .checkArgument(toUserId.length === 24, 'INVALID ID')
            .checkArgument(toUserId !== fromUserId.toString(), 'IDs ARE THE SAME');

        const chat = await Chat
            .findOneAndUpdate({
                participants: {
                    '$all': [
                        {'$elemMatch': {'$eq': fromUserId.toString()}},
                        {'$elemMatch': {'$eq': toUserId}}
                    ],
                    '$size': 2
                }
            }, {
                '$setOnInsert': {
                    participants: [fromUserId.toString(), toUserId]
                }
            }, {
                'upsert': true,
                'new': true
            })
            .exec();

        if (chat) {
            return chat;
        } else {
            throw new Error('CAN NOT CREATE');
        }
    },

    getChatsWithUser: async (userId) => {
        const chats = await Chat
            .find({
                participants: {
                    '$in': [userId.toString()]
                }
            })
            .exec();

        if (chats) {
            return chats;
        } else {
            return [];
        }
    },

    getChatById: async (chatId) => {
        pre
            .shouldBeString(chatId, 'MISSED CHAT ID')
            .checkArgument(chatId.length === 24, 'INVALID ID');

        const chat = await Chat
            .findById(chatId)
            .exec();

        if (chat) {
            return chat;
        } else {
            throw new Error('NO SUCH CHAT');
        }
    }
};
