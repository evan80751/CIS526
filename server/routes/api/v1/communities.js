/**
 * @file Communities API router
 * @author Evan Jelle
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: communities
 *   description: Communities Routes
 */
// Import libraries
import express from "express";
// Import models
import { Community, User, County } from "../../../models/models.js";
// Import configs
import logger from "../../../configs/logger.js";
import database from "../../../configs/database.js";
// Import utilities
import sendSuccess from "../../../utilities/send-success.js";
import handleValidationError from "../../../utilities/handle-validation-error.js";
// Import Sequelize
import { ValidationError } from "sequelize";
import roleBasedAuth from "../../../middlewares/authorized-roles.js";
// Create Express router
const router = express.Router();

/**
 * Gets the list of communities
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/communities:
 *   get:
 *     summary: communities list page
 *     description: Gets the list of all communities in the application
 *     tags: [communities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of communities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Community'
 */
router.get("/", roleBasedAuth(["view_communities", "manage_communities", "add_communities"]), async function (req, res, next) {
  try {
    const communities = await Community.findAll({
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username"],
        },
        {
          model: County,
          as: "county",
          attributes: ["id", "name", "code"],
        },
      ],
    });
    res.json(communities);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Gets a single community by ID
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/communities/{id}:
 *   get:
 *     summary: get single community
 *     description: Gets a single community by ID
 *     tags: [communities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: community ID
 *     responses:
 *       200:
 *         description: a community
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Community'
 */
router.get("/:id", roleBasedAuth(["view_communities", "manage_communities", "add_communities"]), async function (req, res, next) {
  try {
    const community = await Community.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username"],
        },
        {
          model: County,
          as: "county",
          attributes: ["id", "name", "code"],
        },
      ],
    });
    if (!community) {
      res.status(404).end();
      return;
    }
    res.json(community);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Creates a new community
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/communities:
 *   post:
 *     summary: create community
 *     description: Creates a new community. The owner is automatically set to the authenticated user.
 *     tags: [communities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: community
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Community'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/", roleBasedAuth(["manage_communities", "add_communities"]), async function (req, res, next) {
  try {
    const result = await database.transaction(async (t) => {
      const community = await Community.create(
        {
          name: req.body.name,
          lat: req.body.lat,
          long: req.body.long,
          owner_user_id: req.user.id,
          county_id: req.body.county.id,
        },
        { transaction: t },
      );
      return community;
    });
    sendSuccess("Community successfully saved!", result.id, 201, res);
  } catch (error) {
    if (error instanceof ValidationError) {
      handleValidationError(error, res);
      return;
    }
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Updates an existing community
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/communities/{id}:
 *   put:
 *     summary: update community
 *     description: Updates an existing community. The owner cannot be changed.
 *     tags: [communities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: community ID
 *     requestBody:
 *       description: community
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Community'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.put("/:id", roleBasedAuth("manage_communities"), async function (req, res, next) {
  try {
    const community = await Community.findByPk(req.params.id);
    if (!community) {
      res.status(404).end();
      return;
    }
    await database.transaction(async (t) => {
      await community.update(
        {
          name: req.body.name,
          lat: req.body.lat,
          long: req.body.long,
          county_id: req.body.county.id,
        },
        { transaction: t },
      );
    });
    sendSuccess("Community successfully saved!", community.id, 201, res);
  } catch (error) {
    if (error instanceof ValidationError) {
      handleValidationError(error, res);
      return;
    }
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Deletes a community
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/communities/{id}:
 *   delete:
 *     summary: delete community
 *     tags: [communities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: community ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
router.delete("/:id", roleBasedAuth("manage_communities"), async function (req, res, next) {
  try {
    const community = await Community.findByPk(req.params.id);
    if (!community) {
      res.status(404).end();
      return;
    }
    await community.destroy();
    sendSuccess("Community successfully deleted!", community.id, 200, res);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;