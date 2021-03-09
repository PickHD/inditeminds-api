"use strict"
require("dotenv").config()

const genJWTService = require("../../../../services/auth/generateJWT.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  { isValidObjectId } = require("mongoose"),
  jwt = require("jsonwebtoken"),
  { promisify } = require("util"),
  User = require("../../../../models/User.model"),
  { assert } = require("chai")

suite("UNIT TESTS : Auth Services Test", () => {
  suite("#Generate JWT Test", () => {
    let newUser = {
      fullName: "Komariah",
      email: "komariah22@gmail.com",
      username: "KomKom333",
      password: "K0m_K0m9982"
    }
    let getUserId = ""

    suiteSetup(async () => {
      try {
        await connectDB()

        const createNewUser = await User.create(newUser)

        return getUserId = createNewUser._id
      } catch (e) {
        throw new Error(e)
      }
    })
    suiteTeardown(async () => {
      try {
        await User.findOneAndDelete({ _id: getUserId })
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should return a JWT String, if Generate JWT", async () => {
      const jwtVerifyPromise = promisify(jwt.verify).bind(jwt)

      const createNewJWT = await genJWTService(getUserId, process.env.JWT_ACC_TOKEN_SECRET, process.env.JWT_ACC_TOKEN_VALID_UNTIL)

      const ensureJWT = await jwtVerifyPromise(createNewJWT, process.env.JWT_ACC_TOKEN_SECRET)

      assert.isString(createNewJWT, "Its string dude")
      assert.equal(ensureJWT.id, getUserId)
      assert.isTrue(isValidObjectId(ensureJWT.id))

    })
    test("Should Throw a Error if Generating JWT with Invalid Parameters", async () => {
      try {
        const createNewBadJWT = await genJWTService(getUserId, process.env.JWT_ACC_TOKEN_SECRET)

        assert.isNotString(createNewBadJWT, "Not so fast..")
      } catch (e) {
        assert.equal(e.message, "Error: \"expiresIn\" should be a number of seconds or string representing a timespan")
      }
    })
  })
})