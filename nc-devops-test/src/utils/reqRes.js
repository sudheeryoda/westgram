function respond (res, domainPromise) {
    
  return domainPromise
    .then(async function ok (obj) {
      // log activity success res.local.activity
      const status = parseInt(obj.status, 10) || 200
      if (res.activity) {
        await res.activity.update({
          status
        })
      }

      res.status(status).json(obj)
            
    })
    .catch(async function fail (err) {
      const status = parseInt(err.status, 10) || 500

      // log activity failure
      if (res.activity) {
        await res.activity.update({
          status,
          error: err ? JSON.stringify(err) : ''
        })
      }
      console.log(err)
      res.status(status).json(err)
    })
}

module.exports = {
  respond: respond
}
