const router = require('express').Router();
const qs = require('qs');

const Good = require('../models/good');


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
        filter['name'] = { '$regex': new RegExp(req.query.name, 'i') };
    }
    if (req.query.description) {
        filter['description'] = { '$regex': new RegExp(req.query.description, 'i') };
    }
    if (req.query.short_description) {
        filter['short_description'] = { '$regex': new RegExp(req.query.short_description, 'i') };
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
 * @api {get} /api/search/any/:pageNumber/:pageSize?query=:query Search goods by any fields
 * @apiName SearchGoodsByAnyFields
 * @apiGroup Search
 *
 * @apiDescription Search goods by name, tags, short and detailed description.
 *                 There is one query parameter that must be met at least in one field.
 *
 * @apiParam {Number} pageNumber Page Number
 * @apiParam {Number} pageSize Page Size
 * @apiParam {String} query One or more words by which goods will be searched
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
router.get('/any/:pageNumber/:pageSize', (req, res) => {
    const query = (req.query.query || '')
        .trim()
        .split(/\s+/)
        .map(tag => new RegExp(tag, 'i'));

    const filter = qs.parse(req.query['filter']);

    let db_filter = {
        '$or': [
            { name: { '$in': query } },
            { description: { '$in': query } },
            { short_description: { '$in': query } },
            { tags: { '$in': query } }
        ]
    };

    db_filter = Object.assign(db_filter, filter);

    const pageNumber = Number.parseInt(req.params.pageNumber);
    const pageSize = Number.parseInt(req.params.pageSize);

    const exclude = {
        params: 0,
        creator_id: 0,
        __v: 0
    };

    Good
        .find(db_filter, exclude)
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

module.exports = router;
