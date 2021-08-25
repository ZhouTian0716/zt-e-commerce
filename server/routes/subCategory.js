const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js");

// import from controllers
const {
  create,
  read,
  update,
  remove,
  list,
} = require("../controllers/subCategory.js");

// routes
router.post("/sub-category", authCheck, adminCheck, create);
router.get("/sub-categories", list);
router.get("/sub-category/:slug", read);
router.put("/sub-category/:slug", authCheck, adminCheck, update);
router.delete("/sub-category/:slug", authCheck, adminCheck, remove);

module.exports = router;