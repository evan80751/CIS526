/**
 * @file /api Route Tests
 * @author Evan Jelle
 */

// Load Libraries
import request from "supertest";
import { use, should } from "chai";
import chaiJsonSchemaAjv from "chai-json-schema-ajv";
import chaiShallowDeepEqual from "chai-shallow-deep-equal";
use(chaiJsonSchemaAjv.create({ verbose: true }));
use(chaiShallowDeepEqual);

// Import express application
import app from "../app.js";

// Modify Object.prototype for BDD style assertions
should();

/**
 * Get all API version
 */
const getAllVersions = () => {
    it("should list all API versions", (done) => {
        request(app)
        .get("/api/")
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            res.body.should.be.an("array");
            res.body.should.have.lengthOf(1);
            done();
        });
    });
};

/**
 * Check JSON Schema of API versions
 */
const getVersionsSchemaMatch = () => {
  it("all versions should match schema", (done) => {
    const schema = {
      type: "array",
      items: {
        type: "object",
        required: ["version", "url"],
        properties: {
          version: { type: "string" },
          url: { type: "string" },
        },
        additionalProperties: false,
      },
    };
    request(app)
      .get("/api/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(schema);
        done();
      });
  });
};

/**
 * Test /api route
 */
describe("/api", () => {
    describe("GET /", () => {
        getAllVersions();
        getVersionsSchemaMatch();
    });
});