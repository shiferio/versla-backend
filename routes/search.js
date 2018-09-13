const router = require('express').Router();
const {buildForGoods, PurchaseFilterBuilder, GoodPurchaseFilterBuilder} = require('../utils/search/filter');

const Good = require('../models/good');
const dbJointPurchase = require('../utils/db/db.Jointpurchase');
const {getSubcategories} = require('../utils/db/db.gcategory');
const qs = require('qs');


/**
 * @api {get} /api/search/all/:pageNumber/:pageSize Search goods by all fields
 * @apiName SearchGoodsByAllFields
 * @apiGroup Search
 *
 * @apiDescription Search goods by name, tags, short and detailed description.
 *                 There must be separate query parameter for each field.
 *                 Found goods must be met every query parameter.
 *
 * @apiParam {Number} pageNumber Page Number
 * @apiParam {Number} pageSize Page Size
 *
 * @apiSuccess {Object} goods Array of goods
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Successfully get goods"
 *     },
 *     data: {
 *      "goods": []
 *     }
 */
router.get('/all/:pageNumber/:pageSize', (req, res) => {
    const filter = {};
    if (req.query.name) {
        filter['name'] = {'$regex': new RegExp(req.query.name, 'i')};
    }
    if (req.query.description) {
        filter['description'] = {'$regex': new RegExp(req.query.description, 'i')};
    }
    if (req.query.short_description) {
        filter['short_description'] = {'$regex': new RegExp(req.query.short_description, 'i')};
    }
    if (req.query.tags) {
        filter['tags'] = {
            '$in': req.query.tags
                .trim()
                .split(/\s+/)
                .map(tag => new RegExp(tag, 'i'))
        };
    }

    const pageNumber = Number.parseInt(req.params.pageNumber);
    const pageSize = Number.parseInt(req.params.pageSize);

    const exclude = {
        params: 0,
        creator_id: 0,
        __v: 0
    };

    Good
        .find(filter, exclude)
        .hint('goods_search')
        .skip(pageNumber > 0 ? ((pageNumber - 1) * pageSize) : 0)
        .limit(pageSize)
        .exec((err, goods) => {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get goods"
                },
                data: {
                    goods: goods
                }
            })
        })
});

/**
 * @api {get} /api/search/any/:pageNumber/:pageSize?<query string>
 * @apiName Search Goods by any field
 * @apiGroup Search
 *
 * @apiDescription Search goods by name, tags, short and detailed description.
 *                 There is one query parameter that must be met at least in one field.
 *
 * Path parameters
 *
 * @apiParam {Number} pageNumber Page Number
 * @apiParam {Number} pageSize Page Size
 *
 * Query string parameters
 *
 * @apiParam {String} query String of words by which search will be performed
 * @apiParam {String} filter.category Category ID
 * @apiParam {String} filter.city City ID
 * @apiParam {String} filter.store Store ID
 * @apiParam {Number} filter.rating Minimum rating for good
 * @apiParam {Number} filter.min_price Minimum price for good
 * @apiParam {Number} filter.max_price Maximum price for good
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Successfully get goods"
 *     },
 *     data: {
 *      "goods": [
 *       {
 *        "_id": "5b5b3014f6a7cf271ad37b96",
 *        "tags": [
 *          "fre"
 *        ],
 *        "rating": 0,
 *        "is_available": true,
 *        "is_promoted": false,
 *        "params": [],
 *        "created": "2018-07-27T14:45:40.902Z",
 *        "store_id": "5b589467505ebe4fe345d44f",
 *        "creator_id": "5b589346505ebe4fe345d44c",
 *        "price": 100,
 *        "name": "Name",
 *        "category": "5b632e70f774a265c57a97ae",
 *        "city": "5b5876e4fb6fc0105da12d92",
 *        "picture": "http://images2.versla.ru/images/1531294.jpg"
 *       },
 *       {
 *        "_id": "5b86cf1f02d08e52e8f68b1b",
 *        "purchase_info": {
 *         "wholesale_price": null,
 *         "min_volume": 5,
 *         "purchase_enabled": true
 *        },
 *        "tags": [
 *         "123"
 *        ],
 *        "rating": 4,
 *        "is_available": true,
 *        "is_promoted": false,
 *        "store_id": "5b589467505ebe4fe345d44f",
 *        "creator_id": "5b589346505ebe4fe345d44c",
 *        "price": 23.54,
 *        "name": "Name",
 *        "picture": "http://images2.versla.ru/images/15301.png",
 *        "volume": 210,
 *        "params": [],
 *        "created": "2018-08-29T16:51:43.026Z",
 *        "category": "5b5cbe07bd8f590524201dcf",
 *        "city": "5b5876e4fb6fc0105da12d92",
 *        "description": "Description",
 *        "short_description": ""
 *       }
 *      ],
 *      "total": 10
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": "Unexpected error"
 *     },
 *     "data": null
 */
router.get('/any/:pageNumber/:pageSize', async (req, res) => {
    const db_filter = buildForGoods(req.query['query'], req.query['filter']);

    const pageNumber = Number.parseInt(req.params.pageNumber);
    const pageSize = Number.parseInt(req.params.pageSize);

    const exclude = {
        __v: 0
    };

    try {
        const skip = pageNumber > 0 ? ((pageNumber - 1) * pageSize) : 0;
        const limit = pageSize;

        const result = await Good.aggregate([
            {
                '$facet': {
                    goods: [
                        {'$match': db_filter},
                        {'$project': exclude},
                        {'$skip': skip},
                        {'$limit': limit}
                    ],
                    total: [
                        {'$match': db_filter},
                        {'$count': 'total'}
                    ]
                }
            }
        ]);

        const goods = result[0]['goods'];
        const total = result[0]['total'].length ? result[0]['total'][0]['total'] : 0;

        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully get goods"
            },
            data: {
                goods: goods,
                total: total
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            meta: {
                code: 500,
                success: false,
                message: "Unexpected error"
            },
            data: null
        });
    }
});

/**
 * @api {get} /api/search/jointpurchases/:pageNumber/:pageSize?<query string>
 * @apiName Search Joint purchases
 * @apiGroup Search
 *
 * @apiDescription Search joint purchases by name, tags, short and detailed description.
 *                 There is one query parameter that must be met at least in one field.
 *
 * Path parameters
 *
 * @apiParam {Number} pageNumber Page Number
 * @apiParam {Number} pageSize Page Size
 *
 * Query string parameters
 *
 * @apiParam {String} query String of words by which search will be performed
 * @apiParam {Number} filter.volume Minimum volume
 * @apiParam {Number} filter.min_volume Minimum volume to order
 * @apiParam {String} filter.date Earliest order acceptance deadline
 * @apiParam {String} filter.category Category ID (search performed by category and its subcategories
 * @apiParam {String} filter.city City ID
 * @apiParam {Number} filter.min_price Minimum price for joint purchase
 * @apiParam {Number} filter.max_price Maximum price for joint purchase
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "FOUND"
 *     },
 *     data: {
 *      "purchases": [
 *       {
 *        "_id": "5b66ded53441dc10535efc89",
 *        "black_list": [],
 *        "is_public": true,
 *        "white_list": [],
 *        "name": "Purchase",
 *        "picture": "http://images.versla.ru/images/1533468384.png",
 *        "description": "Description",
 *        "category": "5b5afbf9d94cc90f069b3741",
 *        "creator": "5b589346505ebe4fe345d44c",
 *        "address": "Address",
 *        "volume": 800,
 *        "min_volume": 10,
 *        "remaining_volume": 745,
 *        "price_per_unit": 15,
 *        "measurement_unit": {
 *         "_id": "5b5afbedd94cc90f069b3740",
 *         "name": "кг",
 *         "user": "5b589346505ebe4fe345d44c"
 *        },
 *        "date": "2018-08-22T21:00:00.000Z",
 *        "state": 0,
 *        "payment_type": 2,
 *        "payment_info": "Info",
 *        "history": [],
 *        "participants": [
 *         {
 *          "fake_user": {
 *           "login": "user"
 *          },
 *          "paid": "2018-08-27T21:00:00.000Z",
 *          "delivered": false,
 *          "sent": null,
 *          "_id": "5b8103856a54531bc3bce7e8",
 *          "volume": 55
 *         }
 *        ],
 *        "volume_dec": {
 *         "$numberDecimal": "800.000000000000"
 *        },
 *        "min_volume_dec": {
 *         "$numberDecimal": "10.0000000000000"
 *        },
 *        "recent": {
 *         "_id": "5b990ff38e838629a80e239b",
 *         "parameter": "fake_participants.detached",
 *         "value": {
 *          "user": "user",
 *          "volume": "10"
 *         },
 *         "date": "2018-09-12T13:09:07.972Z"
 *        }
 *       },
 *       {
 *        "_id": "5b8ce7bb007a642d54e43a2b",
 *        "black_list": [],
 *        "is_public": true,
 *        "name": "Purchase",
 *        "picture": "http://images2.versla.ru/images/1535960939.png",
 *        "description": "",
 *        "category": "5b5afbf9d94cc90f069b3741",
 *        "creator": "5b589346505ebe4fe345d44c",
 *        "address": "Address",
 *        "city": "5b804d216cc9950579006aad",
 *        "volume_dec": {
 *         "$numberDecimal": "5"
 *        },
 *        "min_volume_dec": {
 *         "$numberDecimal": "2.5"
 *        },
 *        "price_per_unit": 45.54,
 *        "measurement_unit": {
 *         "_id": "5b5afbedd94cc90f069b3740",
 *         "name": "кг",
 *         "user": "5b589346505ebe4fe345d44c"
 *        },
 *        "date": "2018-09-10T21:00:00.000Z",
 *        "state": 0,
 *        "payment_type": 2,
 *        "payment_info": "",
 *        "history": [],
 *        "good": "5b8ce76d007a642d54e43a2a",
 *        "participants": []
 *        "recent": {
 *         "_id": "5b8ce9d3007a642d54e43a2d",
 *         "parameter": "date",
 *         "value": "Tue Sep 11 2018",
 *         "date": "2018-09-03T07:59:15.567Z"
 *        },
 *        "volume": 5,
 *        "min_volume": 2.5,
 *        "remaining_volume": 5
 *       }
 *      ]
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.get('/jointpurchases/:pageNumber/:pageSize', async (req, res) => {
    const filter = qs.parse(req.query['filter']);
    let categoriesData = {};

    const builder = new PurchaseFilterBuilder()
        .text(req.query['query'])
        .price(filter['min_price'], filter['max_price']);

    if (filter['volume']) builder.volume(filter['volume']);
    if (filter['min_volume']) builder.minVolume(filter['min_volume']);
    if (filter['date']) builder.date(filter['date']);
    if (filter['city']) builder.city(filter['city']);
    if (filter['category']) {
        categoriesData = await getSubcategories(filter['category']);
        builder.category(categoriesData['categories']);
    }

    const pageNumber = Number.parseInt(req.params.pageNumber);
    const pageSize = Number.parseInt(req.params.pageSize);

    try {
        const skip = pageNumber > 0 ? ((pageNumber - 1) * pageSize) : 0;
        const limit = pageSize;

        const data = await dbJointPurchase
            .findByFilter(builder.build(), skip, limit, categoriesData['order']);

        res.json({
            meta: {
                code: 200,
                success: true,
                message: 'FOUND'
            },
            data: data
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            meta: {
                code: 500,
                success: false,
                message: error.message || 'UNKNOWN ERROR'
            },
            data: null
        });
    }
});

/**
 * @api {get} /api/search/goodpurchases/:pageNumber/:pageSize?<query string>
 * @apiName Search Joint purchases for goods
 * @apiGroup Search
 *
 * @apiDescription Search joint purchases by good and category
 *
 * Path parameters
 *
 * @apiParam {Number} pageNumber Page Number
 * @apiParam {Number} pageSize Page Size
 *
 * Query string parameters
 *
 * @apiParam {String} filter.city_id City ID
 * @apiParam {String} filter.good_id Good ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "FOUND"
 *     },
 *     data: {
 *      "purchases": [
 *       {
 *        "_id": "5b8ce7bb007a642d54e43a2b",
 *        "black_list": [],
 *        "is_public": true,
 *        "name": "Purchase",
 *        "picture": "http://images2.versla.ru/images/1535960939.png",
 *        "description": "",
 *        "category": "5b5afbf9d94cc90f069b3741",
 *        "creator": "5b589346505ebe4fe345d44c",
 *        "address": "Address",
 *        "city": "5b804d216cc9950579006aad",
 *        "volume_dec": {
 *         "$numberDecimal": "5"
 *        },
 *        "min_volume_dec": {
 *         "$numberDecimal": "2.5"
 *        },
 *        "price_per_unit": 45.54,
 *        "measurement_unit": {
 *         "_id": "5b5afbedd94cc90f069b3740",
 *         "name": "кг",
 *         "user": "5b589346505ebe4fe345d44c"
 *        },
 *        "date": "2018-09-10T21:00:00.000Z",
 *        "state": 0,
 *        "payment_type": 2,
 *        "payment_info": "",
 *        "history": [],
 *        "good": "5b8ce76d007a642d54e43a2a",
 *        "participants": []
 *        "recent": {
 *         "_id": "5b8ce9d3007a642d54e43a2d",
 *         "parameter": "date",
 *         "value": "Tue Sep 11 2018",
 *         "date": "2018-09-03T07:59:15.567Z"
 *        },
 *        "volume": 5,
 *        "min_volume": 2.5,
 *        "remaining_volume": 5
 *       }
 *      ]
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.get('/goodpurchases', async (req, res) => {
    const filter = qs.parse(req.query['filter']);

    const builder = new GoodPurchaseFilterBuilder();
    if (filter['good_id']) builder.good(filter['good_id']);
    if (filter['city_id']) builder.city(filter['city_id']);

    try {
        const data = await dbJointPurchase
            .findGoodByFilter(builder.build());

        res.json({
            meta: {
                code: 200,
                success: true,
                message: 'FOUND'
            },
            data: data
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            meta: {
                code: 500,
                success: false,
                message: error.message || 'UNKNOWN ERROR'
            },
            data: null
        });
    }
});

module.exports = router;
