/**
 * @file Metadata migration
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import Sequelize from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('metadata', {
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
      references: { model: 'users', key: 'id' },
      onDelete: 'cascade',
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
  await queryInterface.dropTable('metadata');
}