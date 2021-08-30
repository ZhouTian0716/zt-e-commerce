const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js");

// import from controllers
const {
  create,
  listAll,
  remove,
  read,
} = require("../controllers/product.js");

// routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);
router.get("/product/:slug", read);
router.delete("/product/:slug", authCheck, adminCheck, remove);



module.exports = router;
