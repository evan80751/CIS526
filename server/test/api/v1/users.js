/**
 * @file /api/v1/users Route Tests
 * @author Evan Jelle
 */

// Load Libraries
import request from "supertest";
import { use, should, expect } from "chai";
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

// User schema for validation
const userSchema = {
  type: "object",
  required: ["id", "username"],
  properties: {
    id: { type: "number" },
    username: { type: "string" },
    createdAt: { type: "string", format: "iso-date-time" },
    updatedAt: { type: "string", format: "iso-date-time" },
    roles: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "role"],
        properties: {
          id: { type: "number" },
          role: { type: "string" },
          createdAt: { type: "string", format: "iso-date-time" },
          updatedAt: { type: "string", format: "iso-date-time" },
          UserRole: { type: "object" },
        },
      },
    },
  },
  additionalProperties: false,
};

/**
 * Get all users
 */
const getAllUsers = () => {
  it("should list all users", (done) => {
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        res.body.should.have.lengthOf(4);
        done();
      });
  });
};

/**
 * Check JSON Schema of Users
 */
const getUsersSchemaMatch = () => {
  it("all users should match schema", (done) => {
    const schema = {
      type: "array",
      items: userSchema,
    };
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(schema);
        done();
      });
  });
};

/**
 * Check User exists in list
 */
const findUser = (user) => {
  it("should contain '" + user.username + "' user", (done) => {
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const foundUser = res.body.find((u) => u.id === user.id);
        foundUser.should.shallowDeepEqual(user);
        done();
      });
  });
};

/**
 * Check that User has correct number of roles
 */
const findUserCountRoles = (username, count) => {
  it("user '" + username + "' should have " + count + " roles", (done) => {
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const foundUser = res.body.find((u) => u.username === username);
        foundUser.roles.should.be.an("array");
        foundUser.roles.should.have.lengthOf(count);
        done();
      });
  });
};

/**
 * Get single user
 */
const getSingleUser = (user) => {
  it("should get user '" + user.username + "'", (done) => {
    request(app)
      .get("/api/v1/users/" + user.id)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.shallowDeepEqual(user);
        done();
      });
  });
};

/**
 * Get single user check schema
 */
const getSingleUserSchemaMatch = (user) => {
  it("user '" + user.username + "' should match schema", (done) => {
    request(app)
      .get("/api/v1/users/" + user.id)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(userSchema);
        done();
      });
  });
};

/**
 * Tries to get a user using an invalid id
 */
const getSingleUserBadId = (invalidId) => {
  it(
    "should return 404 when requesting user with id '" + invalidId + "'",
    (done) => {
      request(app)
        .get("/api/v1/users/" + invalidId)
        .expect(404)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    },
  );
};

// New user structure for create/update tests
const new_user = {
  username: "test_user",
  roles: [
    {
      id: 1,
    },
  ],
};

// New user structure without roles
const new_user_no_roles = {
  username: "test_user",
};

/**
 * Create a user successfully
 */
const createUser = () => {
  it("should successfully create a new user", (done) => {
    request(app)
      .post("/api/v1/users")
      .send(new_user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        done();
      });
  });
};

/**
 * Fails to create user with a duplicate username
 */
const createUserFailsOnDuplicateUsername = (user) => {
  it("should fail on duplicate username '" + user.username + "'", (done) => {
    request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("error");
        res.body.should.have.property("errors");
        res.body.errors.should.be.an("array");
        expect(
          res.body.errors.some((e) => e.attribute === "username"),
        ).to.equal(true);
        done();
      });
  });
};

/**
 * Fails to create user with bad role ID
 */
const createUserFailsOnInvalidRole = (user, role_id) => {
  it("should fail when invalid role id '" + role_id + "' is used", (done) => {
    const new_user_bad_role = { ...user };
    new_user_bad_role.roles = [{ id: role_id }];
    request(app)
      .post("/api/v1/users")
      .send(new_user_bad_role)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("error");
        done();
      });
  });
};

/**
 * Update a user successfully
 */
const updateUser = (id, user) => {
  it(
    "should successfully update user ID '" +
      id +
      "' to '" +
      user.username +
      "'",
    (done) => {
      request(app)
        .put("/api/v1/users/" + id)
        .send(user)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.be.an("object");
          res.body.should.have.property("message");
          res.body.should.have.property("id");
          expect(res.body.id).equal(id);
          request(app)
            .get("/api/v1/users")
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              const foundUser = res.body.find((u) => u.id === id);
              foundUser.should.shallowDeepEqual(user);
              done();
            });
        });
    },
  );
};

/**
 * Update a user and roles successfully
 */
const updateUserAndRoles = (id, user) => {
  it("should successfully update user ID '" + id + "' roles", (done) => {
    request(app)
      .put("/api/v1/users/" + id)
      .send(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("message");
        res.body.should.have.property("id");
        expect(res.body.id).equal(id);
        done();
      });
  });
};

/**
 * Fails to update user with a duplicate username
 */
const updateUserFailsOnDuplicateUsername = (id, user) => {
  it("should fail on duplicate username '" + user.username + "'", (done) => {
    request(app)
      .put("/api/v1/users/" + id)
      .send(user)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("error");
        res.body.should.have.property("errors");
        res.body.errors.should.be.an("array");
        expect(
          res.body.errors.some((e) => e.attribute === "username"),
        ).to.equal(true);
        done();
      });
  });
};

/**
 * Fails to update user with bad role ID
 */
const updateUserFailsOnInvalidRole = (id, user, role_id) => {
  it("should fail when invalid role id '" + role_id + "' is used", (done) => {
    const updated_user = { ...user };
    updated_user.roles = [...user.roles];
    updated_user.roles.push({ id: role_id });
    request(app)
      .put("/api/v1/users/" + id)
      .send(updated_user)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("error");
        request(app)
          .get("/api/v1/users")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(
              res.body.some((u) => u.username === updated_user.username),
            ).to.equal(false);
            done();
          });
      });
  });
};

/**
 * Delete a user successfully
 */
const deleteUser = (id) => {
  it("should successfully delete user ID '" + id, (done) => {
    request(app)
      .delete("/api/v1/users/" + id)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Fail to delete a missing user
 */
const deleteUserFailsInvalidId = (id) => {
  it("should fail to delete invalid user ID '" + id, (done) => {
    request(app)
      .delete("/api/v1/users/" + id)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

// List of all expected users in the application
const users = [
  { id: 1, username: "admin" },
  { id: 2, username: "contributor" },
  { id: 3, username: "manager" },
  { id: 4, username: "user" },
];

// Update user structure with only roles
const update_user_only_roles = {
  roles: [{ id: 6 }, { id: 7 }],
};

// Update user structure with duplicate username
const update_user_duplicate_username = {
  username: "admin",
};

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  describe("GET /", () => {
    getAllUsers();
    getUsersSchemaMatch();

    users.forEach((u) => {
      findUser(u);
    });

    findUserCountRoles("admin", 3);
    findUserCountRoles("contributor", 2);
    findUserCountRoles("manager", 2);
    findUserCountRoles("user", 2);
  });

  describe("GET /{id}", () => {
    users.forEach((u) => {
      getSingleUser(u);
      getSingleUserSchemaMatch(u);
    });

    getSingleUserBadId(0);
    getSingleUserBadId("test");
    getSingleUserBadId(-1);
    getSingleUserBadId(5);
  });

  describe("POST /", () => {
    createUser();
    createUserFailsOnDuplicateUsername({ username: "admin" });
    createUserFailsOnInvalidRole(new_user, 0);
    createUserFailsOnInvalidRole(new_user, -1);
    createUserFailsOnInvalidRole(new_user, 8);
    createUserFailsOnInvalidRole(new_user, "test");
  });

  describe("PUT /{id}", () => {
    updateUser(3, new_user);
    updateUserAndRoles(3, new_user);
    updateUserAndRoles(2, new_user_no_roles);
    updateUserAndRoles(1, update_user_only_roles);
    updateUserFailsOnDuplicateUsername(2, update_user_duplicate_username);
    updateUserFailsOnInvalidRole(4, new_user, 0);
    updateUserFailsOnInvalidRole(4, new_user, -1);
    updateUserFailsOnInvalidRole(4, new_user, 8);
    updateUserFailsOnInvalidRole(4, new_user, "test");
  });

  describe("DELETE /{id}", () => {
    deleteUser(4);
    deleteUserFailsInvalidId(0);
    deleteUserFailsInvalidId(-1);
    deleteUserFailsInvalidId(5);
    deleteUserFailsInvalidId("test");
  });
});
