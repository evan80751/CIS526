/**
 * @file Metadata community junction schema
 * @author Evan Jelle
 * @exports MetadataCommunitySchema the schema for the MetadataCommunity model
 */
import Sequelize from 'sequelize';

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