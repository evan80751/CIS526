/**
 * @file Middleware for reading JWTs from the Bearer header and storing them in the request
 * @author Evan Jelle
 */

// Import libraries
import jsonwebtoken from "jsonwebtoken";

// Import logger
import logger from "../configs/logger.js";

/**
 * MIddleware to read a JWT from the Authorization header
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const tokenMiddleware = function (req, res, next) {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
            const user = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
            req.user = user;
            logger.debug("JWT authenticated user: " + user.username);
        } catch (err) {
            logger.debug("JWT verification failed: " + err.message);
        }
    }
    next();
};

export default tokenMiddleware;