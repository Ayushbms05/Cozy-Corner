const express = require("express");
const {
  toggleWishlist,
  getMyWishlist,
} = require("../controllers/wishlistController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// student only
router.post("/:propertyId", protect, restrictTo("student"), toggleWishlist);
router.get("/", protect, restrictTo("student"), getMyWishlist);

module.exports = router;
