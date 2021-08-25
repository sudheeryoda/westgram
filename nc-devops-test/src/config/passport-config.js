const passport       = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt            = require('jsonwebtoken')

const API_SECRET = process.env.API_SECRET

module.exports = function (app) {

  app.use(passport.initialize())

  passport.use(new BearerStrategy(
    function (token, done) {
      try {
        // verify token
        const payload = jwt.verify(token, API_SECRET)

        // todo: set scope based on user role
        done(null, payload, { scope: 'all' })
      } catch (err) {
        console.log('bearer token error: ', err)
        done(err)
      }
    }
  ));

}
