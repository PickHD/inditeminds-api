"use strict"
require("dotenv").config()

const { connectDB, disconnectDB } = require("../../../config/mongodb.config"),
  chai = require("chai"),
  promiseChai = require("chai-as-promised"),
  { assert } = chai

chai.use(promiseChai)

suite("FUNCTIONAL TESTS : MongoDB Connection Test", () => {
  suite("#Test MongoDB connections", () => {
    suiteTeardown(async () => {
      try {
        process.env.NODE_ENV=""
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })
    test("Connecting to DB in Prod Mode must fullfilled", () => {
      process.env.NODE_ENV = "production"
      assert.isFulfilled(connectDB())
    })
    test("Connecting to DB in Dev Mode must fullfilled", () => {
      process.env.NODE_ENV = ""
      assert.isFulfilled(connectDB())
    })
    test("Connecting to DB in Test Mode must fullfilled", () => {
      process.env.NODE_ENV = "test"
      assert.isFulfilled(connectDB())
    })
  })

})



