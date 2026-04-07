/**
 * @file Counties API router
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

const countySchema = {
    type: "array",
    items: {
        type: "object",
        required: ["id", "name", "code", "seat", "population", "est_year", "communities", "createdAt", "updatedAt"],
        properties: {
            id: {type: "number" },
            name: {type: "string" },
            code: {type: "string" },
            seat: {type: "string" },
            population: {type: "number" },
            est_year: {type: "number" },
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
                    },
                    additionalProperties: false,
                },
            },
            createdAt: {type: "string", format: "iso-date-time" },
            updatedAt: {type: "string", format: "iso-date-time" },
        },
    },
};

/**
 * Get all counties
 */
const getAllCounties = () => {
    it("should list all counties", (done) => {
        request(app)
        .get("/api/v1/counties")
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            res.body.should.be.an("array");
            res.body.should.have.lengthOf(105);
            done();
        });
    });
};

/**
 * Check JSON Schema of Counties
 */
const getCountiesSchemaMatch = () => {
    it("all counties should match schema", (done) => {
        request(app)
        .get("/api/v1/counties")
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            res.body.should.be.jsonSchema(countySchema);
            done();
        });
    });
};

/**
 * Check County exist in list
 */
const findCounty = (county) => {
    it("should contain '" + county.name + "' county ", (done) => {
        request(app)
        .get("/api/v1/counties")
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            const found = res.body.find((c) => c.id === county.id);
            found.should.shallowDeepEqual(county);
            done();
        });
    });
};

// A sample of expected counties
const counties = [
    {id: 1, name: "Allen", code: "AL", seat: "Iola", est_year: 1855 },
    {id: 2, name: "Anderson", code: "AN", seat: "Garnett", est_year: 1855 },
    {id: 3, name: "Atchison", code: "AT", seat: "Atchison", est_year: 1855 },
];

/**
 * Test /api/v1/counties route
 */
describe("/api/v1/counties", () => {
    describe("GET /", () => {
        getAllCounties();
        getCountiesSchemaMatch();
        counties.forEach((c) => {
            findCounty(c);
        });
    });
});