require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const db = require("./models");
const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const villaRoutes = require("./routes/villaRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");

const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/contact", contactRoutes);

const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/payment-proofs/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix =
      Date.now() + "-payment-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const paymentFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Hanya file gambar yang diizinkan untuk bukti pembayaran!"),
      false
    );
  }
};

const uploadPayment = multer({
  storage: paymentStorage,
  fileFilter: paymentFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const villaImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/villa-images/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix =
      Date.now() + "-villa-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const villaImageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan untuk villa!"), false);
  }
};

const uploadVillaImages = multer({
  storage: villaImageStorage,
  fileFilter: villaImageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.get("/", (req, res) => {
  res.send("API Villa Booking Berjalan!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/villas", villaRoutes(uploadVillaImages));
app.use("/api/bookings", bookingRoutes(uploadPayment));

app.use(errorHandler);

db.sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
      console.log("Database terhubung dan disinkronkan!");
    });
  })
  .catch((err) => {
    console.error("Gagal terhubung atau sinkronisasi database:", err);
  });
