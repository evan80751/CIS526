/**
 * @file Configuration information for Sequelize database ORM
 * @author Evan Jelle
 * @exports sequelize a Sequelize instance
 */
// Import libraries
import Sequelize from "sequelize";
// Import logger configuration
import logger from "./logger.js";

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT || "sqlite",
  storage: process.env.DATABASE_FILE || ":memory:",
  host: process.env.DATABASE_HOST || "lostcommunities_db",
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || "lostcommunities",
  password: process.env.DATABASE_PASSWORD || "lostcommunities",
  database: process.env.DATABASE_NAME || "lostcommunities",
  logging: logger.sql.bind(logger),
});

export default sequelize;
