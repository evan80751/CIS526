/**
 * @file Users API router
 * @author Evan Jelle
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: users
 *   description: Users endpoints
 */

// Import libraries
import express from "express";

// Import models
import { User, Role } from "../../../models/models.js";

// Import logger
import logger from "../../../configs/logger.js";
import database from "../../../configs/database.js";
import sendSuccess from "../../../utilities/send-success.js";
import { ValidationError } from "sequelize";
import handleValidationError from "../../../utilities/handle-validation-error.js";

// Create Express router
const router = express.Router();

/**
 * Gets the list of users
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: users list page
 *     description: Gets the list of all users in the application
 *     tags: [users]
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll({ include: { model: Role, as: "roles" } });
    res.json(users);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Gets a single user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: get a user
 *     description: Gets a single user in the application
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: the user id
 *     responses:
 *       200:
 *         description: a single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: user not found
 */
router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: { model: Role, as: "roles" },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});
/**
 * Creates a new user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: create user
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: user created
 *       400:
 *         description: validation error
 */
router.post("/", async function (req, res, next) {
  try {
    await database.transaction(async (t) => {
      const user = await User.create(req.body, { transaction: t });
      if (req.body.roles) {
        const roles = await Promise.all(
          req.body.roles.map(({ id, ...next }) => {
            return Role.findByPk(id);
          }),
        );
        await user.setRoles(roles, { transaction: t });
      }
      sendSuccess("User saved!", user.id, 201, res);
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      handleValidationError(error, res);
    } else {
      logger.error(error);
      res.status(500).end();
    }
  }
});

/**
 * Updates a user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: update user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: the user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: user updated
 *       400:
 *         description: validation error
 *       404:
 *         description: user not found
 */
router.put("/:id", async function (req, res, next) {
  try {
    await database.transaction(async (t) => {
      const user = await User.findByPk(req.params.id, { transaction: t });
      if (user) {
        await user.update(req.body, { transaction: t });
        if (req.body.roles) {
          const roles = await Promise.all(
            req.body.roles.map(({ id, ...next }) => {
              return Role.findByPk(id);
            }),
          );
          await user.setRoles(roles, { transaction: t });
        }
        sendSuccess("User saved!", user.id, 201, res);
      } else {
        res.status(404).end();
      }
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      handleValidationError(error, res);
    } else {
      logger.error(error);
      res.status(500).end();
    }
  }
});

/**
 * Deletes a user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: delete user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: the user id
 *     responses:
 *       200:
 *         description: user deleted
 *       404:
 *         description: user not found
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      sendSuccess("User deleted!", req.params.id, 200, res);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
