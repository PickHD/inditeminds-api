"use strict"

const redisCli = require("../../../config/redisCli.config"),
  chai = require("chai"),
  promiseChai = require("chai-as-promised"),
  { assert } = chai,
  { promisify } = require("util")

chai.use(promiseChai)

suite("FUNCTIONAL TESTS : Redis Connection Test", () => {
  suite("#Test Redis-Cli Connections", () => {
    const redisCliPingPromise = promisify(redisCli.ping).bind(redisCli)

    test("Ping The Redis-Server should returning a PONG", async () => {
      const checkConn = await redisCliPingPromise()

      assert.equal(checkConn, "PONG")
    })

  })
})


