require('dotenv').config();

const {
  PORT = 4000,
  JWT_SECRET_DEV = 'secretkey',
  DATABASE_URL = 'mongodb://127.0.0.1:27017/moviesdb',
} = process.env;

const JWT_STORAGE_TIME = '7d';
const SALT_LENGTH = 10;

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const ALLOWED_CORS_URL = [
  'localhost:3000',
  'http://localhost:3000',
  'http://localhost:4000',
  'moviespavm9.nomoredomains.club',
  'http://moviespavm9.nomoredomains.club',
  'https://moviespavm9.nomoredomains.club',
];

module.exports = {
  PORT,
  JWT_SECRET_DEV,
  DATABASE_URL,
  SALT_LENGTH,
  JWT_STORAGE_TIME,
  DEFAULT_ALLOWED_METHODS,
  ALLOWED_CORS_URL,
};
