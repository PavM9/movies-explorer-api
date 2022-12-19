const { Movie } = require('../models/movie');
const {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} = require('../errors');

async function getMovies(req, res, next) {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (err) {
    next(err);
  }
}

async function createMovie(req, res, next) {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      nameRU,
      nameEN,
      trailerLink,
      thumbnail,
      movieId,
    } = req.body;
    const ownerId = req.user._id;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      nameRU,
      nameEN,
      trailerLink,
      thumbnail,
      movieId,
      owner: ownerId,
    });
    res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
      return;
    }
    next(err);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const { _id } = req.params;
    const movie = await Movie.findById(_id).populate('owner');

    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    }
    const ownerId = movie.owner.id;
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new ForbiddenError('Невозможно удалить чужой фильм');
    }
    await movie.remove();
    res.send({ message: 'Вы удалили фильм из избранного' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMovies, createMovie, deleteMovie,
};
