const router = require('express').Router();
const dbRequests = require('../utils/db/db.requests');

router.post('/add', async (req, res) => {
    let data = await dbRequests.addFeature(req.body);
    return res.status(data['meta'].code).send(data);
});

module.exports = router;