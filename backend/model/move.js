const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Move = sequelize.define("Move", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    whoPlayed: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    boardIndex: {
        type: DataTypes.INTEGER,  
        allowNull: false,
    },
    sign: {
        type: DataTypes.STRING,
        allowNull: true,   
    },
    dateTime: {
        type: DataTypes.DATE,  
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'moves', 
    timestamps: true,   
});

module.exports = Move;
