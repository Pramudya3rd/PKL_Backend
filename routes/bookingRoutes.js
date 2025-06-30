const express = require("express");
const bookingController = require("../controllers/bookingController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

module.exports = (upload) => {
  const router = express.Router();

  router.post(
    "/",
    authenticateToken,
    authorizeRoles("user"),
    bookingController.createBooking
  );

  router.put(
    "/:id/status",
    authenticateToken,
    authorizeRoles("user", "owner", "admin"),
    upload.single("paymentProof"),
    bookingController.updateBookingStatus
  );

  router.get(
    "/",
    authenticateToken,
    authorizeRoles("user", "owner", "admin"),
    bookingController.getAllBookings
  );

  router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("user", "owner", "admin"),
    bookingController.getBookingById
  );

  return router;
};
