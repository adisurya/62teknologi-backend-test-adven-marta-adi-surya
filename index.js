require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const logger = require('./src/utils/logger');
const setRequestID = require('./src/middlewares/set-request-id');

process.on('uncaughtException', (e) => {
  logger.error('MAIN 57896BAD: UncaughtException', {
    eCode: e.code,
    eMessage: e.message,
  });
});

/**
 * convert bigint to string
 */
// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

app.use(setRequestID);

morgan.token('request-id', (req, res) => res.locals.rid);

app.use(morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms :request-id', {
  stream: {
    write: (message) => logger.http(message),
  },
}));

app.listen(process.env.PORT, () => {
  logger.verbose(`Application listening on post ${process.env.PORT}`);
});
