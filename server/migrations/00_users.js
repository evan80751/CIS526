/**
 * @file: Users table migration
 * @author: Evan Jelle
 * @exports: up the Up migration
 * @exports: down the Down migration
 */
// Import Libraries
import {Sequelize} from "sequelize";

/**
 * Apply the migration
 * 
 * @param {QueryInterface} context
 */
export async function up({context: QueryInterface}) {
    await QueryInterface.createTable('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    })
}

/**
 * Roll back the migration
 * 
 * @param {QueryInterface} context
 */
export async function down({context: QueryInterface}) {
    await QueryInterface.dropTable('users');   
}