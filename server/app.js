import '@dotenvx/dotenvx/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import requestLogger from './middlewares/request-logger.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import compression from 'compression';
import helmet from 'helmet';

var app = express();

app.use(helmet());
app.use(compression());

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use('/'  , indexRouter);
app.use('/users', usersRouter);

export default app;
