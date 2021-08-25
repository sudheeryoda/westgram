const User                       = require('./controllers/userCtrl')
const { isAuthenticated }        = require('./middleware/auth')
const { schema, inputValidated } = require('./middleware/validation')

const {
        API_BASE_PATH,
      } = process.env

module.exports = (app) => {

  //public
  app.post(API_BASE_PATH + '/user/auth', inputValidated(schema.userAuth), User.authenticate)

  // e2e test user access
  app.get(API_BASE_PATH + '/user/test', isAuthenticated, User.test)

}
