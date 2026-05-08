/**
 * @file Roles API router
 * @author Evan Jelle
 * @exports
 *
 * @swagger
 * tags:
 *   name: roles
 *   description: Roles endpoints
 */

// Import libraries
import express from "express";

// Import models
import { Role } from "../../../models/models.js";

// Import logger
import logger from "../../../configs/logger.js";
import roleBasedAuth from "../../../middlewares/authorized-roles.js";

// Create Express Router
const router = express.Router();

/**
 * Gets the list of roles
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
* @swagger
 * /api/v1/roles:
 *   get:
 *     summary: roles list page
 *     description: Gets the list of all roles in the application
 *     tags: [roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get("/", roleBasedAuth("manage_users"), async function (req, res, next) {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
