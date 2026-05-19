/**
 * @file Documents API router
 * @author Evan Jelle
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: documents
 *   description: Documents Routes
 */
// Import libraries
import express from "express";
import multer from "multer";
// Import models
import { Document } from "../../../models/models.js";
// Import configs
import logger from "../../../configs/logger.js";
import database from "../../../configs/database.js";
// Import utilities
import sendSuccess from "../../../utilities/send-success.js";
import handleValidationError from "../../../utilities/handle-validation-error.js";
// Import Sequelize
import { ValidationError } from "sequelize";
import roleBasedAuth from "../../../middlewares/authorized-roles.js";
// Import nanoid and mine-types
import { nanoid } from "nanoid";
import mime from "mime-types";
import fs from "fs";

// Ensure uploads directory exists
fs.mkdirSync("public/uploads", { recursive: true });

// Create Express router
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, nanoid() + "." + mime.extension(file.mimetype));
  },
});
const upload = multer({ storage: storage });

/**
 * Gets the list of documents
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/documents:
 *   get:
 *     summary: documents list page
 *     description: Gets the list of all documents in the application
 *     tags: [documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 */
router.get("/", roleBasedAuth(["view_documents", "manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const documents = await Document.findAll();
    res.json(documents);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Gets a single document by ID
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/documents/{id}:
 *   get:
 *     summary: get single document
 *     description: Gets a single document by ID
 *     tags: [documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: document ID
 *     responses:
 *       200:
 *         description: a document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 */
router.get("/:id", roleBasedAuth(["view_documents", "manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      res.status(404).end();
      return;
    }
    res.json(document);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Creates a new document
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/documents:
 *   post:
 *     summary: create document
 *     tags: [documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: document
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/", roleBasedAuth(["manage_documents", "add_documents"]), async function (req, res, next) {
  try {
    const result = await database.transaction(async (t) => {
      const document = await Document.create(
        {
          display_name: req.body.display_name,
          filename: "",
          size: 0,
          type: "",
        },
        { transaction: t },
      );
      return document;
    });
    sendSuccess("Document successfully saved!", result.id, 201, res);
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
 * Updates an existing document
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/documents/{id}:
 *   put:
 *     summary: update document
 *     tags: [documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: document ID
 *     requestBody:
 *       description: document
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.put("/:id", roleBasedAuth("manage_documents"), async function (req, res, next) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      res.status(404).end();
      return;
    }
    await database.transaction(async (t) => {
      await document.update(
        {
          display_name: req.body.display_name,
        },
        { transaction: t },
      );
    });
    sendSuccess("Document successfully saved!", document.id, 201, res);
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
 * Deletes a document
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/documents/{id}:
 *   delete:
 *     summary: delete document
 *     tags: [documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: document ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
router.delete("/:id", roleBasedAuth("manage_documents"), async function (req, res, next) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      res.status(404).end();
      return;
    }
    await document.destroy();
    sendSuccess("Document successfully deleted!", document.id, 200, res);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

/**
 * Uploads a file for a document
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/documents/{id}/upload:
 *   post:
 *     summary: upload document
 *     tags: [documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: document ID
 *     requestBody:
 *       description: document
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  "/:id/upload",
  roleBasedAuth(["manage_documents", "add_documents"]),
  upload.single("file"),
  async function (req, res, next) {
    try {
      const document = await Document.findByPk(req.params.id);
      if (!document) {
        res.status(404).end();
        return;
      }
      if (!req.file) {
        res.status(422).json({ error: "No file uploaded" });
        return;
      }
      await database.transaction(async (t) => {
        await document.update(
          {
            filename: req.file.filename,
            size: Math.round(req.file.size / 1024),
            type: req.file.mimetype,
          },
          { transaction: t },
        );
      });
      sendSuccess("Document successfully uploaded!", document.id, 201, res);
    } catch (error) {
      logger.error(error);
      res.status(500).end();
    }
  },
);

export default router;