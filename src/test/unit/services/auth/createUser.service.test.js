"use strict"
require("dotenv").config()

const createUserService = require("../../../../services/auth/createUser.service"),
  User = require("../../../../models/User.model"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  { assert } = require("chai"),
  { isValidObjectId } = require("mongoose"),
  bCrypt = require("bcrypt")

suite("UNIT TESTS : Auth Services Test", () => {
  suite("#Create Users Test", () => {
    suiteSetup(async () => {
      try {
        await connectDB()
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

    test("Should return a users object itself if Create User w/ Required Fields", async () => {
      const newUser = {
        fullName: "Sugiarto Tumakninah",
        email: "sugiartotum99@gmail.com",
        username: "SugiTum24",
        password: "Sug1Tum_993"
      }
      const createNewUser = await createUserService(newUser.fullName, newUser.email, newUser.username, newUser.password)

      assert.isObject(createNewUser, "Make sure its user object !")
      assert.exists(createNewUser._id)
      assert.exists(createNewUser.fullName)
      assert.exists(createNewUser.email)
      assert.exists(createNewUser.username)
      assert.exists(createNewUser.password)
      assert.isTrue(isValidObjectId(createNewUser._id))
      assert.isTrue(await bCrypt.compare("Sug1Tum_993", createNewUser.password))
      assert.propertyVal(createNewUser, "fullName", "Sugiarto Tumakninah")
      assert.propertyVal(createNewUser, "email", "sugiartotum99@gmail.com")
      assert.propertyVal(createNewUser, "username", "SugiTum24")
      assert.propertyVal(createNewUser, "roles", "user")
      assert.isTrue(createNewUser.isActive)
    })
    test("Should throw a Error if Create User w/ Bad Fields", async () => {
      try {
        const newUserBadData = {
          fullName: "Sugiarto Tumakninah",
          email: "sugiartotm22@gmail.com",
          username: "SugiTum21",
          password: "Sug1Tum_993"
        }

        assert.Throw(await createUserService(newUserBadData.fullName, newUserBadData.email, newUserBadData.username))

      } catch (e) {
        assert.equal(e.message, "Error: data and salt arguments required")
      }
    })
    test("Create User with default roles", async () => {
      const fakeUser = {
        fullName: "Sugiarto Tumakninah",
        email: "sugiartotum99@gmail.com",
        username: "SugiTum23",
        password: await bCrypt.hash("Sug1Tum_993", 8)
      }
      const createFakeUser = await User.create(fakeUser)

      assert.isObject(createFakeUser, "Make sure its user object !")
      assert.propertyVal(createFakeUser, "roles", "user")

    })
    test("Create User with admin roles", async () => {
      const fakeAdmin = {
        fullName: "Sugiarto Tumakninah",
        email: "sugiartotum99@gmail.com",
        username: "Administrator",
        password: await bCrypt.hash("Sug1Tum_993", 8),
        roles: "admin"
      }
      const createFakeAdmin = await User.create(fakeAdmin)

      assert.isObject(createFakeAdmin, "Make sure its user object !")
      assert.propertyVal(createFakeAdmin, "roles", "admin")
    })
  })
})