/**
 * @file Community schema
 * @author Evan Jelle
 * @exports CommunitySchema the schema for the community model
 */
import Sequelize from 'sequelize';

const CommunitySchema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    long: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    owner_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    county_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
}

export default CommunitySchema