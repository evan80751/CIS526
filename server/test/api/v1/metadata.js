/**
 * @file /api/v1/metadata Route Tests
 * @author Evan Jelle
 */
// Load Libraries
import request from "supertest";
import { use, should } from "chai";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import chaiJsonSchemaAjv from "chai-json-schema-ajv";
import chaiShallowDeepEqual from "chai-shallow-deep-equal";
import { login, all_roles, testRoleBasedAuth } from "../../helpers.js";
// Import Express application
import app from "../../../app.js";
// Configure Chai and AJV
const ajv = new Ajv();
addFormats(ajv);
use(chaiJsonSchemaAjv.create({ ajv, verbose: true }));
use(chaiShallowDeepEqual);
// Modify Object.prototype for BDD style assertions
should();

let token;

const metadataSchema = {
  type: "object",
  required: [
    "id",
    "title",
    "author",
    "publisher",
    "date",
    "abstract",
    "citation",
    "copyright_id",
    "keywords",
    "owner",
    "documents",
    "communities",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "number" },
    title: { type: "string" },
    author: { type: "string" },
    publisher: { type: "string" },
    date: { type: "string" },
    abstract: { type: "string" },
    citation: { type: "string" },
    copyright_id: { type: "number" },
    keywords: { type: "string" },
    owner: {
      type: "object",
      required: ["id", "username"],
      properties: {
        id: { type: "number" },
        username: { type: "string" },
      },
      additionalProperties: false,
    },
    documents: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "display_name", "filename", "size", "type"],
        properties: {
          id: { type: "number" },
          display_name: { type: "string" },
          filename: { type: "string" },
          size: { type: "number" },
          type: { type: "string" },
        },
      },
    },
    communities: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name", "lat", "long"],
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          lat: { type: "number" },
          long: { type: "number" },
          county: {
            type: "object",
            required: ["id", "name", "code"],
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              code: { type: "string" },
            },
          },
        },
      },
    },
    createdAt: { type: "string", format: "iso-date-time" },
    updatedAt: { type: "string", format: "iso-date-time" },
  },
};

const newMetadata = {
  title: "New Metadata",
  author: "Lastname, Firstname",
  publisher: "Kansas State University, The Chapman Center for Rural Studies",
  date: "2025-02-01",
  abstract: "This paper has an abstract",
  citation: "Firstname Lastname, New Metadata, 2025-02, ...",
  copyright_id: 1,
  keywords: "Keyword1 Keyword2 Keyword3",
};

/**
 * Get all metadata
 */
const getAllMetadata = () => {
  it("should list all metadata", (done) => {
    request(app)
      .get("/api/v1/metadata")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        done();
      });
  });

  it("all metadata should match schema", (done) => {
    request(app)
      .get("/api/v1/metadata")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema({ type: "array", items: metadataSchema });
        done();
      });
  });
};

/**
 * Get single metadata
 */
const getSingleMetadata = () => {
  it("should get metadata with id '1'", (done) => {
    request(app)
      .get("/api/v1/metadata/1")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.shallowDeepEqual({
          id: 1,
          title: "Elsmore, Allen County ",
        });
        done();
      });
  });

  it("metadata '1' should match schema", (done) => {
    request(app)
      .get("/api/v1/metadata/1")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(metadataSchema);
        done();
      });
  });

  it("metadata '1' should have correct owner", (done) => {
    request(app)
      .get("/api/v1/metadata/1")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.owner.should.shallowDeepEqual({ id: 1, username: "admin" });
        done();
      });
  });

  it("should return 404 when requesting metadata with id '0'", (done) => {
    request(app)
      .get("/api/v1/metadata/0")
      .set("Authorization", "Bearer " + token)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 404 when requesting metadata with id '-1'", (done) => {
    request(app)
      .get("/api/v1/metadata/-1")
      .set("Authorization", "Bearer " + token)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Create metadata
 */
const createMetadata = () => {
  it("should successfully create new metadata", (done) => {
    request(app)
      .post("/api/v1/metadata")
      .set("Authorization", "Bearer " + token)
      .send(newMetadata)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        done();
      });
  });

  it("should fail when missing required field 'title'", (done) => {
    request(app)
      .post("/api/v1/metadata")
      .send({ ...newMetadata, title: undefined })
      .set("Authorization", "Bearer " + token)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("error");
        done();
      });
  });
};

/**
 * Update metadata
 */
const updateMetadata = () => {
  it("should successfully update metadata ID '1'", (done) => {
    request(app)
      .put("/api/v1/metadata/1")
      .send({ ...newMetadata, title: "Updated Metadata" })
      .set("Authorization", "Bearer " + token)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        done();
      });
  });

  it("should return 404 when updating metadata with id '0'", (done) => {
    request(app)
      .put("/api/v1/metadata/0")
      .set("Authorization", "Bearer " + token)
      .send(newMetadata)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Delete metadata
 */
const deleteMetadata = () => {
  it("should successfully delete metadata ID '2'", (done) => {
    request(app)
      .delete("/api/v1/metadata/2")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        done();
      });
  });

  it("should return 404 when deleting metadata with id '0'", (done) => {
    request(app)
      .delete("/api/v1/metadata/0")
      .set("Authorization", "Bearer " + token)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Add/remove document from metadata
 */
const addRemoveDocument = () => {
  it("should successfully add document to metadata ID '1'", (done) => {
    request(app)
      .post("/api/v1/metadata/1/add_document")
      .set("Authorization", "Bearer " + token)
      .send({ id: 2 })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        done();
      });
  });

  it("should successfully remove document from metadata ID '1'", (done) => {
    request(app)
      .post("/api/v1/metadata/1/remove_document")
      .set("Authorization", "Bearer " + token)
      .send({ id: 2 })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        done();
      });
  });

  it("should return 404 when adding document to metadata with id '0'", (done) => {
    request(app)
      .post("/api/v1/metadata/0/add_document")
      .set("Authorization", "Bearer " + token)
      .send({ id: 1 })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Add/remove community from metadata
 */
const addRemoveCommunity = () => {
  it("should successfully add community to metadata ID '1'", (done) => {
    request(app)
      .post("/api/v1/metadata/1/add_community")
      .set("Authorization", "Bearer " + token)
      .send({ id: 2 })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        done();
      });
  });

  it("should successfully remove community from metadata ID '1'", (done) => {
    request(app)
      .post("/api/v1/metadata/1/remove_community")
      .set("Authorization", "Bearer " + token)
      .send({ id: 2 })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        done();
      });
  });

  it("should return 404 when adding community to metadata with id '0'", (done) => {
    request(app)
      .post("/api/v1/metadata/0/add_community")
      .set("Authorization", "Bearer " + token)
      .send({ id: 1 })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Test /api/v1/metadata route
 */
describe("/api/v1/metadata", () => {
  beforeEach(async () => {
    token = await login("admin");
  });
  describe("GET /", () => {
    getAllMetadata();
  });
  describe("GET /{id}", () => {
    getSingleMetadata();
  });
  describe("POST /", () => {
    createMetadata();
  });
  describe("PUT /{id}", () => {
    updateMetadata();
  });
  describe("DELETE /{id}", () => {
    deleteMetadata();
  });
  describe("POST /{id}/add_document", () => {
    addRemoveDocument();
  });
  describe("POST /{id}/add_community", () => {
    addRemoveCommunity();
  });
describe("GET / - role-based auth", () => {
    const allowed_roles = ["view_documents", "manage_documents", "add_documents"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/metadata", "get", r, allowed_roles.includes(r));
    });
  });
  describe("POST / - role-based auth", () => {
    const allowed_roles = ["manage_documents", "add_documents"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/metadata", "post", r, allowed_roles.includes(r));
    });
  });
  describe("PUT /{id} - role-based auth", () => {
    const allowed_roles = ["manage_documents"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/metadata/1", "put", r, allowed_roles.includes(r));
    });
  });
  describe("DELETE /{id} - role-based auth", () => {
    const allowed_roles = ["manage_documents"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/metadata/1", "delete", r, allowed_roles.includes(r));
    });
  });
});
