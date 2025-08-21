require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db"); 

const app = express();

app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes"); 

app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

sequelize.sync({ force: false }).then(() => { 
    console.log("Database synced");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));