const User = require("../models/User");

// ADD / REMOVE wishlist (toggle)
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propertyId = req.params.propertyId;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.indexOf(propertyId);

    if (index > -1) {
      user.wishlist.splice(index, 1); // remove
    } else {
      user.wishlist.push(propertyId); // add
    }

    await user.save();

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Wishlist update failed" });
  }
};

// GET my wishlist
exports.getMyWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};
