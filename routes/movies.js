const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../utils/validators');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const validationConfig = {
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
};

const movies = express.Router();

movies.get('/', getMovies);

movies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailerLink: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movies.delete('/:_id', celebrate(validationConfig), deleteMovie);

module.exports = { movies };
