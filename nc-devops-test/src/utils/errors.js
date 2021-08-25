const Sequelize = require('sequelize')


const SQL_ERROR = 'SqlError'
const VALIDATION_ERROR = 'ValidationError'
const GENERAL_ERROR = 'GeneralError'
const FORBIDDEN_ERROR = 'ForbiddenError'
const NOT_FOUND_ERROR = 'NotFoundError'


function mapValidationErrors (errors) {
  const mapped = {}
  errors.forEach(function (error) {
    mapped[error.path] = error.message
  })
  return mapped
}


// Int, String, {prop:Msg} -> Error { status: Int, errors: {prop:Msg}}
// creates a detailed error with extra info (DetailedError)
function makeDetailed (status, name, errors) {
  const err = new Error(name)
  err.detailed = true
  err.name   = name
  err.status = status
  err.errors = errors
  err.message = status + ' ' + name + ' ' + (errors ? JSON.stringify(errors) : '')
  return err
}


// take an error and rethrow it as a DetailedError
function rethrowDetailed (err) {
    
  if (err.detailed) { throw err }

  if (err instanceof Sequelize.ValidationError ||
        err instanceof Sequelize.UniqueConstraintError ||
        err instanceof Sequelize.ExclusionConstraintError) {

    throw makeDetailed(
      400,
      VALIDATION_ERROR,
      mapValidationErrors(err.errors)
    )

  } 

  // if not detailed or sequelize error, but also not a 500:
  if (err.status && err.status < 500) {
    throw makeDetailed( 
      err.status,
      GENERAL_ERROR, 
      { general: err.message }
    )
  } else {
    console.log(err)
    throw makeDetailed( 
      500, 
      GENERAL_ERROR, 
      { general: err.message }
    )
  }
}


module.exports = {
  makeDetailed: makeDetailed,
  rethrowDetailed: rethrowDetailed,
  SqlError: SQL_ERROR,
  ValidationError: VALIDATION_ERROR,
  GeneralError: GENERAL_ERROR,
  ForbiddenError: FORBIDDEN_ERROR,
  NotFoundError: NOT_FOUND_ERROR
}