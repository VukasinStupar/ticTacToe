const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

async function findUserById(id) {
  const query = `SELECT * FROM "user" WHERE id = :id`;
  const [user] = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.SELECT,
  });
  return user;
}

async function findUserByEmail(email) {
  const query = `SELECT * FROM "user" WHERE email = :email`;
  const [user] = await sequelize.query(query, {
    replacements: { email },
    type: QueryTypes.SELECT,
  });
  return user;
}

const findUserByUserName = async (username) => {
  const query = `SELECT * FROM "user" WHERE username = :username`;
  const [user] = await sequelize.query(query, {
    replacements: { username },
    type: QueryTypes.SELECT,
  });
  return user;
};

async function createUser({ username, email, password }) {
  const query = `
  INSERT INTO "user" (username, email, password, "createdAt", "updatedAt")
  VALUES (:username, :email, :password, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  RETURNING id, username, email
`;
  const [result] = await sequelize.query(query, {
    replacements: { username, email, password },
    type: QueryTypes.SELECT,
  });
  return result;
}

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  findUserByUserName,
};