const { User } = require('../model/user');
const { Op } = require('sequelize');
const userRepository = require('../repository/userRepository');
const bcrypt = require('bcryptjs');
const { verifyToken, generateToken } = require('./authService');
const {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} = require('../utils/errors');

const SALT_ROUNDS = 12;

const register = async ({ username, email, password }) => {
  const existingUserByEmail = await userRepository.findUserByEmail(email);
  if (existingUserByEmail) {
    throw new ValidationError('User already exists with this email');
  }

  const existingUserName = await userRepository.findUserByUserName(username);
  if (existingUserName) {
    throw new AuthenticationError('User already exists with this username');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await userRepository.createUser({
    username: username,
    email: email,
    password: hashedPassword,
  });

  delete user.password;

  return user;
};

const login = async (credentials) => {
  const { username, password } = credentials;

  if (!username || !password) {
    throw new ValidationError('Username and password are required');
  }

  const user = await userRepository.findUserByUserName(credentials.username);
  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid credentials');
  }

  delete user.password;

  const token = generateToken(user);

  return { user, token };
}


const getUserById = async (id) => {
  const user = await userRepository.findUserById(id, {});

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

const findUserByUserName = async (username) => {

  const user = await userRepository.findUserByUserName(username);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

module.exports = {
  register,
  login,
  getUserById,
  findUserByUserName,
  verifyToken,
};
