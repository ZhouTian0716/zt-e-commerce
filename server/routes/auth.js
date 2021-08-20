const express = require('express');
const router = express.Router();

// import from controllers
const { createOrUpdateUser, currentUser } = require('../controllers/auth.js')

// import from middlewares
const { authCheck } = require('../middlewares/auth.js')

// routes
router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);


module.exports = router;