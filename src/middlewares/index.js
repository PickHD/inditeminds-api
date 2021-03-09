const cacheWRedis = require("./cache.middleware"),
  notFound = require("./notFound.middleware"),
  errHandler = require("./errHandler.middleware"),
  adminOnly = require("./adminOnly.middleware"),
  { checkDupEmail, checkDupUsername } = require("./checkDuplicate.middleware"),
  { fetchLimiter, createLimiter } = require("./rateLimit.middleware"),
  { verifyAccJWT, verifyRefJWT } = require("./verifyJWT.middleware"),
  checkWListRefToken = require("./checkWListRefToken.middleware")

module.exports = {
  // eslint-disable-next-line max-len
  cacheWRedis, notFound, errHandler, adminOnly, checkDupEmail, checkDupUsername, fetchLimiter, createLimiter, verifyAccJWT, verifyRefJWT, checkWListRefToken
}
