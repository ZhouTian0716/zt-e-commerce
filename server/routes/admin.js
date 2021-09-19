const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js");

// import from controllers
const { findAllOrders, orderStatus } = require("../controllers/admin.js");

// routes
router.get("/admin/orders", authCheck, adminCheck, findAllOrders);
router.put("/admin/order-status", authCheck, adminCheck, orderStatus);

module.exports = router;
