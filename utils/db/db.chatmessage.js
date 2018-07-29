const ChatMessage = require('../../models/chatmessage');
const pre = require('preconditions').singleton();
const mongoose = require('mongoose');

module.exports = {
    saveMessage: async (fromId, chatId, message) => {
        pre
            .shouldBeString(fromId, 'MISSED USER ID')
            .checkArgument(fromId.length === 24, 'INVALID ID')
            .shouldBeString(chatId, 'MISSED CHAT ID')
            .checkArgument(chatId.length === 24, 'INVALID ID')
            .shouldBeString(message, 'MISSED MESSAGE');

        const chatMessage = ChatMessage({
            chat: mongoose.Types.ObjectId(chatId),
            from: mongoose.Types.ObjectId(fromId),
            message: message
        });

        await chatMessage.save();
    },

    getChatHistory: async (chatId) => {
        pre
            .shouldBeString(chatId, 'MISSED CHAT ID')
            .checkArgument(chatId.length === 24, 'INVALID ID');

        const history = await ChatMessage
            .find({
                chat: mongoose.Types.ObjectId(chatId)
            })
            .sort('date')
            .exec();

        if (history) {
            return history;
        } else {
            return [];
        }
    },

    markMessagesAsSeen: async (chatId, userId) => {
        pre
            .shouldBeString(chatId, 'MISSED CHAT ID')
            .checkArgument(chatId.length === 24, 'INVALID ID');

        await ChatMessage
            .updateMany({
                chat: mongoose.Types.ObjectId(chatId),
                seen: {
                    '$nin': userId.toString()
                }
            }, {
                '$addToSet': {
                    seen: userId.toString()
                }
            })
            .exec();
    }
};
