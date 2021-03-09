"use strict"
require("dotenv").config()

const deleteCommentService = require("../../../../services/comment/deleteComment.service"),
  User = require("../../../../models/User.model"),
  Post = require("../../../../models/Post.model"),
  Comment = require("../../../../models/Comment.model"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  slugify = require("slugify"),
  { Types } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Comment Services Test", () => {
  suite("# Delete Comment Test", () => {
    let getUserId = ""
    let getPostId = ""
    let getCommentId = ""
    let getFakePostId = Types.ObjectId()

    let newUser = {
      fullName: "Jubaedah Permata",
      email: "jubper54@gmail.com",
      username: "JubPer54",
      password: "Th15_1SN04MYP455W0RD"
    }

    suiteSetup(async () => {
      try {
        await connectDB()

        let createNewUser = await User.create(newUser)

        getUserId = createNewUser._id

        let createPost = await Post.create({
          title: "How to kick Tiger Ass",
          titleSlug: slugify("How to kick Tiger Ass", { lower: true }),
          textContent: "Nothing to do, just run lol",
          description: "This is article about How to kick Tiger Ass in the nutshell",
          postedBy: getUserId
        })

        getPostId = createPost._id

        let createComment = await Comment.create({
          comment: "What a Nasty Article!",
          commentedBy: getUserId,
          postId: getPostId
        })

        getCommentId = createComment._id

        return
      } catch (e) {
        throw new Error(e)
      }


    })
    suiteTeardown(async () => {
      try {
        await User.findOneAndDelete({ _id: getUserId })
        await Post.findOneAndDelete({ _id: getPostId })
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }

    })

    test("Should return a string if given a valid parameters", async () => {

      const delComment = await deleteCommentService(getPostId, getCommentId)

      assert.isString(delComment)
      assert.equal(delComment, "Comment Deleted Successfully")
    })

    test("Should return a null if post not founded", async () => {

      const delComment = await deleteCommentService(getFakePostId, getUserId)

      assert.isNotString(delComment)
      assert.isNull(delComment)
    })

    test("Should throw a Error if given a invalid parameters", async () => {
      try {
        assert.Throw(await deleteCommentService(true, 123))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"true\" at path \"_id\" for model \"Post\"")
      }
    })

  })
})
