/**
 * @file /api/v1/communities Route Tests
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

const communitySchema = {
  type: "object",
  required: [
    "id",
    "name",
    "lat",
    "long",
    "owner",
    "county",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    lat: { type: "number" },
    long: { type: "number" },
    owner: {
      type: "object",
      required: ["id", "username"],
      properties: {
        id: { type: "number" },
        username: { type: "string" },
      },
      additionalProperties: false,
    },
    county: {
      type: "object",
      required: ["id", "name", "code"],
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        code: { type: "string" },
      },
      additionalProperties: false,
    },
    createdAt: { type: "string", format: "iso-date-time" },
    updatedAt: { type: "string", format: "iso-date-time" },
  },
};

/**
 * Get all communities
 */
const getAllCommunities = () => {
  it("should list all communities", (done) => {
    request(app)
      .get("/api/v1/communities")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        done();
      });
  });
};

/**
 * Check JSON Schema of Communities
 */
const getCommunitiesSchemaMatch = () => {
  it("all communities should match schema", (done) => {
    request(app)
      .get("/api/v1/communities")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema({
          type: "array",
          items: communitySchema,
        });
        done();
      });
  });
};

/**
 * Get single community
 */
const getSingleCommunity = () => {
  it("should get community 'Colony'", (done) => {
    request(app)
      .get("/api/v1/communities/1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.shallowDeepEqual({ id: 1, name: "Colony" });
        done();
      });
  });

  it("community 'Colony' should match schema", (done) => {
    request(app)
      .get("/api/v1/communities/1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(communitySchema);
        done();
      });
  });

  it("community 'Colony' should have correct owner and county", (done) => {
    request(app)
      .get("/api/v1/communities/1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.owner.should.shallowDeepEqual({ id: 1, username: "admin" });
        res.body.county.should.shallowDeepEqual({
          id: 2,
          name: "Anderson",
          code: "AN",
        });
        done();
      });
  });

  it("should return 404 when requesting community with id '0'", (done) => {
    request(app)
      .get("/api/v1/communities/0")
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 404 when requesting community with id '-1'", (done) => {
    request(app)
      .get("/api/v1/communities/-1")
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Create community
 */
const createCommunity = () => {
  it("should successfully create a new community", (done) => {
    request(app)
      .post("/api/v1/communities")
      .send({
        name: "New Community",
        lat: 35.1234567,
        long: -96.1234567,
        owner: { id: 1 },
        county: { id: 1 },
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        done();
      });
  });

  it("should fail when missing required field 'name'", (done) => {
    request(app)
      .post("/api/v1/communities")
      .send({
        lat: 35.1234567,
        long: -96.1234567,
        owner: { id: 1 },
        county: { id: 1 },
      })
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("error");
        done();
      });
  });
};

/**
 * Update community
 */
const updateCommunity = () => {
  it("should successfully update community ID '1'", (done) => {
    request(app)
      .put("/api/v1/communities/1")
      .send({
        name: "Updated Community",
        lat: 35.1234567,
        long: -96.1234567,
        owner: { id: 1 },
        county: { id: 1 },
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        done();
      });
  });

  it("should return 404 when updating community with id '0'", (done) => {
    request(app)
      .put("/api/v1/communities/0")
      .send({
        name: "Updated Community",
        lat: 35.1234567,
        long: -96.1234567,
        owner: { id: 1 },
        county: { id: 1 },
      })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Delete community
 */
const deleteCommunity = () => {
  it("should successfully delete community ID '2'", (done) => {
    request(app)
      .delete("/api/v1/communities/2")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        done();
      });
  });

  it("should return 404 when deleting community with id '0'", (done) => {
    request(app)
      .delete("/api/v1/communities/0")
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Test /api/v1/communities route
 */
describe("/api/v1/communities", () => {
  describe("GET /", () => {
    getAllCommunities();
    getCommunitiesSchemaMatch();
  });
  describe("GET /{id}", () => {
    getSingleCommunity();
  });
  describe("POST /", () => {
    createCommunity();
  });
  describe("PUT /{id}", () => {
    updateCommunity();
  });
  describe("DELETE /{id}", () => {
    deleteCommunity();
  });
});
