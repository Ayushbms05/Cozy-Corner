const User = require("../models/User");
const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");

const Booking = require("../models/Booking");
const Property = require("../models/Property");
const authMiddleware = require("../middleware/authMiddleware");



//  Student creates booking request
router.post("/", protect, async (req, res) => {
  try {
    const { propertyId, moveInDate, durationMonths } = req.body;

    console.log("REQ.USER =", req.user); // debug

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const booking = await Booking.create({
      property: property._id,
      student: req.user.id, // ✅ NOW EXISTS
      host: property.owner, // ✅ correct field
      moveInDate,
      durationMonths,
      amount: property.rent,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// Host fetches detailed booking requests (FOR BOOKING REQUEST PAGE ONLY)
router.get(
  "/host/requests",
  protect,
  restrictTo("host"),
  async (req, res) => {
    try {
      const bookings = await Booking.find({ host: req.user.id })
        .populate("student", "name college year avatar phone")
        .populate(
          "property",
          "title address city occupancyType images rent"
        )
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to fetch detailed booking requests",
      });
    }
  }
);

// Host fetches booking requests
router.get("/host", protect, restrictTo("host"), async (req, res) => {
  const bookings = await Booking.find({ host: req.user.id })
    .populate("student", "name")
    .populate("property", "title");

  res.json(bookings);
});




// Host approves / rejects
router.patch("/:id/status", protect, restrictTo("host"), async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.host.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

//  Student pays for an approved booking
router.post("/pay", protect, async (req, res) => {
  try {
    const { bookingId } = req.body;

    //  Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    //  Ensure student owns this booking
    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized payment attempt" });
    }

    // Booking must be approved
    if (booking.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Booking not approved yet" });
    }

    //  Prevent double payment
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    //  Mark booking as paid
    booking.paymentStatus = "paid";
    await booking.save();

    //  Credit host wallet
    const host = await User.findById(booking.host);
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    //  Amount logic (for now)
    const amount = booking.amount || 0; // or calculate later

    host.walletBalance = (host.walletBalance || 0) + amount;
    await host.save();

    res.json({
      success: true,
      message: "Payment successful, host wallet updated",
      walletBalance: host.walletBalance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
});


//  Student checks booking status for a property
router.get("/my/:propertyId", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      property: req.params.propertyId,
      student: req.user.id,
    });

    res.json(booking); // can be null
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});

// 📘 Student – get all my bookings
router.get("/student", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user.id })
      .populate("property", "title address city images")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Get single booking by ID (for payment page)
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("property", "title address city rent deposit images")
      .populate("student", "name");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security: only student or host can view
    if (
      booking.student._id.toString() !== req.user.id &&
      booking.host.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});



module.exports = router;
