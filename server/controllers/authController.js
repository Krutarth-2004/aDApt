const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// ✅ Send token in HTTP-only cookie
const sendToken = (res, user, statusCode = 200) => {
  const token = generateToken(user);

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

// ✅ Check Auth
exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ User Signup (Non-admin only)
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });

    await user.save();
    sendToken(res, user, 201);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ User Login (blocks admin login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.role === "admin")
      return res.status(400).json({ message: "Invalid user credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid user credentials" });

    sendToken(res, user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin Signup (requires secret)
exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, admincode } = req.body;
    if (admincode !== process.env.ADMIN_SECRET)
      return res.status(403).json({ message: "Invalid admin key" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, password: hashed, role: "admin" });

    await admin.save();
    sendToken(res, admin, 201);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin Login (requires secret)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password, admincode } = req.body;
    if (admincode !== process.env.ADMIN_SECRET)
      return res.status(403).json({ message: "Invalid admin key" });

    const admin = await User.findOne({ email });
    if (!admin || admin.role !== "admin")
      return res.status(400).json({ message: "Invalid admin credentials" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid admin credentials" });

    sendToken(res, admin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout (clear cookie)
exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

// ✅ Profile Update
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
