/**
 * @file Sends a success message
 * @author Evan Jelle
 */

/**
 * Sends a success message
 *
 * @param {string} message - the success message
 * @param {number} id - the id of the affected resource
 * @param {number} status - the HTTP status code
 * @param {Object} res - Express response object
 */
const sendSuccess = (message, id, status, res) => {
  res.status(status).json({
    message: message,
    id: id,
  });
};

export default sendSuccess;
