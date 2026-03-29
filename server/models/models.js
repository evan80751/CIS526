/**
 * @file Database models
 * @author Evan Jelle
 * @exports User a Sequelize User model
 * @exports Role a Sequelize Role model
 * @exports UserRole a Sequelize UserRole model
 */
// Import database connection
import database from "../configs/database.js";
// Import Schemas
import UserSchema from "./user.js";
import RoleSchema from "./role.js";
import UserRoleSchema from "./user_role.js";

// Create User Model
const User = database.define(
    // Model Name
    'User',
    // Schema
    UserSchema,
    // Other options
    {
        tableName: 'users'
    }
)

// Create Role Model
const Role = database.define(
    'Role',
    RoleSchema,
    {
        tableName: 'roles'
    }
)

// Create UserRole Model
const UserRole = database.define(
    'UserRole',
    UserRoleSchema,
    {
        tableName: 'user_roles',
        timestamps: false,
        underscored: true
    }
)

// Define Associations
Role.belongsToMany(User, { through: UserRole, unique: false, as: "users" })
User.belongsToMany(Role, { through: UserRole, unique: false, as: "roles" })

export {
    User,
    Role,
    UserRole,
}