/**
 * @file Metadata document junction schema
 * @author Evan Jelle
 * @exports MetadataDocumentSchema the schema for the MetadataDocument model
 */
import Sequelize from 'sequelize';

const MetadataDocumentSchema = {
    metadata_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Metadata', key: 'id' },
        onDelete: 'cascade',
    },
    document_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Document', key: 'id' },
        onDelete: 'cascade',
    },
}

export default MetadataDocumentSchema