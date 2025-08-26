const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../model/user"); 

const Game = sequelize.define("Game", {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }    
    },
    datetime: { 
        type: DataTypes.DATE,
        allowNull: false,
    },
    typeOfPlay: {
        type: DataTypes.ENUM("SINGLE_PLAYER", "MULTI_PLAYER"), 
        allowNull: false,
        defaultValue: "SINGLE_PLAYER"
    },


 freezeTableName: true,

});


module.exports = Game;