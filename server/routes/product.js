const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js");

// import from controllers
const {
  create,
  readAll,
} = require("../controllers/product.js");

// routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products", readAll);

module.exports = router;
