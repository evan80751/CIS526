/**
 * @file /api/v1/documents Route Tests
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

const documentSchema = {
  type: "object",
  required: ["id", "display_name", "filename", "size", "type", "createdAt", "updatedAt"],
  properties: {
    id: { type: "number" },
    display_name: { type: "string" },
    filename: { type: "string" },
    size: { type: "number" },
    type: { type: "string" },
    createdAt: { type: "string", format: "iso-date-time" },
    updatedAt: { type: "string", format: "iso-date-time" },
  },
};

/**
 * Get all documents
 */
const getAllDocuments = () => {
  it("should list all documents", (done) => {
    request(app)
      .get("/api/v1/documents")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        done();
      });
  });

  it("all documents should match schema", (done) => {
    request(app)
      .get("/api/v1/documents")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema({ type: "array", items: documentSchema });
        done();
      });
  });
};

/**
 * Get single document
 */
const getSingleDocument = () => {
  it("should get document with id '1'", (done) => {
    request(app)
      .get("/api/v1/documents/1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.shallowDeepEqual({ id: 1, display_name: "LT_AL_Elsmore_NIckell.jpeg" });
        done();
      });
  });

  it("document '1' should match schema", (done) => {
    request(app)
      .get("/api/v1/documents/1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(documentSchema);
        done();
      });
  });

  it("should return 404 when requesting document with id '0'", (done) => {
    request(app)
      .get("/api/v1/documents/0")
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 404 when requesting document with id '-1'", (done) => {
    request(app)
      .get("/api/v1/documents/-1")
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Create document
 */
const createDocument = () => {
  it("should successfully create a new document", (done) => {
    request(app)
      .post("/api/v1/documents")
      .send({ display_name: "New_Document.jpg" })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        done();
      });
  });

  it("should fail when missing required field 'display_name'", (done) => {
    request(app)
      .post("/api/v1/documents")
      .send({})
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("error");
        done();
      });
  });
};

/**
 * Update document
 */
const updateDocument = () => {
  it("should successfully update document ID '1'", (done) => {
    request(app)
      .put("/api/v1/documents/1")
      .send({ display_name: "Updated_Document.jpg" })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        done();
      });
  });

  it("should return 404 when updating document with id '0'", (done) => {
    request(app)
      .put("/api/v1/documents/0")
      .send({ display_name: "Updated_Document.jpg" })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Delete document
 */
const deleteDocument = () => {
  it("should successfully delete document ID '2'", (done) => {
    request(app)
      .delete("/api/v1/documents/2")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        done();
      });
  });

  it("should return 404 when deleting document with id '0'", (done) => {
    request(app)
      .delete("/api/v1/documents/0")
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Upload file to document
 */
const uploadDocument = () => {
  it("should successfully upload a file to document ID '1'", (done) => {
    request(app)
      .post("/api/v1/documents/1/upload")
      .attach("file", Buffer.from("test file contents"), "test.jpg")
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        done();
      });
  });

  it("should return 404 when uploading to document with id '0'", (done) => {
    request(app)
      .post("/api/v1/documents/0/upload")
      .attach("file", Buffer.from("test file contents"), "test.jpg")
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 422 when no file is provided", (done) => {
    request(app)
      .post("/api/v1/documents/1/upload")
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.have.property("error");
        done();
      });
  });
};

/**
 * Test /api/v1/documents route
 */
describe("/api/v1/documents", () => {
  describe("GET /", () => {
    getAllDocuments();
  });
  describe("GET /{id}", () => {
    getSingleDocument();
  });
  describe("POST /", () => {
    createDocument();
  });
  describe("PUT /{id}", () => {
    updateDocument();
  });
  describe("DELETE /{id}", () => {
    deleteDocument();
  });
  describe("POST /{id}/upload", () => {
    uploadDocument();
  });
});