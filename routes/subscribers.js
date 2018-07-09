const router = require('express').Router();

const dbSubscriber = require('../utils/db/db.subscriber');

router.post('/subscribe', async (req, res) => {
    let data = await dbSubscriber.subscribe(req.body);
    return res.status(data['meta'].code).send(data);
});

router.post('/unsubscribe', async (req, res) => {
    let data = await dbSubscriber.unsubscribe(req.body);
    return res.status(data['meta'].code).send(data);
});

router.post('/subscribers', async (req, res) => {
    let data = await dbSubscriber.getSubscribers();
    return res.status(data['meta'].code).send(data);
});

module.exports = router;