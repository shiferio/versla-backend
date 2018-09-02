const qs = require('qs');
const ObjectId = require('mongoose').Types.ObjectId;


class Comparator {

    constructor(predicateLess) {
        this._predicate = predicateLess;
    }

    compare(first, second) {
        if (this._predicate(first, second)) {
            return -1;
        } else if (this._predicate(second, first)) {
            return 1;
        } else {
            return 0;
        }
    }

}


class PurchaseFilterBuilder {

    constructor() {
        this._filter = {
            state: {
                '$in': [0, 1]
            },
            is_public: true
        };
    }

    text(text) {
        text = (text || '')
            .trim()
            .split(/\s+/)
            .map(tag => new RegExp(tag, 'i'));

        this._filter['$or'] = [
            { name: { '$in': text } },
            { description: { '$in': text } }
        ];

        return this;
    }

    volume(volume) {
        if (typeof volume === 'string') {
            volume = Number.parseFloat(volume);
        }
        this._filter['volume'] = {
            '$gte': volume
        };

        return this;
    }

    minVolume(minVolume) {
        if (typeof minVolume === 'string') {
            minVolume = Number.parseFloat(minVolume);
        }
        this._filter['min_volume'] = {
            '$gte': minVolume
        };

        return this;
    }

    category(categories) {
        this._filter['category'] = {
            '$in': categories
        };

        return this;
    }

    city(cityId) {
        this._filter['city'] = new ObjectId(cityId);

        return this;
    }

    date(date) {
        const day = Number.parseInt(date.slice(0, 2));
        const month = Number.parseInt(date.slice(2, 4)) - 1;
        const year = Number.parseInt(date.slice(4, 8));

        this._filter['date'] = {
            '$gte': new Date(year, month, day)
        };

        return this;
    }

    price(min, max) {
        if (min || max) {
            this._filter['price_per_unit'] = {};
        }

        if (min) {
            if (typeof min === 'string') {
                min = Number.parseInt(min);
            }
            this._filter['price_per_unit']['$gte'] = min
        }

        if (max) {
            if (typeof max === 'string') {
                max = Number.parseInt(max);
            }
            this._filter['price_per_unit']['$lte'] = max
        }

        return this;
    }

    build() {
        return Object.assign({}, this._filter);
    }

}


class GoodPurchaseFilterBuilder {

    constructor() {
        this._filter = {
            state: {
                '$in': [0, 1]
            },
            is_public: true
        };
    }

    city(cityId) {
        this._filter['city'] = ObjectId(cityId);

        return this;
    }

    good(goodId) {
        this._filter['good'] = ObjectId(goodId);

        return this;
    }

    volume(volume) {
        if (typeof volume === 'string') {
            volume = Number.parseFloat(volume);
        }
        this._filter['volume'] = {
            '$gte': volume
        };

        return this;
    }

    minVolume(minVolume) {
        if (typeof minVolume === 'string') {
            minVolume = Number.parseFloat(minVolume);
        }
        this._filter['min_volume'] = {
            '$gte': minVolume
        };

        return this;
    }

    category(categories) {
        this._filter['category'] = {
            '$in': categories
        };

        return this;
    }

    date(date) {
        const day = Number.parseInt(date.slice(0, 2));
        const month = Number.parseInt(date.slice(2, 4)) - 1;
        const year = Number.parseInt(date.slice(4, 8));

        this._filter['date'] = {
            '$gte': new Date(year, month, day)
        };

        return this;
    }

    price(min, max) {
        if (min || max) {
            this._filter['price_per_unit'] = {};
        }

        if (min) {
            if (typeof min === 'string') {
                min = Number.parseInt(min);
            }
            this._filter['price_per_unit']['$gte'] = min
        }

        if (max) {
            if (typeof max === 'string') {
                max = Number.parseInt(max);
            }
            this._filter['price_per_unit']['$lte'] = max
        }

        return this;
    }

    build() {
        return Object.assign({}, this._filter);
    }

}


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

module.exports = {
    buildForGoods: buildForGoods,
    PurchaseFilterBuilder,
    GoodPurchaseFilterBuilder,
    Comparator
};
