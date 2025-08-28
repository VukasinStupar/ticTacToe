const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Game = sequelize.define("Game", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    opponentId: { 
        type: DataTypes.INTEGER,
        allowNull: true
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    typeOfPlay: {
        type: DataTypes.STRING,
        allowNull: false
    },
    whoWin: { 
        type: DataTypes.ENUM("X", "O", "draw"),
        allowNull: true
    },
    currentTurn: { 
        type: DataTypes.INTEGER, 
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Game;
