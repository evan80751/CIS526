/**
 * @file Test helper functions
 * @author Evan Jelle
 */

// Load Libraries
import request from "supertest";
import { expect } from "chai";

// Import Express application
import app from "../app.js";

/**
 * Login a user and return a JWT token
 *
 * @param {string} user - the username to login
 * @returns {Promise<string>} - a JWT token
 */
export const login = async (user) => {
  const agent = request.agent(app);
  await agent
    .get("/auth/bypass?token=" + user)
    .expect(200);
  const res = await agent.get("/auth/token").expect(200);
  return res.body.token;
};

/**
 * All roles in the system
 */
export const all_roles = [
  "manage_users",
  "manage_documents",
  "add_documents",
  "manage_communities",
  "add_communities",
  "view_documents",
  "view_communities",
];

/**
 * Test role-based authorization for a route
 *
 * @param {string} route - the route to test
 * @param {string} method - the HTTP method to use
 * @param {string} role - the role to test
 * @param {boolean} allowed - whether the role should be allowed
 */
export const testRoleBasedAuth = (route, method, role, allowed) => {
  it(
    "should role '" + role + "' access '" + method + " " + route + "': " + allowed,
    async () => {
      const token = await login(role + "_testuser");
      // Give the test user the role
      const agent = request.agent(app);
      const res = await agent[method](route)
        .set("Authorization", "Bearer " + token)
        .send({});
      if (allowed) {
        expect(res.status).to.not.equal(403);
      } else {
        expect(res.status).to.equal(403);
      }
    },
  );
};