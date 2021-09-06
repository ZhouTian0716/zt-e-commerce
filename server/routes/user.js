const express = require('express');
const router = express.Router();

// import from controllers
const { list } = require('../controllers/user.js')



// routes
router.get('/user', list);


module.exports = router;