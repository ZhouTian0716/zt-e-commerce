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
} = require("../controllers/user.js");

// routes
router.get("/user", list);
router.get("/user/cart", authCheck, getUserCart);
router.post("/user/cart", authCheck, createUserCart);
router.delete("/user/cart", authCheck, clearUserCart);

module.exports = router;
