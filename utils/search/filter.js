const qs = require('qs');
const ObjectId = require('mongoose').Types.ObjectId;


function build(query, filter) {
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
        ]
    };

    if (filter['category']) {
        db_filter['category'] = new ObjectId(filter['category']);
    }

    if (filter['city']) {
        db_filter['city'] = new ObjectId(filter['city']);
    }

    if (filter['rating']) {
        db_filter['rating'] = {
            '$gte': Number.parseInt(filter['rating'])
        };
    }

    if (filter['min_price']) {
        db_filter['price'] = {
            '$gte': Number.parseInt(filter['min_price'])
        }
    }

    if (filter['max_price']) {
        db_filter['price'] = {
            '$lte': Number.parseInt(filter['max_price'])
        }
    }

    return db_filter;
}

module.exports = {
    build: build
};
