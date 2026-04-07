/**
 * @file Metadata documents junction migration
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import Sequelize from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("metadata_documents", {
    metadata_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: { model: "metadata", key: "id" },
      onDelete: "cascade",
    },
    document_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: { model: "documents", key: "id" },
      onDelete: "cascade",
    },
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("metadata_documents");
}
