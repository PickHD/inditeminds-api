"use strict"
require("dotenv").config()

const getAllPostService = require("../../../../services/post/getAllPost.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  Post = require("../../../../models/Post.model"),
  { isValidObjectId } = require("mongoose"),
  { assert } = require("chai"),
  slugify = require("slugify")

suite("UNIT TESTS : Posts Services Test", () => {

  suite("#Get All Post Test", () => {
    let newUser = {
      fullName: "Jubaedah Permata",
      email: "jubper54@gmail.com",
      username: "JubPer54",
      password: "Th15_1SN04MYP455W0RD"
    }
    let getUserId = ""



    suiteSetup(async () => {
      try {
        await connectDB()
        await Post.deleteMany()
        const createNewUser = await User.create(newUser)
        getUserId = createNewUser._id

        let newPost = {
          title: "How to kick a Ass Tiger",
          titleSlug: slugify("How to kick a Ass Tiger", { lower: true }),
          textContent: "Nothing specials,just kick dat Ass and run",
          description: "No desc",
          postedBy: getUserId
        }
        let newPost1 = {
          title: "How to greeting a ghosts",
          titleSlug: slugify("How to greeting a ghosts", { lower: true }),
          textContent: "Nothing specials,just greet her/him and run",
          description: "No desc",
          postedBy: getUserId
        }
        await Post.create([newPost, newPost1])

      } catch (e) {
        throw new Error(e)
      }
    })
    suiteTeardown(async () => {
      try {
        await User.deleteMany({})
        await Post.deleteMany({})
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should return a post array object", async () => {

      const getAllPost = await getAllPostService()

      assert.isArray(getAllPost)
      assert.equal(getAllPost.length, 2)
      assert.isObject(getAllPost[0])
      assert.isObject(getAllPost[1])
      assert.exists(getAllPost[0]._id)
      assert.exists(getAllPost[1]._id)
      assert.exists(getAllPost[0].title)
      assert.exists(getAllPost[1].title)
      assert.propertyVal(getAllPost[0], "title", "How to kick a Ass Tiger")
      assert.propertyVal(getAllPost[1], "title", "How to greeting a ghosts")
      assert.isTrue(isValidObjectId(getAllPost[0]._id))
      assert.isTrue(isValidObjectId(getAllPost[1]._id))
    })

  })
})