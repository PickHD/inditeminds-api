"use strict"
require("dotenv").config()

const deleteOnePostService = require("../../../../services/post/deleteOnePost.service"),
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
    let getPostTitleSlug = ""

    suiteSetup(async () => {
      try {
        await connectDB()
        const createNewUser = await User.create(newUser)
        getUserId = createNewUser._id

        let newPost = {
          title: "How to catch cheetah in 1 mins",
          titleSlug: "how-to-catch-cheetah-in-1-mins",
          textContent: "Use Human to Baiting cheetah, and voila, you and that human are die.",
          description: "No Desc",
          postedBy: getUserId
        }
        const createNewPost = await Post.create(newPost)

        getPostTitleSlug = createNewPost.titleSlug

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

    test("Should return a success string if founded Post successfully deleted", async () => {

      const delOnePost = await deleteOnePostService(getPostTitleSlug, getUserId)

      assert.isString(delOnePost)
      assert.equal(delOnePost, "Delete Post Successfully")
    })

    test("Should return null if Post is not found", async () => {
      const delOnePost = await deleteOnePostService(getPostTitleSlug, getFakeUserId)

      assert.isNotObject(delOnePost, "nope.")
      assert.isNull(delOnePost, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await deleteOnePostService(true, true))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"true\" at path \"postedBy\" for model \"Post\"")
      }
    })
  })
})