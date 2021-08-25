const jwt    = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Errors    = require('../utils/errors')
const db        = require('../models/index')
const UserModel = db.models.User


/*
 username, password ->
 Promise(
 { status: Int, jwt: String, user: User }
 || DetailedError
 )
 */
const authenticate = async (username, password) => {

  const user = await UserModel.findOne({ where: { username: username } })

  // if fails, throw detailed error
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw Errors.makeDetailed(
      400,
      Errors.GENERAL_ERROR,
      { general: 'Wrong username or password' }
    )
  }

  // if success, return signed user
  return signedUser(user)
}

// endpoint for e2e test
const test = async () => {
  return { message: 'test success' }
}

// User -> SignedUser { status: Int, jwt: String, user: UserPublic }
const signedUser = async (user) => {

  const payload = {
    id: user.id,
    username: user.username
  }

  return {
    status: 200,
    jwt: jwt.sign(payload, process.env.API_SECRET, { expiresIn: 60 * 60 * 24 }),
    user: payload
  }
}

// ---------- EXPORTS ----------

module.exports = {
  authenticate,
  test
}
