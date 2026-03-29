/**
 * @file Document schema
 * @author Evan Jelle
 * @exports DocumentSchema the schema for the Document model
 */
import Sequelize from 'sequelize';

const DocumentSchema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    display_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    filename: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    size: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}

export default DocumentSchema