const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');

const dbGoodCategory = require('../utils/db/db.gcategory');
const dbStoreCategory = require('../utils/db/db.scategory');

router.route('/add/good').post(checkJWT, async (req, res) => {
    let data = await dbGoodCategory.addCategory(req.body, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

router.get('/get/good', async (req, res) => {
    let data = await dbGoodCategory.getCategories();
    return res.status(data['meta'].code).send(data);
});

router.get('/get/good/id/:id', async (req, res) => {
    let data = await dbGoodCategory.getCategoryById(req.params.id);
    return res.status(data['meta'].code).send(data);
});

router.route('/add/store').post(checkJWT, async (req, res) => {
    let data = await dbStoreCategory.addCategory(req.body, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

router.get('/get/store', async (req, res) => {
    let data = await dbStoreCategory.getCategories();
    return res.status(data['meta'].code).send(data);
});

router.get('/get/store/id/:id', async (req, res) => {
    let data = await dbStoreCategory.getCategoryById(req.params.id);
    return res.status(data['meta'].code).send(data);
});

module.exports = router;