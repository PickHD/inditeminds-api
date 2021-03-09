"use strict"
require("dotenv").config()

const getAllUserService = require("../../../../services/admin/getAllUser.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  { isValidObjectId } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Get All User Test", () => {

    let newUser = {
      fullName: "Sugiarto Tumakninah",
      email: "sugiartotum99@gmail.com",
      username: "SugiTum24",
      password: "Sug1Tum_993"
    }
    let newUser1 = {
      fullName: "Martini Slamet",
      email: "marslam33@gmail.com",
      username: "MarSlam33",
      password: "M4rS_L4m33"
    }

    suiteSetup(async () => {
      try {
        await connectDB()
        await User.create([newUser, newUser1])

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

    test("Should return a user array object", async () => {
      const getAllUser = await getAllUserService()

      assert.isArray(getAllUser)
      assert.equal(getAllUser.length, 2)
      assert.isObject(getAllUser[0])
      assert.isObject(getAllUser[1])
      assert.exists(getAllUser[0]._id)
      assert.exists(getAllUser[1]._id)
      assert.exists(getAllUser[0].fullName)
      assert.exists(getAllUser[1].fullName)
      assert.propertyVal(getAllUser[0], "fullName", "Sugiarto Tumakninah")
      assert.propertyVal(getAllUser[1], "fullName", "Martini Slamet")
      assert.isTrue(isValidObjectId(getAllUser[0]._id))
      assert.isTrue(isValidObjectId(getAllUser[1]._id))
    })

  })
})