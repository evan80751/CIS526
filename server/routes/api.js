/**
 * @file API main router
 * @author Evan Jelle
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: api
 *   description: API routes
 */

// Import libraries
import express from "express";

// Import v1 routers
import rolesRouter from "./api/v1/roles.js";
import usersRouter from "./api/v1/users.js";
import countiesRouter from "./api/v1/counties.js";
import communitiesRouter from "./api/v1/communities.js";
import documentRouter from "./api/v1/documents.js";
import metadataRouter from "./api/v1/metadata.js";

// Create Express router
const router = express.Router();

// Use v1 routers
router.use("/v1/roles", rolesRouter);
router.use("/v1/users", usersRouter);
router.use("/v1/counties", countiesRouter);
router.use("/v1/communities", communitiesRouter);
router.use("/v1/documents", documentRouter);
router.use("/v1/metadata", metadataRouter);

/**
 * Gets the list of API versions
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api:
 *   get:
 *     summary: api versions list
 *     description: Gets the list of all API versions available
 *     tags: [api]
 *     responses:
 *       200:
 *         description: the list of all versions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   version:
 *                     type: string
 *                   url:
 *                     type: string
 */
router.get("/", function (req, res, next) {
  res.json([
    {
      version: "1.0",
      url: "/api/v1/",
    },
  ]);
});

export default router;
