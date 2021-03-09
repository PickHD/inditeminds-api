"use strict"
require("dotenv").config()

const updatePostService = require("../../../../services/post/updatePost.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  Post = require("../../../../models/Post.model"),
  { Types } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Posts Services Test", () => {

  suite("#Update Post Test", () => {
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
        await Post.deleteMany()
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should return a success string if founded Post successfully updated", async () => {
      const updDescText = "Still no Desc",
        updatePost = await updatePostService(getPostTitleSlug, updDescText, getUserId)

      assert.isString(updatePost)
      assert.equal(updatePost, "Update Posts Successfully")
    })

    test("Should return null if Post is not found", async () => {
      const updDescText = "Still no Desc",
        updatePost = await updatePostService(getPostTitleSlug, updDescText, getFakeUserId)

      assert.isNotObject(updatePost, "nope.")
      assert.isNull(updatePost, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await updatePostService(true, true, false))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"false\" at path \"postedBy\" for model \"Post\"")
      }
    })
  })
})