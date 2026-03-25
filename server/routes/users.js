/**
 * @swagger
 * tags:
 *   name: users
 *   description: Users Routes
 */
import express from "express";
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: users list page
 *     description: Gets the list of all users in the application
 *     tags: [users]
 *     responses:
 *       200:
 *         description: a resource
 */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

export default router;
