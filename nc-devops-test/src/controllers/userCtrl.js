const User   = require('../domain/user')
const ReqRes = require('../utils/reqRes')


// ---------- Public ----------

// POST /API_BASE_PATH/user/auth { username, password }
function authenticate(req, res) {
  ReqRes.respond(res, User.authenticate(req.body.username, req.body.password))
}

// GET /API_BASE_PATH/user/test
function test(req, res) {
  ReqRes.respond(res, User.test())
}


module.exports = {
  authenticate,
  test
}
