const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 ROLE-BASED RESPONSE
    if (user.role === "student") {
      return res.json({
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
      });
    }

    if (user.role === "host") {
      return res.json({
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance || 0,
      });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.put("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, phone, college } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone, college },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = router;
