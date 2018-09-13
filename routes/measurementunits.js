const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');

const dbMeasurementUnit = require('../utils/db/db.measurementunit');

/**
 * @api {post} /api/measurementunits/add Add Measurement unit
 * @apiName Add Measurement unit
 * @apiGroup Measurement units
 *
 * @apiParam {String} name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "Measurement unit successfully added"
 *     },
 *     "data": {
 *      "unit": {
 *       name: "name",
 *       user: "5b589346505ebe4fe345d44c"
 *      }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": "Error during measurement unit adding"
 *     },
 *     "data": null
 */
router.route('/add').post(checkJWT, async (req, res) => {
    const data = await dbMeasurementUnit.addUnit(req.body.name, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

/**
 * @api {get} /api/measurementunits/get/:id Get Measurement unit by ID
 * @apiName Get Measurement unit
 * @apiGroup Measurement units
 *
 * @apiParam {String} id Measurement unit ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *       "code": 200,
 *       "success": true,
 *       "message": "Successfully get measurement unit"
 *     },
 *     "data": {
 *      "unit": {
 *       "_id": "5b7e475232123500b5c34afe",
 *       "name": "name",
 *       "user": "5b7e467d32123500b5c34afd"
 *      }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     "meta": {
 *      "code": 404,
 *      "success": false,
 *      "message": "No unit with such ID"
 *     },
 *     "data": null
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": "Error during measurement unit search"
 *     },
 *     "data": null
 */
router.get('/get/:id', async (req, res) => {
    const data = await dbMeasurementUnit.getUnitById(req.params.id);
    return res.status(data['meta'].code).send(data);
});

/**
 * @api {get} /api/measurementunits/get Get all Measurement units
 * @apiName Get Measurement units
 * @apiGroup Measurement units
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "code": 200,
 *      "success": true,
 *      "message": "Successfully get measurement units"
 *     },
 *     "data": {
 *      "units": [
 *       {
 *        "_id": "5b7e475232123500b5c34afe",
 *        "name": "л",
 *        "user": "5b7e467d32123500b5c34afd"
 *       },
 *       {
 *        "_id": "5b8d1c67ac0a4d00b5e0d9d6",
 *        "name": "кг",
 *        "user": "5b7e467d32123500b5c34afd"
 *       }
 *      ]
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": "Error during measurement unit fetching"
 *     },
 *     "data": null
 */
router.get('/get', async (req, res) => {
    const data = await dbMeasurementUnit.getAllUnits();
    return res.status(data['meta'].code).send(data);
});

module.exports = router;
