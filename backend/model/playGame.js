const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PlayGame = sequelize.define(
  'PlayGame',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    who_played: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    board_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 8,
      },
    },
    sign: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    currentTurn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
  
);

module.exports = PlayGame;
