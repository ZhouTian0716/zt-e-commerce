const express = require('express');
const router = express.Router();

// import from controllers
const { createOrUpdateUser, currentUser } = require('../controllers/auth.js')

// import from middlewares
const { authCheck, adminCheck } = require('../middlewares/auth.js')

// routes
router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);
router.post('/current-admin', authCheck, adminCheck, currentUser);


module.exports = router;