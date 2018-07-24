const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');

const dbMeasurementUnit = require('../utils/db/db.measurementunit');

/**
 * @api {post} /api/measurementunit/add Add Measurement unit
 * @apiName Add Measurement unit
 * @apiGroup Measurement units
 *
 * @apiParam {String} name
 */
router.route('/add').post(checkJWT, async (req, res) => {
    const data = await dbMeasurementUnit.addUnit(req.body.name, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

/**
 * @api {get} /api/measurementunit/get/:id Get Measurement unit by ID
 * @apiName Get Measurement unit
 * @apiGroup Measurement units
 *
 * @apiParam {String} id Measurement unit ID
 */
router.get('/get/:id', async (req, res) => {
    const data = await dbMeasurementUnit.getUnitById(req.params.id);
    return res.status(data['meta'].code).send(data);
});

/**
 * @api {get} /api/measurementunit/get/:id Get all Measurement units
 * @apiName Get Measurement units
 * @apiGroup Measurement units
 */
router.get('/get', async (req, res) => {
    const data = await dbMeasurementUnit.getAllUnits();
    return res.status(data['meta'].code).send(data);
});

module.exports = router;
