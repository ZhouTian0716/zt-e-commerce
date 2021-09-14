const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js");

// import from controllers
const { create, remove, list } = require("../controllers/coupon.js");

// routes
router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupon", list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;
