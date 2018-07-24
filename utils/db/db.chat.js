const Chat = require('../../models/chat');
const pre = require('preconditions').singleton();

module.exports = {
    getChatOrCreate: async (fromUserId, toUserId) => {
        pre
            .shouldBeString(toUserId, 'MISSED USER ID')
            .checkArgument(toUserId.length === 24, 'INVALID ID');

        const updateInfo = await Chat
            .updateOne({
                participants: {
                    '$all': [
                        {'$elemMatch': {'$eq': fromUserId.toString()}},
                        {'$elemMatch': {'$eq': toUserId}}
                    ],
                    '$size': 2
                }
            }, {
                '$set': {
                    participants: [fromUserId.toString(), toUserId]
                }
            }, {
                'upsert': true
            })
            .exec();

        const chat = await Chat
            .findById(updateInfo.upserted[0]._id);

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
    }
};
