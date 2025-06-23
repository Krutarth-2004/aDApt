const express = require("express");
const http = require("http"); // for socket server
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Route imports
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
const sharedlibRoutes = require("./routes/sharedlib");
const lnfRoutes = require("./routes/lnf");
const qnaRoutes = require("./routes/qna");

const app = express();
const server = http.createServer(app); // use this for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Store io for use in controllers
app.set("io", io);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://adapt-taupe.vercel.app",
    credentials: true,
  })
);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Socket.IO Connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("🟢 New WebSocket connection: ", userId);

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected: ", userId);
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mail/categories", emailRoutes);
app.use("/api/sharedlib/course_codes", sharedlibRoutes);
app.use("/api/lnf/places", lnfRoutes);
app.use("/api/qna/categories", qnaRoutes);

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
