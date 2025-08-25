require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const app = express();

app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const moveRoutes = require("./routes/moveRoutes");
const playGameRoutes = require("./routes/playGameRoutes");




app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/moves", moveRoutes);
app.use("/api/playGame", playGameRoutes);

sequelize.sync({ force: false }).then(() => {
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
});
