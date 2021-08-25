const defaults = {
  use_env_variable: 'DB_URL',
  dialect: 'postgres'
}

module.exports = {
  development: {
    ...defaults,
    logging: true
  },
  test: {
    ...defaults
  },
  production: {
    ...defaults
  }
}