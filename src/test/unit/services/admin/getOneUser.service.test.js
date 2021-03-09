"use strict"
require("dotenv").config()

const getOneUserService = require("../../../../services/admin/getOneUser.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  { Types, isValidObjectId } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Get One User Test", () => {

    let newUser = {
      fullName: "Sugiarto Tumakninah",
      email: "sugiartotum99@gmail.com",
      username: "SugiTum24",
      password: "Sug1Tum_993"
    }
    let getUserId = ""
    let getFakeUserId = Types.ObjectId()

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

    test("Should return a user object itself if User successfully founded", async () => {
      const getOneUser = await getOneUserService(getUserId)

      assert.isObject(getOneUser)
      assert.exists(getOneUser._id)
      assert.exists(getOneUser.fullName)
      assert.propertyVal(getOneUser, "fullName", "Sugiarto Tumakninah")
      assert.isTrue(isValidObjectId(getOneUser._id))
    })

    test("Should return null if User is not found", async () => {
      const getOneUser = await getOneUserService(getFakeUserId)

      assert.isNotObject(getOneUser, "nope.")
      assert.isNull(getOneUser, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await getOneUserService(1))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"1\" at path \"_id\" for model \"User\"")
      }
    })
  })
})