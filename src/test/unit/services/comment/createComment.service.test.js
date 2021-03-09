"use strict"
require("dotenv").config()

const createCommentService = require("../../../../services/comment/createComment.service"),
  User = require("../../../../models/User.model"),
  Post = require("../../../../models/Post.model"),
  Comment = require("../../../../models/Comment.model"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  slugify = require("slugify"),
  { Types, isValidObjectId } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Comment Services Test", () => {
  suite("# Create Comment Test", () => {
    let getUserId = ""
    let getPostId = ""
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

        return
      } catch (e) {
        throw new Error(e)
      }
    })
    suiteTeardown(async () => {
      try {
        await User.findOneAndDelete({ _id: getUserId })
        await Post.findOneAndDelete({ _id: getPostId })
        await Comment.deleteMany()
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }

    })

    test("Should return a comment object itself if given a valid parameters", async () => {
      const commentText = "What a good Article!",
        createComment = await createCommentService(getPostId, getUserId, commentText)

      assert.isObject(createComment)
      assert.exists(createComment._id)
      assert.exists(createComment.comment)
      assert.exists(createComment.commentedBy)
      assert.exists(createComment.postId)
      assert.isTrue(isValidObjectId(createComment._id))
      assert.isTrue(isValidObjectId(createComment.commentedBy))
      assert.isTrue(isValidObjectId(createComment.postId))
      assert.propertyVal(createComment, "comment", commentText)
    })

    test("Should return a null if post not founded", async () => {
      const commentText = "What a good Article!",
        createComment = await createCommentService(getFakePostId, getUserId, commentText)

      assert.isNotObject(createComment)
      assert.isNull(createComment)
    })

    test("Should throw a Error if given a invalid parameters", async () => {
      try {
        assert.Throw(await createCommentService(getFakePostId, getUserId))
      } catch (e) {
        assert.equal(e.message, "expected null to be a function")
      }
    })

  })
})
