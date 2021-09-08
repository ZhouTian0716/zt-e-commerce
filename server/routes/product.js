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
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} = require("../controllers/product.js");

// routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productsCount);
router.get("/products/:count", listAll);
router.get("/product/:slug", read);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.put("/product/:slug", authCheck, adminCheck, update);


router.post("/products", list);
// rating relevant
router.put('/product/star/:productId', authCheck, productStar);
// related product
router.get("/product/related/:productId", listRelated);

// Searching 
// Using post to pass multipule searching options
router.post("/search/filters", searchFilters);


module.exports = router;
