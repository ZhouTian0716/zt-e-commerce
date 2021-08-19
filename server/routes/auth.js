const express = require('express');
const router = express.Router();

// import from controllers
const { createOrUpdateUser } = require('../controllers/auth.js')

// import from middlewares
const { authCheck } = require('../middlewares/auth.js')


router.post('/create-or-update-user', authCheck, createOrUpdateUser);



module.exports = router;