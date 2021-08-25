const db        = require('../src/models/index')
const UserModel = db.models.User


//find or create user
const findOrCreateUser = async (username, password) => {
  const [user, created] = await UserModel.findOrCreate({
    where: {
      username: username || 'admin'
    },
    defaults: {
      password: password || 'password'
    }
  })

  if (created) {
    console.log('created user: ', user.username)
  } else {
    console.log('user already exists: ', user.username)
  }

  return user
}


module.exports = {
  findOrCreateUser,
}
