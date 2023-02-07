const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { getCurrentUser, updateUser } = require('../controllers/users');

const users = express.Router();

users.get('/me', getCurrentUser);

users.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser,
);

module.exports = { users };
