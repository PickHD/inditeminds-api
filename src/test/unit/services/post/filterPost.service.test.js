"use strict"
require("dotenv").config()

const filterPostByDateService = require("../../../../services/post/filterPost.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  User = require("../../../../models/User.model"),
  Post = require("../../../../models/Post.model"),
  { isValidObjectId } = require("mongoose"),
  { assert } = require("chai"),
  slugify = require("slugify")

suite("UNIT TESTS : Posts Services Test", () => {

  suite("#Get Filtered Post Test", () => {
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

        const createNewUser = await User.create(newUser)

        getUserId = createNewUser._id

        await Post.create({
          title: "How to kick a Ass Tiger",
          titleSlug: slugify("How to kick a Ass Tiger", { lower: true }),
          textContent: "Nothing specials,just kick dat Ass and run",
          description: "No desc",
          postedBy: getUserId,
          createdAt: new Date("2020-10-01").toISOString()
        })

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

    test("Should return a filtered post in year 2020 array object", async () => {

      const getFiltered20Post = await filterPostByDateService(2020, 10)

      assert.isArray(getFiltered20Post)
      assert.isObject(getFiltered20Post[0])
      assert.exists(getFiltered20Post[0]._id)
      assert.exists(getFiltered20Post[0].title)
      assert.propertyVal(getFiltered20Post[0], "title", "How to kick a Ass Tiger")
      assert.isTrue(isValidObjectId(getFiltered20Post[0]._id))
      assert.isTrue(isValidObjectId(getFiltered20Post[0]._id))
    })

  })
})