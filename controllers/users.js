const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_DEV, JWT_STORAGE_TIME, SALT_LENGTH } = require('../utils/config');
const { User } = require('../models/user');
const {
  ConflictError,
  NotFoundError,
  BadRequestError,
} = require('../errors');

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: JWT_STORAGE_TIME },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ jwt: token });
    })
    .catch(next);
}

function logout(req, res) {
  res.clearCookie('jwt').send({ message: 'Вы вышли из профиля' });
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  const {
    email, name, password,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, SALT_LENGTH);
    const user = await User.create({
      email, name, password: hashPassword,
    });
    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким логином уже существует'));
    }
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
    }
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.user._id;
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с данным _id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Неверный формат данных в запросе'));
    }
    if (err.code === 11000) {
      next(new ConflictError('Email принадлежит другому пользователю'));
    }
    next(err);
  }
}

module.exports = {
  login, logout, getCurrentUser, createUser, updateUser,
};
