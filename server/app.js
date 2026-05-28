import "@dotenvx/dotenvx/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import database from "./configs/database.js";
import requestLogger from "./middlewares/request-logger.js";
import indexRouter from "./routes/index.js";
import compression from "compression";
import helmet from "helmet";
import swaggerUI from "swagger-ui-express";
import openapi from "./configs/openapi.js";
import logger from "./configs/logger.js";
import apiRouter from "./routes/api.js";
import authRouter from "./routes/auth.js";
import passport from "passport";
import history from 'connect-history-api-fallback'
import tokenMiddleware from "./middlewares/token.js";

var app = express();

const forceHttps = process.env.FORCE_HTTPS === "true";

app.use(helmet({
  hsts: forceHttps,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https:"],
      "connect-src": ["'self'", "blob:"],
      "upgrade-insecure-requests": forceHttps ? [] : null,
    }
  }
}))
app.use(compression());

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: database,
});
sessionStore.sync();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: process.env.SESSION_NAME || "connect.sid",
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(tokenMiddleware);
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use(history())
app.use(express.static(path.join(import.meta.dirname, "public")));

if (process.env.OPENAPI_VISIBLE === "true") {
  logger.warn("OpenAPI documentation visible!");
  app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(openapi, { explorer: true }),
  );
}

export default app;
