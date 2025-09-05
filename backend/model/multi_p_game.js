const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MultiPGame = sequelize.define(
  'multiplayergame',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user2_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    winner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {},
  
);

module.exports = MultiPGame;
