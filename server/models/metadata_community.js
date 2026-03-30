/**
 * @file Metadata community junction schema
 * @author Evan Jelle
 * @exports MetadataCommunitySchema the schema for the MetadataCommunity model
 */
import Sequelize from 'sequelize';

/**
 * @swagger
 * components:
 *   schemas:
 *     MetadataCommunity:
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
 *           description: id of the community record
 *       example:
 *         metadata_id: 1
 *         document_id: 1
 */

const MetadataCommunitySchema = {
    metadata_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Metadata', key: 'id' },
        onDelete: 'cascade',
    },
    community_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Community', key: 'id' },
        onDelete: 'cascade',
    },
}

export default MetadataCommunitySchema