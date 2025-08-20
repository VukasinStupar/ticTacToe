
const {User} = require('../model/user');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const userRepository = require('../repository/userRepository');
const bcrypt = require('bcryptjs');

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username 
    },
    JWT_CONFIG.secret,
    { expiresIn: JWT_CONFIG.expiresIn }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

const register = async (userData) => {
  try {
    const existingUser = await userRepository.findUserByEmail(userData.email);

    if (existingUser) {
      throw new ValidationError('User already exists with this email');
    }
    

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await userRepository.createUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword, 
    });

    const userResponse = { ...user };
    delete userResponse.password;

    

    return { user: userResponse, token };
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw error;
    }
    throw new Error(`Registration failed: ${error.message}`);
  }
};

const login = async (credentials) => {
  try {
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

    const userResponse = user;
    delete userResponse.password;

    const token = generateToken(user);
    

    return { user: userResponse, token };
  } catch (error) {
    if (error.name === 'AuthenticationError' || error.name === 'ValidationError') {
      throw error;
    }
    throw new Error(`Login failed: ${error.message}`);
  }
};

const getUserById = async (id) => {
  try {
    const user = await userRepository.findUserById(id, {
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error) {
    if (error.name === 'NotFoundError') {
      throw error;
    }
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

const findUserByUserName = async (username) => {
    try {
        const user = await userRepository.findUserByUserName(username);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    } catch (error) {
        if (error.name === "NotFoundError") throw error;
        throw new Error(`Failed to get user: ${error.message}`);
    }
};



module.exports = {
  register,
  login,
  getUserById,
  generateToken,
  verifyToken,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  findUserByUserName,
};

console.log('service')