const express = require("express");
const router = express.Router();

// import from middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js");

// import from controllers
const { upload, remove } = require("../controllers/cloudinary.js");

// routes
router.post("/upload/images", authCheck, adminCheck, upload);
router.post("/remove/image", authCheck, adminCheck, remove);

module.exports = router;
