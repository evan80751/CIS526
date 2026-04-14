/**
 * @file Auth router
 * @author Evan Jelle
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: auth
 *   description: Authentication Routes
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     AuthToken:
 *       description: authentication success
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: a JWT for the user
 *                 example:
 *                   token: abcdefg12345
 */

// Import libraries
import express from "express";
import passport from "passport";

// Import configurations
import "../configs/auth.js";

// Create Express router
const router = express.Router();

/**
 * Authentication Response Handler
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authSuccess = function (req, res, next) {
  res.json(req.user);
};

/**
 * Bypass authentication for testing
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /auth/bypass:
 *   get:
 *     summary: bypass authentication for testing
 *     description: Bypasses CAS authentication for testing purposes
 *     tags: [auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: username
 *     responses:
 *       200:
 *         description: success
 */
router.get("/bypass", passport.authenticate("token", { session: false }), authSuccess);

/**
 * CAS Authentication
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /auth/cas:
 *   get:
 *     summary: CAS authentication
 *     description: CAS authentication for deployment
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: success
 */
router.get("/cas", passport.authenticate("cas", { session: true }), authSuccess);

/**
 * Request JWT based on previous authentication
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /auth/token:
 *   get:
 *     summary: request JWT
 *     description: request JWT based on previous authentication
 *     tags: [auth]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AuthToken'
 */
router.get("/token", function (req, res, next) {});

export default router;