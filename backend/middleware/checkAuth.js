const checkAuth = (req, res, next) => {
  console.log('desde checkAuth.js')
  next()
}

export default checkAuth