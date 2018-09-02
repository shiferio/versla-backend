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
 * @api {get} /api/search/any/:pageNumber/:pageSize?query=:query&filter=:filter Search goods by any fields
 * @apiName SearchGoodsByAnyFields
 * @apiGroup Search
 *
 * @apiDescription Search goods by name, tags, short and detailed description.
 *                 There is one query parameter that must be met at least in one field.
 *
 * @apiParam {Number} pageNumber Page Number
 * @apiParam {Number} pageSize Page Size
 * @apiParam {String} query One or more words by which goods will be searched
 * @apiParam {Object} filter JSON object that specifies category, city, store and rating
 *
 * @apiSuccess {Object} goods Array of goods
 * @apiSuccess {Number} total Total count of goods satisfies query
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Successfully get goods"
 *     },
 *     data: {
 *      "goods": [],
 *      "total": 0
 *     }
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
