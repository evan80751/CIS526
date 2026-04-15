/**
 * @file Metadata API router
 * @author Evan Jelle
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: metadata
 *   description: Metadata Routes
 */
// Import libraries
import express from "express";
// Import models
import {
  Metadata,
  User,
  Document,
  Community,
  County,
} from "../../../models/models.js";
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

const metadataIncludes = [
  {
    model: User,
    as: "owner",
    attributes: ["id", "username"],
  },
  {
    model: Document,
    as: "documents",
  },
  {
    model: Community,
    as: "communities",
    attributes: ["id", "name", "lat", "long"],
    include: [
      {
        model: County,
        as: "county",
        attributes: ["id", "name", "code"],
      },
    ],
  },
];

/**
 * Gets the list of metadata
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata:
 *   get:
 *     summary: metadata list page
 *     description: Gets the list of all metadata in the application
 *     tags: [metadata]
 *     responses:
 *       200:
 *         description: the list of metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Metadata'
 */
router.get("/", roleBasedAuth(["view_documents", "manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const metadata = await Metadata.findAll({ include: metadataIncludes });
    res.json(metadata);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Gets a single metadata item by ID
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata/{id}:
 *   get:
 *     summary: get single metadata
 *     description: Gets a single metadata item by ID
 *     tags: [metadata]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: metadata ID
 *     responses:
 *       200:
 *         description: a metadata item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Metadata'
 */
router.get("/:id", roleBasedAuth(["view_documents", "manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const metadata = await Metadata.findByPk(req.params.id, {
      include: metadataIncludes,
    });
    if (!metadata) {
      res.status(404).end();
      return;
    }
    res.json(metadata);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Creates a new metadata item
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata:
 *   post:
 *     summary: create metadata
 *     description: Creates a new metadata record. The owner is automatically set to the authenticated user.
 *     tags: [metadata]
 *     requestBody:
 *       description: metadata
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Metadata'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/", roleBasedAuth(["manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const result = await database.transaction(async (t) => {
      const metadata = await Metadata.create(
        {
          title: req.body.title,
          author: req.body.author,
          publisher: req.body.publisher,
          date: req.body.date,
          abstract: req.body.abstract,
          citation: req.body.citation,
          copyright_id: req.body.copyright_id,
          keywords: req.body.keywords,
          owner_user_id: req.user.id,
        },
        { transaction: t },
      );
      return metadata;
    });
    sendSuccess("Metadata successfully saved!", result.id, 201, res);
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
 * Updates an existing metadata item
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata/{id}:
 *   put:
 *     summary: update metadata
 *     description: Updates an existing metadata record. The owner cannot be changed.
 *     tags: [metadata]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: metadata ID
 *     requestBody:
 *       description: metadata
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Metadata'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.put("/:id", roleBasedAuth("manage_documents"), async function (req, res, next) {
  try {
    const metadata = await Metadata.findByPk(req.params.id);
    if (!metadata) {
      res.status(404).end();
      return;
    }
    await database.transaction(async (t) => {
      await metadata.update(
        {
          title: req.body.title,
          author: req.body.author,
          publisher: req.body.publisher,
          date: req.body.date,
          abstract: req.body.abstract,
          citation: req.body.citation,
          copyright_id: req.body.copyright_id,
          keywords: req.body.keywords,
        },
        { transaction: t },
      );
    });
    sendSuccess("Metadata successfully saved!", metadata.id, 201, res);
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
 * Deletes a metadata item
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata/{id}:
 *   delete:
 *     summary: delete metadata
 *     tags: [metadata]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: metadata ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
router.delete("/:id", roleBasedAuth("manage_documents"), async function (req, res, next) {
  try {
    const metadata = await Metadata.findByPk(req.params.id);
    if (!metadata) {
      res.status(404).end();
      return;
    }
    await metadata.destroy();
    sendSuccess("Metadata successfully deleted!", metadata.id, 200, res);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Adds a document to a metadata item
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata/{id}/add_document:
 *   post:
 *     summary: add document to metadata
 *     tags: [metadata]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: metadata ID
 *     requestBody:
 *       description: document ID
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: document id
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 */
router.post("/:id/add_document", roleBasedAuth(["manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const metadata = await Metadata.findByPk(req.params.id);
    if (!metadata) {
      res.status(404).end();
      return;
    }
    const document = await Document.findByPk(req.body.id);
    if (!document) {
      res.status(404).end();
      return;
    }
    await metadata.addDocument(document);
    sendSuccess("Document successfully added!", metadata.id, 201, res);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Removes a document from a metadata item
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata/{id}/remove_document:
 *   post:
 *     summary: remove document from metadata
 *     tags: [metadata]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: metadata ID
 *     requestBody:
 *       description: document ID
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: document id
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 */
router.post("/:id/remove_document", roleBasedAuth(["manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const metadata = await Metadata.findByPk(req.params.id);
    if (!metadata) {
      res.status(404).end();
      return;
    }
    const document = await Document.findByPk(req.body.id);
    if (!document) {
      res.status(404).end();
      return;
    }
    await metadata.removeDocument(document);
    sendSuccess("Document successfully removed!", metadata.id, 201, res);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Adds a community to a metadata item
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata/{id}/add_community:
 *   post:
 *     summary: add community to metadata
 *     tags: [metadata]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: metadata ID
 *     requestBody:
 *       description: community ID
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: community id
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 */
router.post("/:id/add_community", roleBasedAuth(["manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const metadata = await Metadata.findByPk(req.params.id);
    if (!metadata) {
      res.status(404).end();
      return;
    }
    const community = await Community.findByPk(req.body.id);
    if (!community) {
      res.status(404).end();
      return;
    }
    await metadata.addCommunity(community);
    sendSuccess("Community successfully added!", metadata.id, 201, res);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Removes a community from a metadata item
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/metadata/{id}/remove_community:
 *   post:
 *     summary: remove community from metadata
 *     tags: [metadata]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: metadata ID
 *     requestBody:
 *       description: community ID
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: community id
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 */
router.post("/:id/remove_community", roleBasedAuth(["manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const metadata = await Metadata.findByPk(req.params.id);
    if (!metadata) {
      res.status(404).end();
      return;
    }
    const community = await Community.findByPk(req.body.id);
    if (!community) {
      res.status(404).end();
      return;
    }
    await metadata.removeCommunity(community);
    sendSuccess("Community successfully removed!", metadata.id, 201, res);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
