const router = require('express').Router();

const Good = require('../models/good');


router.get('/', (req, res) => {
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
                .split(new RegExp('\\s'))
                .map(tag => new RegExp(tag, 'i'))
        };
    }

    const pageNumber = req.query.pageNumber || 0;
    const pageSize = req.query.pageSize || 6;

    const exclude = {
        params: 0,
        creator_id: 0,
        __v: 0
    };

    Good
        .find(filter, exclude)
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
