const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck } = require("../middlewares/auth.js");

// import from controllers
const { createPaymentIntent } = require("../controllers/stripe");

// routes
router.post("/create-payment-intent", authCheck, createPaymentIntent);


module.exports = router;
