/**
 * @file Communities migration
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import Sequelize from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("communities", {
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
      references: { model: "users", key: "id" },
      onDelete: "cascade",
    },
    county_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "counties", key: "id" },
      onDelete: "cascade",
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
  await queryInterface.dropTable("communities");
}
