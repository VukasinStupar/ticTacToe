require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME || 'ticTacToe',     
    process.env.DB_USER || 'postgres',      
    process.env.DB_PASSWORD || '123',       
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: "postgres",
        logging: false
    }
);

sequelize.authenticate()
    .then(() => console.log("✅ Connected to PostgreSQL (ticTacToe)"))
    .catch(err => console.error("❌ Unable to connect:", err));

// module.exports = { sequelize };
module.exports = sequelize;