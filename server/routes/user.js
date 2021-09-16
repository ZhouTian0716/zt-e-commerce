const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck } = require("../middlewares/auth.js");

// import from controllers
const {
  list,
  getUserCart,
  createUserCart,
  clearUserCart,
  saveAddress,
  recieveCoupon,
  createOrder,
} = require("../controllers/user.js");

// routes
router.get("/user", list);
router.get("/user/cart", authCheck, getUserCart);
router.post("/user/cart", authCheck, createUserCart);
router.delete("/user/cart", authCheck, clearUserCart);
router.post("/user/address", authCheck, saveAddress);

// Purchase Orders
router.post("/user/order", authCheck, createOrder);

// coupon
router.post("/user/cart/coupon", authCheck, recieveCoupon);

module.exports = router;
