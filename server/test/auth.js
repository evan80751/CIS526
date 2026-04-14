/**
 * @file Auth route tests
 * @author Evan Jelle
 */

// Load Libraries
import request from "supertest";
import { use, should, expect } from "chai";

// Import Express application
import app from "../app.js";

// Import models
import { User } from "../models/models.js";

// Import helpers
import { login } from "./helpers.js";

should();

// Users to test
const users = ["admin", "contributor", "manager", "user"];

// Regular expression for valid session cookie
const regex_valid = (process.env.SESSION_NAME || "connect\\.sid") + "=s%3A[\\w-]+\\.[\\w%+/-]+=*;";

/**
 * Test bypass authentication
 */
const bypassAuth = (user) => {
  it("should allow bypass login with " + user, (done) => {
    const re = new RegExp(regex_valid, "gm");
    request(app)
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

/**
 * Test bypass authentication creates user
 */
const bypassAuthCreatesUser = (user) => {
  it("should allow bypass login with new user " + user, (done) => {
    const re = new RegExp(regex_valid, "gm");
    request(app)
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        User.findOne({
          attributes: ["id", "username"],
          where: { username: user },
        }).then((found_user) => {
          expect(found_user).to.not.equal(null);
          found_user.should.have.property("username");
          expect(found_user.username).to.equal(user);
          done();
        });
      });
  });
};

/**
 * Test user can request a valid token
 */
const userCanRequestToken = (user) => {
  it("should allow user " + user + " to request valid JWT", (done) => {
    const agent = request.agent(app);
    agent
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .end((err) => {
        if (err) return done(err);
        agent
          .get("/auth/token")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.should.be.an("object");
            res.body.should.have.property("token");
            done();
          });
      });
  });
};

/**
 * Test logout destroys cookie
 */
const logoutDestroysCookie = (user) => {
  it("should destroy cookie on logout", (done) => {
    const re = new RegExp(regex_valid, "gm");
    const re_destroy = (process.env.SESSION_NAME || "connect.sid") + "=;";    const agent = request.agent(app);
    agent
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        agent
          .get("/auth/logout")
          .expect(302)
          .expect("set-cookie", new RegExp(re_destroy, "gm"))
          .end((err) => {
            if (err) return done(err);
            done();
          });
      });
  });
};

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  describe("GET /bypass", () => {
    users.forEach((user) => {
      bypassAuth(user);
    });
    bypassAuthCreatesUser("testuser");
  });

  describe("GET /token", () => {
    users.forEach((user) => {
      userCanRequestToken(user);
    });
  });

  describe("GET /logout", () => {
    logoutDestroysCookie("admin");
  });
});