const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');

const dbCity = require('../utils/db/db.city');

router.post('/add', async (req, res) => {
    let data = await dbCity.addCity(req.body);
    return res.status(data['meta'].code).send(data);
});

router.get('/all', async (req, res) => {
    let data = await dbCity.getCities();
    return res.status(data['meta'].code).send(data);
});

router.get('/id/:id', async (req, res) => {
    let data = await dbCity.getCityById(req.params.id);
    return res.status(data['meta'].code).send(data);
});


module.exports = router;