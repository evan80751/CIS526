/**
 * @file Database models
 * @author Evan Jelle
 * @exports User a Sequelize User model
 * @exports Role a Sequelize Role model
 * @exports UserRole a Sequelize UserRole model
 * @exports County a Sequelize County model
 * @exports Community a Sequelize Community model
 * @exports Document a Sequelize Document model
 * @exports Metadata a Sequelize Metadata model
 * @exports MetadataDocument a Sequelize MetadataDocument model
 * @exports MetadataCommunity a Sequelize MetadataCommunity model
 */
// Import database connection
import database from "../configs/database.js";
// Import Schemas
import UserSchema from "./user.js";
import RoleSchema from "./role.js";
import UserRoleSchema from "./user_role.js";
import CountySchema from "./county.js";
import CommunitySchema from "./community.js";
import DocumentSchema from "./document.js";
import MetadataSchema from "./metadata.js";
import MetadataDocumentSchema from "./metadata_document.js";
import MetadataCommunitySchema from "./metadata_community.js";

// Create User Model
const User = database.define(
  // Model Name
  "User",
  // Schema
  UserSchema,
  // Other options
  {
    tableName: "users",
  },
);

// Create Role Model
const Role = database.define("Role", RoleSchema, {
  tableName: "roles",
});

// Create UserRole Model
const UserRole = database.define("UserRole", UserRoleSchema, {
  tableName: "user_roles",
  timestamps: false,
  underscored: true,
});

// Create County Model
const County = database.define("County", CountySchema, {
  tableName: "counties",
});

// Create Community Model
const Community = database.define("Community", CommunitySchema, {
  tableName: "communities",
});

// Create Document Model
const Document = database.define("Document", DocumentSchema, {
  tableName: "documents",
});

// Create Metadata Model
const Metadata = database.define("Metadata", MetadataSchema, {
  tableName: "metadata",
  underscored: true,
});

// Create MetadataDocument Model
const MetadataDocument = database.define(
  "MetadataDocument",
  MetadataDocumentSchema,
  {
    tableName: "metadata_documents",
    timestamps: false,
    underscored: true,
  },
);

// Create MetadataCommunity Model
const MetadataCommunity = database.define(
  "MetadataCommunity",
  MetadataCommunitySchema,
  {
    tableName: "metadata_communities",
    timestamps: false,
    underscored: true,
  },
);

// Define Associations
Role.belongsToMany(User, { through: UserRole, unique: false, as: "users" });
User.belongsToMany(Role, { through: UserRole, unique: false, as: "roles" });

County.hasMany(Community, { foreignKey: "county_id", as: "communities" });
Community.belongsTo(County, { foreignKey: "county_id", as: "county" });

User.hasMany(Community, { foreignKey: "owner_user_id", as: "communities" });
Community.belongsTo(User, { foreignKey: "owner_user_id", as: "owner" });

User.hasMany(Metadata, { foreignKey: "owner_user_id", as: "metadata" });
Metadata.belongsTo(User, { foreignKey: "owner_user_id", as: "owner" });

Metadata.belongsToMany(Document, {
  through: MetadataDocument,
  unique: false,
  as: "documents",
});
Document.belongsToMany(Metadata, {
  through: MetadataDocument,
  unique: false,
  as: "metadata",
});

Metadata.belongsToMany(Community, {
  through: MetadataCommunity,
  unique: false,
  as: "communities",
});
Community.belongsToMany(Metadata, {
  through: MetadataCommunity,
  unique: false,
  as: "metadata",
});

export {
  User,
  Role,
  UserRole,
  County,
  Community,
  Document,
  Metadata,
  MetadataDocument,
  MetadataCommunity,
};
