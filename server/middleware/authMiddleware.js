const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Verifies JWT from HTTP-only cookie
exports.verifyToken = (req, res, next) => {
  console.log("💡 Cookies:", req.cookies); // <--- Add this
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    console.log("✅ Decoded user:", decoded); // <--- Add this too
    next();
  });
};

// ✅ Ensures user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin privilege required" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error during admin check" });
  }
};
