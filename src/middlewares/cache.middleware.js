"use strict"

const apicache = require("apicache"),
  redisCli = require("../config/redisCli.config")

const cacheWRedis = apicache.options({
  redisClient: redisCli,
  headers: {
    "cache-control": "no-cache"
  },
  statusCodes: {
    exclude: [201, 204, 203, 401, 403, 404, 429, 500],
    include: [200]
  }
}).middleware

module.exports = cacheWRedis
