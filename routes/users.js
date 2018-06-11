const router = require('express').Router();

const dbUsers = require('../utils/db/db.users');


router.get('/find/login/:login', async (req, res) => {
    let data = await dbUsers.findUserByLogin(req.params.login);
    return res.status(data['meta'].code).send(data);
});


router.get('/find/id/:id', async (req, res) => {
    let data = await dbUsers.findUserById(req.params.id);
    return res.status(data['meta'].code).send(data);
});


module.exports = router;