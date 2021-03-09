"use strict"
require("dotenv").config()

const deleteAllPostService = require("../../../../services/post/deleteAllPost.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  Post = require("../../../../models/Post.model"),
  { Types } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Posts Services Test", () => {

  suite("#Delete One Post Test", () => {
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
        getUserId = createNewUser._id

        await Post.create({
          title: "How to catch cheetah in 1 mins",
          titleSlug: "how-to-catch-cheetah-in-1-mins",
          textContent: "Use Human to Baiting cheetah, and voila, you and that human are die.",
          description: "No Desc",
          postedBy: getUserId
        })

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

    test("Should return a success string if userId in Post founded and successfully deleted", async () => {

      const delAllPost = await deleteAllPostService(getUserId)

      assert.isString(delAllPost)
      assert.equal(delAllPost, "All Post Deleted Successfully")
    })

    test("Should return null if userId is not found", async () => {
      const delAllPost = await deleteAllPostService(getFakeUserId)

      assert.isNotObject(delAllPost, "nope.")
      assert.isNull(delAllPost, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await deleteAllPostService(true))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"true\" at path \"postedBy\" for model \"Post\"")
      }
    })
  })
})