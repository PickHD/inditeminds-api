"use strict"
require("dotenv").config()

const updateUserService = require("../../../../services/admin/updateUser.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  { Types } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Update User Test", () => {

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

    test("Should return success string if founded User successfully updated", async () => {
      const newFullNameText = { fullName: "Sugiarto Fertollini" },
        updateUser = await updateUserService(getUserId, newFullNameText)

      assert.isString(updateUser, "ofc its string!")
      assert.equal(updateUser, "User Updated Successfully")
    })

    test("Should return null if User is not found", async () => {
      const newFullNameText = { fullName: "Sugiarto Fertollini" },
        updateUser = await updateUserService(getFakeUserId, newFullNameText)

      assert.isNotString(updateUser, "nope.")
      assert.isNull(updateUser, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await updateUserService(1, true))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"1\" at path \"_id\" for model \"User\"")
      }
    })
  })
})