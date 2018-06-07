const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Store = require('../models/store');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt.js');

router.get('/list/:pageNumber/:pageSize', (req, res, next) => {
    var pageNumber = parseInt(req.params.pageNumber);
    var pageSize = parseInt(req.params.pageSize);

    Store.find({}).skip(pageNumber > 0 ? ((pageNumber - 1) * pageSize) : 0).limit(
        pageSize).exec((err, stores) => {
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully get stores"
            },
            data: {
                stores: stores
            }
        });
    });
});

router.get('/:link', (req, res, next) => {
    Store.findOne({
        link: req.params.link
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
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get store"
                },
                data: {
                    store: store
                }
            });
        }
    });
});


router.route('/add').post(checkJWT, (req, res, next) => {
     User.findOne({
        _id: req.decoded.user._id
    }, (err, user) => {
        if (user.isSeller) {
            let id = req.decoded.user._id;
            let store = new Store();

            store.creator_id = req.decoded.user._id;
            store.contact_faces = [req.decoded.user._id];
            if (req.body.name) store.name = req.body.name;
            if (req.body.short_description) store.short_description = req.body.short_description;
            if (req.body.description) store.description = req.body.description;
            if (req.body.link) store.link = req.body.link;

            console.log(store);
            store.save();
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Store successfully added"
                },
                data: {
                    store: store
                }
            });
        } else {
            res.json({
                meta: {
                    code: 403,
                    success: false,
                    message: "User isn't seller"
                },
                data: null
            });
        }
    });
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