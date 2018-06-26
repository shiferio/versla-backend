const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-plugin-autoinc').autoIncrement;
const mongoolia = require('mongoolia').default;
const mongooseAlgolia = require('mongoose-algolia');

const GoodSchema = new Schema({
    good_id: {
        type: Number,
        unique: true
    },
    price: Number,
    name: String,
    description: String,
    short_description: String,
    picture: String,
    tags: [String],
    creator_id: {type: Schema.Types.ObjectId, ref: 'User'},
    store_id: {type: Schema.Types.ObjectId, ref: 'Store'},
    params: [
        {
            name: String,
            values: [String]
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    type: String,
    is_available: {
        type: Boolean,
        default: true
    },
    is_promoted: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

GoodSchema.plugin(autoIncrement, {model: 'Good', field: 'good_id', startAt: 1, incrementBy: 1});

GoodSchema.plugin(mongoolia, {
    appId: '1BL49RG52N',
    apiKey: 'fd368d8e55e2feea7d8e447cb2653ed9',
    indexName: 'dev_versla'
}).plugin(mongooseAlgolia,{
    appId: '1BL49RG52N',
    apiKey: 'fd368d8e55e2feea7d8e447cb2653ed9',
    indexName: 'dev_versla',
    selector: '-author',
    defaults: {
        author: 'unknown'
    },
    mappings: {
        title: function(value) {
            return `:${value}`
        }
    },
    filter: function(doc) {
        return !doc.softdelete
    },
    debug: true
});

let Model = mongoose.model('Good', GoodSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
    searchableAttributes: ['name','tags','short_description'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
});
module.exports = Model;

