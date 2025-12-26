const express = require("express");
const Property = require("../models/Property");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ADD PROPERTY (HOST ONLY)

router.post(
  "/",
  protect,
  restrictTo("host"),
  upload.array("images", 5),
  async (req, res) => {
    try {
      const imageUrls = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path);
          imageUrls.push(result.secure_url);
        }
      }

      const property = await Property.create({
        ...req.body,
        images: imageUrls,
        owner: req.user.id, // 🔥 FIX
      });

      res.status(201).json(property);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add property" });
    }
  }
);

// GET ALL PROPERTIES (STUDENTS)

router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

//   GET MY PROPERTIES (HOST)

// GET my properties (host only)
router.get("/my", protect, restrictTo("host"), async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});



// DELETE property (host only)
router.delete(
  "/:id",
  protect,
  restrictTo("host"),
  async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);

      if (!property || property.owner.toString() !== req.user.id) {
        return res.status(404).json({ message: "Property not found" });
      }

      await property.deleteOne();
      res.json({ message: "Property deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Delete failed" });
    }
  }
);

// UPDATE PROPERTY (HOST ONLY)
router.put(
  "/:id",
  protect,
  restrictTo("host"),
  upload.array("images", 5),
  async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);

      if (!property || property.owner.toString() !== req.user.id) {
        return res.status(404).json({ message: "Property not found" });
      }

      // upload new images if provided
      let imageUrls = property.images;

      if (req.files && req.files.length > 0) {
        imageUrls = [];
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path);
          imageUrls.push(result.secure_url);
        }
      }

      // update fields
      property.title = req.body.title;
      property.propertyType = req.body.propertyType;
      property.occupancyType = req.body.occupancyType;
      property.description = req.body.description;
      property.address = req.body.address;
      property.city = req.body.city;
      property.nearestCollege = req.body.nearestCollege;
      property.rent = req.body.rent;
      property.deposit = req.body.deposit;
      property.rules = req.body.rules;
      property.amenities = req.body.amenities;
      property.images = imageUrls;

      await property.save();

      res.json({ message: "Property updated successfully", property });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);


 // PROPERTY DETAILS

router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.json(property);
  } catch {
    res.status(404).json({ message: "Property not found" });
  }
});

module.exports = router;
