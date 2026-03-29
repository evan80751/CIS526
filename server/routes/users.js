/**
 * @swagger
 * tags:
 *   name: users
 *   description: Users Routes
 */
import express from "express";
import { User, Role } from '../models/models.js';
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
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", async function (req, res, next) {
  const users = await User.findAll({
    include: {
      model: Role,
      as: "roles",
      attributes: ['id', 'role'],
      through: {
        attributes: [],
      },
    },
  });
  res.json(users);
});

export default router;