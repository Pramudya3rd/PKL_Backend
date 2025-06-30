const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Semua field wajib diisi (Nama, Email, Password, Role).",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }

    const user = await User.create({ name, email, phone, password, role });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: "Pendaftaran berhasil!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error saat pendaftaran:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error saat login:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
