const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { users } = require('./users');
const { movies } = require('./movies');
const { login, logout, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { NotFoundError } = require('../errors');

const routes = express.Router();

routes.all('*', express.json());

routes.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

routes.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

routes.post('/signout', auth, logout);

routes.use('/users', auth, users);
routes.use('/movies', auth, movies);

routes.all('*', auth, (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = { routes };
