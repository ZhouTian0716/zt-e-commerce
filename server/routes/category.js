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
  getSubs,
} = require("../controllers/category.js");

// routes
// router.post("/category", create);
router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.get("/category/sub-categories/:_id", getSubs);

module.exports = router;
