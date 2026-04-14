/**
 * @file Configuration information for Passport.js Authentication
 * @author Evan Jelle
 */

// Import libraries
import passport from "passport";
import { UniqueTokenStrategy } from "passport-unique-token";

// Import models
import { User, Role } from "../models/models.js";

// Import logger
import logger from "./logger.js";

/**
 * Authenticate a user
 *
 * @param {string} username the username to authenticate
 * @param {function} next the next middleware function
 */
const authenticateUser = function (username, next) {
  // Find user with the username
  User.findOne({
    attributes: ["id", "username"],
    include: {
      model: Role,
      as: "roles",
      attributes: ["id", "role"],
      through: {
        attributes: [],
      },
    },
    where: { username: username },
  }).then((user) => {
    // User not found
    if (user === null) {
      logger.debug("Login failed for user: " + username);
      return next(null, false);
    }
    // User authenticated
    logger.debug("Login succeeded for user: " + user.username);
    // Convert Sequelize object to plain JavaScript object
    user = JSON.parse(JSON.stringify(user));
    return next(null, user);
  });
};

// Bypass Authentication via Token
passport.use(
  new UniqueTokenStrategy((token, next) => {
    // Only allow token authentication when enabled
    if (process.env.BYPASS_AUTH === "true") {
      return authenticateUser(token, next);
    } else {
      return next(null, false);
    }
  }),
);

// Default functions to serialize and deserialize a session
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});