const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js");

// import from controllers
const {
  create,
} = require("../controllers/product.js");

// routes
router.post("/product", authCheck, adminCheck, create);


module.exports = router;
