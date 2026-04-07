/**
 * @file Metadata document junction schema
 * @author Evan Jelle
 * @exports MetadataDocumentSchema the schema for the MetadataDocument model
 */
import Sequelize from "sequelize";

/**
 * @swagger
 * components:
 *   schemas:
 *     MetadataDocument:
 *       type: object
 *       required:
 *         - metadata_id
 *         - document_id
 *       properties:
 *         metadata_id:
 *           type: integer
 *           description: id of the metadata record
 *         document_id:
 *           type: integer
 *           description: id of the document record
 *       example:
 *         metadata_id: 1
 *         document_id: 1
 */

const MetadataDocumentSchema = {
  metadata_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: { model: "Metadata", key: "id" },
    onDelete: "cascade",
  },
  document_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: { model: "Document", key: "id" },
    onDelete: "cascade",
  },
};

export default MetadataDocumentSchema;
