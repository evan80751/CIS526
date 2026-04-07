/**
 * @file Metadata communities junction migration
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import Sequelize from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("metadata_communities", {
    metadata_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: { model: "metadata", key: "id" },
      onDelete: "cascade",
    },
    community_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: { model: "communities", key: "id" },
      onDelete: "cascade",
    },
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("metadata_communities");
}
