"use strict"
const redis = require("redis"),
  redisCli = redis.createClient({ host: process.env.REDIS_HOST, port: 6379 })

module.exports = redisCli