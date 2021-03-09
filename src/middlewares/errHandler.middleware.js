// eslint-disable-next-line no-unused-vars
const errHandler = (err, req, res, next) => {
  const getStatCode = res.statusCode !== 200 ? res.statusCode : 500
  return res.status(getStatCode).json({
    success: false,
    cache: {
      isCached: false,
      reCacheResult: null
    },
    err_code: getStatCode,
    err_message: err.message || "Internal Server Error",
    err_stack: process.env.NODE_ENV === "production" ? "No Error Stack in Production." : err.stack
  })
}

module.exports = errHandler
