/**
 * tags:
 *   name: index
 *   description: Index Routes
 */
import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summar: index page
 *     description: Gets the index page for the application
 *     tage: [index]
 *     responses:
 *       200:
 *         description: success
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export default router;