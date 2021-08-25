require('dotenv-safe').config({ path: '.env' })

const bodyParser = require('body-parser')
const express    = require('express')

const http = require('http')

const db             = require("./src/models/index")
const passportConfig = require('./src/config/passport-config')
const routes         = require('./src/routes')

const app    = express()
const server = http.Server(app)

app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.json());

const start = async () => {
  try {

    await db.sync({ force: false })

    // initialize passport authentication
    passportConfig(app)

    // create routes
    routes(app)

    // deploy
    if (process.env.NODE_ENV !== 'test') {
      server.listen(app.get('port'), function () {
        console.log(`Server started in ${app.settings.env} mode: http://localhost:${app.get('port')}/`)
      })
    }

    return app

  } catch (err) {
    console.log(err)
    process.exitCode = 1
    if (err) {
      throw err
    }
  }
}

module.exports = start()
