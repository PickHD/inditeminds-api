"use strict"
require("dotenv").config()

const getProfileService = require("../../../../services/user/getProfile.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  { Types } = require("mongoose"),
  User = require("../../../../models/User.model"),
  { assert } = require("chai")

suite("UNIT TESTS : User Services Test", () => {
  suite("#Get Profile User Test", () => {
    let newUser = {
      fullName: "Jubaedah Permata",
      email: "jubper54@gmail.com",
      username: "JubPer54",
      password: "Th15_1SN04MYP455W0RD"
    }
    let getUserId = ""
    let getFakeUserId = Types.ObjectId()


    suiteSetup(async () => {
      try {
        await connectDB()

        let createNewUser = await User.create(newUser)

        getUserId = createNewUser._id
        return getUserId
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

    test("Should return user object itself if id given is valid", async () => {
      const getProfileUser = await getProfileService(getUserId)

      assert.isObject(getProfileUser)
      assert.exists(getProfileUser.fullName)
      assert.exists(getProfileUser.email)
      assert.exists(getProfileUser.username)
      assert.propertyVal(getProfileUser, "fullName", "Jubaedah Permata")
      assert.propertyVal(getProfileUser, "email", "jubper54@gmail.com")
      assert.propertyVal(getProfileUser, "username", "JubPer54")

    })
    test("Should throw a error if id given is invalid", async () => {
      try {
        assert.Throw(await getProfileService(getFakeUserId))
      } catch (e) {
        assert.equal(e.message, "expected null to be a function")
      }
    })
  })
})