/**
 * @file Metadata schema
 * @author Evan Jelle
 * @exports MetadataSchema the schema for the Metadata model
 */
import Sequelize from 'sequelize';

const MetadataSchema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    publisher: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    abstract: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    citation: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    copyright_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    keywords: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    owner_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}

export default MetadataSchema