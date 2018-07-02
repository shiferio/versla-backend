// const GoodEntry = require('../../models/gentry');
// const StoreEntry = require('../../models/sentry');
// const mongoose = require('mongoose');
//
// module.exports = {
//     /**
//      * Add category
//      * @param data Data of new Category
//      * @param userId Creator id
//      * @returns {Promise<*>}
//      */
//     addGoodEntry: async (data) => {
//         let foundEntry = await GoodCategory.findOne().where("good_id").in(data.good_id).in(data.good_id).exec();
//         if (categories) {
//         let entry = new GoodEntry();
//         entry.ip = data.ip;
//         entry.user = mongoose.Types.ObjectId(data.user_id);
//         entry.store = mongoose.Types.ObjectId(data.store_id);
//         entry.good = mongoose.Types.ObjectId(data.good_id);
//         entry.type = data.type;
//         entry.visits = [{ date: Date.now() }];
//
//             (req.headers['x-forwarded-for'] ||
//             req.connection.remoteAddress ||
//             req.socket.remoteAddress ||
//             req.connection.socket.remoteAddress).split(",")[0];
//
//         category.user = mongoose.Types.ObjectId(userId);
//         category.name = data.name;
//
//         category.save();
//
//         return {
//             meta: {
//                 code: 200,
//                 success: true,
//                 message: "Category successfully added"
//             },
//             data: {
//                 category: category
//             }
//         };
//     }
// };