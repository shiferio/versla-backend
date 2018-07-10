const router = require('express').Router();

const dbRequests = require('../utils/db/db.requests');

router.route('/add', async (req, res) => {
    let data = await dbRequests.addError(req.body);
    return res.status(data['meta'].code).send(data);
});

module.exports = router;