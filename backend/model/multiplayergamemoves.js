const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MultiplayerGameMoves = sequelize.define(
  'multiplayergamemoves',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_multi_p_game: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sign: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    who_played: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {},
);

module.exports = MultiplayerGameMoves;
