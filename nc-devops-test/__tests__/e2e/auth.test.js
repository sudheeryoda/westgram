const chai      = require('chai')
const chaiHttp  = require('chai-http')
const base64url = require('base64url');

const db                   = require('../../src/models/index')
const UserModel            = db.models.User
const { findOrCreateUser } = require("../../seeders/factory")

const API_BASE_PATH = process.env.API_BASE_PATH

chai.use(chaiHttp);


describe("login", function () {

  let app

  // Clean our test db
  const clearData = async () => {
    await UserModel.destroy({ truncate: { cascade: true } })
  }

  beforeAll(async () => {
    // clear data

    app = await require("../../server")
    await clearData()

  })

  beforeEach(clearData)
  afterEach(clearData)

  it("logs a user with the right email and password", async () => {
    // expect.assertions(5)

    const adminUser = await findOrCreateUser('admin', 'password')

    expect(adminUser.username).toBeDefined()

    // Authenticate 
    const login = await chai.request(app)
      .post(API_BASE_PATH + '/user/auth')
      .set('content-type', 'application/json')
      .send({
        username: 'admin',
        password: 'password'
      })
    expect(login.status).toBe(200)

    // Attempt with wrong password
    const badPassword = await chai.request(app)
      .post(API_BASE_PATH + '/user/auth')
      .set('content-type', 'application/json')
      .send({
        username: 'admin',
        password: 'notthepassword'
      })
    expect(badPassword.status).toBe(400)

    // Attempt with same password, different username
    const samePassword = await chai.request(app)
      .post(API_BASE_PATH + '/user/auth')
      .set('content-type', 'application/json')
      .send({
        username: 'anotheruser',
        password: 'password'
      })
    expect(samePassword.status).toBe(400)

  })

  it("protects the api routes with jwt", async () => {
    const adminUser = await findOrCreateUser('admin', 'password')

    expect(adminUser.username).toBeDefined()
    // Authenticate 
    const login = await chai.request(app)
      .post(API_BASE_PATH + '/user/auth')
      .set('content-type', 'application/json')
      .send({
        username: 'admin',
        password: 'password'
      })
    expect(login.status).toBe(200)

    expect(login.body.jwt).toBeDefined()

    // Attempt with valid token
    const validRequest = await chai.request(app)
      .get(API_BASE_PATH + '/user/test')
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${login.body.jwt}`)
      .send()

    expect(validRequest.status).toBe(200)

    // Attempt with invalid token
    const invalidRequest = await chai.request(app)
      .get(API_BASE_PATH + '/user/test')
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer invalidJWT`)
      .send()

    expect(invalidRequest.status).toBe(500)

    // Attempt with tampered token

    // split up the token
    const tokenParts = login.body.jwt.split('.')

    // decode the payload part, alter it, encode again
    const decodedPayload = JSON.parse(base64url.decode(tokenParts[1]))
    expect(decodedPayload.username).toBe('admin')
    decodedPayload.role = 'superadmin' // assign ourselves a role
    tokenParts[1]       = base64url(JSON.stringify(decodedPayload))

    // re-assembled the token
    const tamperedToken = tokenParts.join('.')

    const tamperedRequest = await chai.request(app)
      .get(API_BASE_PATH + '/user/test')
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${tamperedToken}`)
      .send()

    expect(tamperedRequest.status).toBe(500)

  })

})
