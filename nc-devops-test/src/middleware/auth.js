const passport = require('passport')

const db        = require('../models/index')
const UserModel = db.models.User


const isAuthenticated = async (req, res, next) => {

  return passport.authenticate('bearer', { session: false }, async function (err, payload, info) {

    if (err) return next(err)
    if (!payload) {
      return res.sendStatus(401)
    }

    // find user in db
    const dbUser = await UserModel.findByPk(payload.id)

    // // User no longer exists
    if (!dbUser) {
      return res.send(401)
    }

    // add user to request
    req.user = dbUser
    next()

  })(req, res, next);

}

module.exports = {
  isAuthenticated
}