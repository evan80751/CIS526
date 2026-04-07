/**
 * @file /api/v1/roles Route Tests
 * @author Evan Jelle
 */

// Load Libraries
import request from "supertest";
import { use, should } from "chai";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import chaiJsonSchemaAjv from "chai-json-schema-ajv";
import chaiShallowDeepEqual from "chai-shallow-deep-equal";

// Import Express application
import app from "../../../app.js";

// Configure Chai and AJV
const ajv = new Ajv();
addFormats(ajv);
use(chaiJsonSchemaAjv.create({ ajv, verbose: true }));
use(chaiShallowDeepEqual);

// Modify Object.prototype for BDD style assertions
should();

/**
 * Get all roles
 */
const getAllRoles = () => {
  it("should list all roles", (done) => {
    request(app)
      .get("/api/v1/roles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        res.body.should.have.lengthOf(7);
        done();
      });
  });
};

/**
 * Check JSON Schema of Roles
 */
const getRolesSchemaMatch = () => {
  it("all roles should match schema", (done) => {
    const schema = {
      type: "array",
      items: {
        type: "object",
        required: ["id", "role"],
        properties: {
          id: { type: "number" },
          role: { type: "string" },
          createdAt: { type: "string", format: "iso-date-time" },
          updatedAt: { type: "string", format: "iso-date-time" },
        },
        additionalProperties: false,
      },
    };
    request(app)
      .get("/api/v1/roles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(schema);
        done();
      });
  });
};

/**
 * Check Role exists in list
 */
const findRole = (role) => {
  it("should contain '" + role.role + "' role", (done) => {
    request(app)
      .get("/api/v1/roles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const foundRole = res.body.find((r) => r.id === role.id);
        foundRole.should.shallowDeepEqual(role);
        done();
      });
  });
};

// List of all expected roles in the application
const roles = [
  { id: 1, role: "manage_users" },
  { id: 2, role: "manage_documents" },
  { id: 3, role: "add_documents" },
  { id: 4, role: "manage_communities" },
  { id: 5, role: "add_communities" },
  { id: 6, role: "view_documents" },
  { id: 7, role: "view_communities" },
];

/**
 * Test /api/v1/roles route
 */
describe("/api/v1/roles", () => {
  describe("GET /", () => {
    getAllRoles();
    getRolesSchemaMatch();

    roles.forEach((r) => {
      findRole(r);
    });
  });
});