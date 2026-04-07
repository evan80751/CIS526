/**
 * @file Error handler for Sequelize Validation Errors
 * @author Evan Jelle
 * @exports handleValidationError a handler for Sequelize validation errors
 */

/**
 * Gracefully handle Sequelize Validation Errors
 *
 * @param {SequelizeValidationError} error - Sequelize Validation Error
 * @param {Object} res - Express response object
 */
function handleValidationError(error, res) {
  if (error.errors?.length > 0) {
    const errors = error.errors.map((e) => {
      return { attribute: e.path, message: e.message };
    });
    res.status(422).json({
      error: "Validation Error",
      errors: errors,
    });
  } else {
    res.status(422).json({
      error: error.parent.message,
    });
  }
}

export default handleValidationError;
