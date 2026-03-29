/**
 * @file County schema
 * @author Evan Jelle
 * @exports CountySchema the schema for the County model
 */
import Sequelize from 'sequelize';

const CountySchema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    seat: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    population: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    est_year: {
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

export default CountySchema