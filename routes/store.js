const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Store = require('../models/store');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt.js');
const dbStores = require('../utils/db/db.stores');
const mongoose = require('mongoose');

router.get('/list/:pageNumber/:pageSize', async (req, res) => {
    let data = await dbStores.listStoresByPages(req.params.pageNumber, req.params.pageSize);
    return res.status(data['meta'].code).send(data);
});

router.get('/:link', async (req, res) => {
    let data = await dbStores.findStoreByName(req.params.link);
    return res.status(data['meta'].code).send(data);
});

router.get('/id/:id', async (req, res) => {
    let data = await dbStores.findStoreById(req.params.id);
    return res.status(data['meta'].code).send(data);
});

router.get('/category/:id', async (req, res) => {
    let data = await dbStores.findStoresByCategoryId(req.params.id);
    return res.status(data['meta'].code).send(data);
});

router.get('/get/all', async (req, res) => {
    let data = await dbStores.findAllStores();
    return res.status(data['meta'].code).send(data);
});

router.get('/goods/:id', async (req, res) => {
    let data = await dbStores.findGoodsByStoreId(req.params.id);
    return res.status(data['meta'].code).send(data);
});

router.route('/add').post(checkJWT, async (req, res) => {
    let data = await dbStores.addStore(req.body, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});


router.route('/update').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            name: req.body.name,
            short_description: req.body.short_description,
            description: req.body.description,
            tags: req.body.tags
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Store successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});


router.route('/update/name').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            name: req.body.name
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Name successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});


router.route('/update/category').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            category: req.body.category_id
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Category successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});

router.route('/update/contacts').put(checkJWT, (req, res, next) => {
    Store.findOne({
        link: req.body.link
    }, (err, store) => {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        }

        if (req.body.email) store.contacts.email = req.body.email;
        if (req.body.phone) store.contacts.phone = req.body.phone;
        if (req.body.address) store.contacts.address = req.body.address;
        if (req.body.city) store.city = mongoose.Types.ObjectId(req.body.city);

        store.save();
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully updated contacts"
            },
            data: null
        });
    });
});

router.route('/update/resident').put(checkJWT, (req, res, next) => {
    Store.findOne({
        link: req.body.link
    }, (err, store) => {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        }


        if (req.body.resident_type) store.resident_type = req.body.resident_type;
        if (req.body.tax_num) store.tax_num = req.body.tax_num;
        if (req.body.state_num) store.state_num = req.body.state_num;
        if (req.body.bank_type) store.bank_type = req.body.bank_type;
        if (req.body.bank_num) store.bank_num = req.body.bank_num;
        if (req.body.goods_type) store.goods_type = req.body.goods_type;

        store.save();
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully updated resident info"
            },
            data: null
        });
    });
});

router.route('/update/tags').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            tags: req.body.tags
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Tags successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});

router.route('/update/logo').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            logo: req.body.logo
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Tags successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});

router.route('/update/background').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            background: req.body.background
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Background successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});


router.route('/update/description').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            description: req.body.description
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Description successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});


router.route('/update/short_description').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            short_description: req.body.short_description
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Short description successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});

router.route('/update/contact_faces').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            contact_faces: req.body.contact_faces
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Contact successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});

router.route('/update/location').put(checkJWT, (req, res, next) => {
    Store.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, {
        $set: {
            location: req.body.location
        }
    }, {new: true}, function (err, store) {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Location successfully updated"
                },
                data: {
                    store: store
                }
            });
        }
    });
});

router.route('/delete').delete(checkJWT, (req, res, next) => {
    Store.deleteOne({
        creator_id: req.decoded.user._id,
        link: req.body.link
    }, (err) => {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Store successfully deleted"
                },
                data: null
            });
        }

    });
});


module.exports = router;