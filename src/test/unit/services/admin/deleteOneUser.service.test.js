"use strict"
require("dotenv").config()

const deleteOneUserService = require("../../../../services/admin/deleteOneUser.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  { Types } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Delete One User Test", () => {

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
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should return a success string if Founded User successfully deleted", async () => {
      const delOneUser = await deleteOneUserService(getUserId)

      assert.isString(delOneUser)
      assert.equal(delOneUser, "User Deleted Successfully")
    })

    test("Should return null if User is not found", async () => {
      const delOneUser = await deleteOneUserService(getFakeUserId)

      assert.isNotObject(delOneUser, "nope.")
      assert.isNull(delOneUser, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await deleteOneUserService(1))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"1\" at path \"_id\" for model \"User\"")
      }
    })
  })
})