const qs = require('qs');
const ObjectId = require('mongoose').Types.ObjectId;


function buildForGoods(query, filter) {
    query = (query || '')
        .trim()
        .split(/\s+/)
        .map(tag => new RegExp(tag, 'i'));

    filter = qs.parse(filter);

    const db_filter = {
        '$or': [
            { name: { '$in': query } },
            { description: { '$in': query } },
            { short_description: { '$in': query } },
            { tags: { '$in': query } }
        ], is_available: true
    };

    if (filter['category']) {
        db_filter['category'] = new ObjectId(filter['category']);
    }

    if (filter['city']) {
        db_filter['city'] = new ObjectId(filter['city']);
    }

    if (filter['store']) {
        db_filter['store_id'] = new ObjectId(filter['store']);
    }

    if (filter['rating']) {
        db_filter['rating'] = {
            '$gte': Number.parseInt(filter['rating'])
        };
    }

    if (filter['min_price']) {
        db_filter['price'] = {};
        db_filter['price']['$gte'] = Number.parseInt(filter['min_price'])
    }

    if (filter['max_price']) {
        db_filter['price']['$lte'] = Number.parseInt(filter['max_price'])
    }

    return db_filter;
}

function buildForPurchases(query, filter) {
    query = (query || '')
        .trim()
        .split(/\s+/)
        .map(tag => new RegExp(tag, 'i'));

    filter = qs.parse(filter);

    const db_filter = {
        '$or': [
            { name: { '$in': query } },
            { description: { '$in': query } }
        ],
        state: {
            '$in': [0, 1, 2]
        }
    };

    if (filter['volume']) {
        db_filter['volume'] = {
            '$gte': Number.parseFloat(filter['volume'])
        };
    }

    if (filter['min_volume']) {
        db_filter['min_volume'] = {
            '$gte': Number.parseFloat(filter['min_volume'])
        };
    }

    if (filter['category']) {
        db_filter['category'] = new ObjectId(filter['category']);
    }

    /*
    if (filter['city']) {
        db_filter['city'] = new ObjectId(filter['city']);
    }
    */

    if (filter['date']) {
        const date = filter['date'];

        const day = Number.parseInt(date.slice(0, 2));
        const month = Number.parseInt(date.slice(2, 4)) - 1;
        const year = Number.parseInt(date.slice(4, 8));

        db_filter['date'] = {
            '$gte': new Date(year, month, day)
        };
    }

    if (filter['min_price']) {
        db_filter['price_per_unit'] = {};
        db_filter['price_per_unit']['$gte'] = Number.parseInt(filter['min_price'])
    }

    if (filter['max_price']) {
        db_filter['price_per_unit']['$lte'] = Number.parseInt(filter['max_price'])
    }

    return db_filter;
}

module.exports = {
    buildForGoods: buildForGoods,
    buildForPurchases: buildForPurchases
};
