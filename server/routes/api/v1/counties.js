/**
 * @file Counties API router
 * @author Evan Jelle
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: counties
 *   description: Counties Routes
 */
// Import libraries
import express from "express";
// Import models
import { County, Community } from "../../../models/models.js";
// Import logger
import logger from "../../../configs/logger.js";
// Create Express router
const router = express.Router();

/**
 * Gets the list of counties
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/counties:
 *   get:
 *     summary: roles list page
 *     description: Gets the list of all counties in the application
 *     tags: [counties]
 *     responses:
 *       200:
 *         description: the list of counties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/County'
 */
router.get("/", async function (req, res, next) {
  try {
    const counties = await County.findAll({
      include: [
        {
          model: Community,
          as: "communities",
          attributes: ["id", "name", "lat", "long"],
        },
      ],
    });
    res.json(counties);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
