const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { PORT, DATABASE_URL } = require('./utils/config');
const { limiter } = require('./utils/limiter');
const cors = require('./middlewares/cors');
const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cookieParser());

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`Подключено к базе данных по адресу ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.log('Ошибка подключения к базе данных');
    console.error(err);
  });

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Приложение запущено в порте ${PORT}`);
});
