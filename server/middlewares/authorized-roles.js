/**
 * @file Middleware for checking user roles
 * @author Evan Jelle
 */

// Import logger
import logger from "../configs/logger.js";
/**
 * Generates a middleware function that checks if the user has the required role
 * 
 * @param {string} role - the role to check for
 * @returns {Function} - an Express middleware function
 */
const roleBasedAuth = function (role) {
    const roleAuthMiddleware = function (req, res, next) {
        logger.debug("Route requires roles: " + role);
        if (req.user) {
            const roles = req.user.roles.map((r) => r.role);
            logger.debug("User " + req.user.username + " has roles: " + roles.join(","))
            const allowed = Array.isArray(role) ? role: [role];
            if (allowed.some((r) => roles.includes(r))) {
                logger.debug("Role match!");
                return next();
            }
        }
        res.status(403).end();
    };
    return roleAuthMiddleware;
};

export default roleBasedAuth;