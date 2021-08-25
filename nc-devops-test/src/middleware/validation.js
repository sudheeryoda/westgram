const { body, validationResult } = require('express-validator');
const ReqRes                     = require('../utils/reqRes')


const inputValidated = (schemas) => {
  return async (req, res, next) => {
    // run provided schemas in sync
    await Promise.all(schemas.map((schema) => schema.run(req)));
    const errors = validationResult(req);

    // if validation errors, throw
    if (!errors.isEmpty()) {
      return ReqRes.respond(res,
        Promise.reject(
          errors.array()
        )
      )
    }

    return next();
  }
}

// describe schemas
const schema = {
  userAuth: [
    body('username', 'username must have at least 4 characters').isLength({ min: 4 })
  ]
}

module.exports = {
  inputValidated,
  schema
}
