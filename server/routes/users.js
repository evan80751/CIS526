/**
 * @swagger
 * tags:
 *    name: users
 *    descriptions: Users Routes
 */
import express from 'express';
const router = express.Router();

/**
 * /users:
 *   get:
 *     summary: users list page
 *     description: Gets the list of all users in the application
 *     tags: [users]
 *     responses:
 *       200:
 *         description: a resource
 */
router.get('/', function(req, res, next) {
  res.sendStatus('respond with a resource');
});

export default router;