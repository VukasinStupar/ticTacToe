require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const sequelize = require("./config/db");
const { initSocket } = require('./socket');



const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const now = Date.now();
  const windowStart = now - 60000;
  next();
});

const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const playGameRoutes = require("./routes/playGameRoutes");
const playGameMultiplayerRoutes = require("./routes/playGameMultiplayerRoutes");

app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/playGame", playGameRoutes);
app.use("/api/playGame-mp", playGameMultiplayerRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

sequelize.sync({ force: false })
  .then(() => console.log("Database synced successfully."))
  .catch(err => console.error("DB sync error:", err));

const server = createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = { app, server };