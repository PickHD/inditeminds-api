"use strict"
require("dotenv").config()

const getOnePostService = require("../../../../services/post/getOnePost.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  Post = require("../../../../models/Post.model"),
  { Types, isValidObjectId } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Posts Services Test", () => {

  suite("#Get One Post Test", () => {
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

    test("Should return a post object itself if Post successfully founded", async () => {
      const getOnePost = await getOnePostService(getPostTitleSlug, getUserId)

      assert.isObject(getOnePost)
      assert.exists(getOnePost._id)
      assert.exists(getOnePost.title)
      assert.exists(getOnePost.titleSlug)
      assert.propertyVal(getOnePost, "titleSlug", getPostTitleSlug)
      assert.isTrue(isValidObjectId(getOnePost._id))
      assert.isTrue(isValidObjectId(getOnePost.postedBy))
    })

    test("Should return null if User is not found", async () => {
      const getOnePost = await getOnePostService(getPostTitleSlug, getFakeUserId)

      assert.isNotObject(getOnePost, "nope.")
      assert.isNull(getOnePost, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await getOnePostService(true, true))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"true\" at path \"postedBy\" for model \"Post\"")
      }
    })
  })
})