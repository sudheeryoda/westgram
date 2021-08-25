const bcrypt = require('bcrypt');


const hash = (string) => {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(
      string,
      10,
      function (err, hashedString) {
        if (err) {
          reject(err);
        } else {
          resolve(hashedString);
        }
      }
    );
  })
}

module.exports = {
  hash: hash
}
