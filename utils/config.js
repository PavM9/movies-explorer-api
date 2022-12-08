require('dotenv').config();

const {
  PORT = 3000,
  JWT_SECRET_DEV = 'secretkey',
  DATABASE_URL = 'mongodb://127.0.0.1:27017/moviesdb',
} = process.env;

const JWT_STORAGE_TIME = '7d';
const SALT_LENGTH = 10;

module.exports = {
  PORT,
  JWT_SECRET_DEV,
  DATABASE_URL,
  SALT_LENGTH,
  JWT_STORAGE_TIME,
};
