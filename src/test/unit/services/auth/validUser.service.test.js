"use strict"
require("dotenv").config()

const validUserService = require("../../../../services/auth/validUser.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  { assert } = require("chai"),
  { isValidObjectId } = require("mongoose"),
  bCrypt = require("bcrypt")

suite("UNIT TESTS: Auth Services Test", () => {
  suite("#Valid User Test", () => {
    let newUser = {
      fullName: "Sugiarto Tumakninah",
      email: "sugiartotum99@gmail.com",
      username: "SugiTum24",
      password: bCrypt.hashSync("Sug1Tum_993",8)
    }
    let getNewUser = ""

    suiteSetup(async () => {
      try {
        await connectDB()
        return getNewUser = await User.create(newUser)

      } catch (e) {
        throw new Error(e)
      }
    })
    suiteTeardown(async () => {
      try {
        await User.deleteMany({})
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should return user's object itself if given user is valid", async () => {

      const checkValidUser = await validUserService(getNewUser.username, "Sug1Tum_993")

      assert.isObject(checkValidUser, "Ofc, Its Object!")
      assert.exists(checkValidUser._id)
      assert.exists(checkValidUser.fullName)
      assert.exists(checkValidUser.email)
      assert.exists(checkValidUser.username)
      assert.propertyVal(checkValidUser, "username", "SugiTum24")
      assert.isTrue(isValidObjectId(checkValidUser._id))
      assert.isTrue(checkValidUser.isActive)
    })
    test("Should return false and throwing a Error if given user is Invalid", async () => {
      try {
        const fakeUsername = "DENDEH222",
          checkInvalidUser = await validUserService(fakeUsername, "OAWKOAKWOKAWOK")

        assert.isNotObject(checkInvalidUser)
        assert.isFalse(checkInvalidUser)
      } catch (e) {
        assert.equal(e.message, "TypeError: Cannot read property 'password' of null")
      }

    })
  })
})