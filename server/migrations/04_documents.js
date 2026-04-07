/**
 * @file Documents migration
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import Sequelize from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("documents", {
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
    },
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("documents");
}
