"use strict"
require("dotenv").config()

const createPostService = require("../../../../services/post/createPost.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  Post = require("../../../../models/Tag.model"),
  { isValidObjectId } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Posts Services Test", () => {

  suite("#Create Post Test", () => {

    let newUser = {
      fullName: "Sugiarto Tumakninah",
      email: "sugiartotum99@gmail.com",
      username: "SugiTum24",
      password: "Sug1Tum_993"
    }
    let getUserId = ""

    suiteSetup(async () => {
      try {
        await connectDB()
        const createNewUser = await User.create(newUser)
        getUserId = createNewUser._id

      } catch (e) {
        throw new Error(e)
      }
    })
    suiteTeardown(async () => {
      try {
        await Post.findOneAndDelete({ postedBy: getUserId })
        await User.findOneAndDelete({ _id: getUserId })

        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should returning a post object itself if given parameter is valid", async () => {

      const createNewPost = await createPostService(getUserId, "How to kick Ass Dolphin", "Nothing specials,just kick dat Ass and swim fast", "No desc")

      assert.isObject(createNewPost)
      assert.exists(createNewPost._id)
      assert.exists(createNewPost.title)
      assert.exists(createNewPost.postedBy)
      assert.propertyVal(createNewPost, "description", "No desc")
      assert.isTrue(isValidObjectId(createNewPost._id))
      assert.isTrue(isValidObjectId(createNewPost.postedBy))
      assert.equal(createNewPost.postedBy, getUserId)
    })
    test("Should throw a Error if given paramater is invalid or null", async () => {
      try {
        assert.Throw(await createPostService())
      } catch (e) {
        assert.equal(e.message, "Error: slugify: string argument expected")
      }
    })
  })

})