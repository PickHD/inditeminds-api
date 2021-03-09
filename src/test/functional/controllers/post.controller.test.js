"use strict"

const server = require("../../../server"),
  { connectDB, disconnectDB } = require("../../../config/mongodb.config"),
  User = require("../../../models/User.model"),
  Post = require("../../../models/Post.model"),
  Comment = require("../../../models/Comment.model"),
  chai = require("chai"),
  chaiHttp = require("chai-http"),
  { assert } = chai,
  { Types, isValidObjectId } = require("mongoose")

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Controllers Test", () => {
  let getAccToken = ""
  let getPostTitleSlug = ""
  let getPostId = ""
  let getFakePostId = Types.ObjectId()
  let getFakePostTitleSlug = "this-is-fake-post"

  suiteSetup(async () => {
    try {
      await connectDB()

      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Sugiarto Tumakninah",
          email: "sugiartotum99@gmail.com",
          username: "SugiTum24",
          password: "Sug1Tum_99312312",
          passwordConfirmation: "Sug1Tum_99312312",
          roles: "user"
        })
        .then(async () => {
          return chai.request(server)
            .post("/api/v1/auth/login")
            .send({
              username: "SugiTum24",
              password: "Sug1Tum_99312312"
            })
            .then(async (res) => {
              getAccToken = res.body.result.accessToken.token

              return chai.request(server)
                .post("/api/v1/posts")
                .set("authorization", "Bearer " + getAccToken)
                .send({
                  title: "How to kick Ass Dolphin",
                  textContent: "Nothing specials,just kick dat Ass and swim fast",
                  description: "No desc"
                })
                .then((res) => {
                  getPostTitleSlug = res.body.result.titleSlug
                  getPostId = res.body.result._id
                })
            })
        })
    } catch (e) {
      throw new Error(e)
    }
  })

  suiteTeardown(async () => {
    try {
      chai.request(server)
        .get("/api/v1/auth/logout")
        .set("authorization", "Bearer " + getAccToken)
      await User.deleteMany()
      await Post.deleteMany()
      await Comment.deleteMany()
      await disconnectDB()
    } catch (e) {
      throw new Error(e)
    }
  })

  suite("#Create Post Handler Test", () => {

    test("Should response 400 code when creating a post w/ bad fields", async () => {
      return chai.request(server)
        .post("/api/v1/posts")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          title: "How to catch bus"
        })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Invalid fields")

        })
    })
    test("Should response 201 code when creating a post w/ desired fields", async () => {
      return chai.request(server)
        .post("/api/v1/posts")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          title: "How to catch bus",
          textContent: "Just wait at next destination",
          description: "No Desc"
        })
        .then((res) => {
          assert.equal(res.status, 201)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.equal(res.body.message, "Create Post Successfully")
          assert.isObject(res.body.result)
          assert.exists(res.body.result._id)
          assert.propertyVal(res.body.result, "title", "How to catch bus")
          assert.isTrue(isValidObjectId(res.body.result._id))
        })
    })
  })
  suite("#Get Posts Handler Test", () => {

    test("Should response 200 code when retrieving all posts without filtering", async () => {
      return chai.request(server)
        .get("/api/v1/posts")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isArray(res.body.result)
          assert.equal(res.body.result.length, 2)
          assert.isObject(res.body.result[0])
          assert.isTrue(isValidObjectId(res.body.result[0]._id))
        })
    })
    test("Should response 200 when retrieving filtered posts", async () => {
      return chai.request(server)
        .get("/api/v1/posts?year=2020&month=1")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isArray(res.body.result)
        })
    })
    test("Should response 404 code when getting one post not found", async () => {
      return chai.request(server)
        .get(`/api/v1/posts/${getFakePostTitleSlug}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Post Not Found.")
        })
    })
    test("Should response 200 code when getting one post w/ valid founded postTitleSlug", async () => {
      return chai.request(server)
        .get(`/api/v1/posts/${getPostTitleSlug}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isObject(res.body.result)
          assert.exists(res.body.result._id)
          assert.isTrue(isValidObjectId(res.body.result._id))
          assert.propertyVal(res.body.result, "titleSlug", getPostTitleSlug)
        })
    })
  })
  suite("#Update Posts Handler Test", () => {

    test("Should response 400 code when trying to update self post w/ bad fields", async () => {
      return chai.request(server)
        .put(`/api/v1/posts/${getPostTitleSlug}`)
        .set("authorization", "Bearer " + getAccToken)
        .send({ title: 2 })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Invalid Fields")
        })
    })
    test("Should response 404 code when postTitleSlug not found", async () => {
      return chai.request(server)
        .put(`/api/v1/posts/${getFakePostTitleSlug}`)
        .set("authorization", "Bearer " + getAccToken)
        .send({ title: "Yahoo" })
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Post Not Found.")
        })
    })
    test("Should response 203 code when updating self post w/ desired fields & valid founded postTitleSlug", async () => {
      return chai.request(server)
        .put(`/api/v1/posts/${getPostTitleSlug}`)
        .set("authorization", "Bearer " + getAccToken)
        .send({ title: "How to protect your home" })
        .then((res) => {
          assert.equal(res.status, 203)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isString(res.body.message)
          assert.equal(res.body.message, "Update Posts Successfully")
        })
    })
  })
  suite("#Delete Posts Handler Test", () => {

    test("Should response 404 code when postTitleSlug not found", async () => {
      return chai.request(server)
        .delete(`/api/v1/posts/${getFakePostTitleSlug}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Post Not Found.")
        })
    })
    test("Should response 203 code when delete one post w/ desired fields & valid founded postTitleSlug", async () => {
      return chai.request(server)
        .delete(`/api/v1/posts/${getPostTitleSlug}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 203)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isString(res.body.message)
          assert.equal(res.body.message, "Delete Post Successfully")
        })
    })
    test("Should response 203 code when delete all self post", async () => {
      return chai.request(server)
        .delete("/api/v1/posts")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 203)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isString(res.body.message)
          assert.equal(res.body.message, "All Post Deleted Successfully")
        })
    })
  })
  suite("#Create Comments Handler Test", () => {

    test("Should response 400 code when creating a comment on post w/ bad fields", async () => {
      return chai.request(server)
        .post(`/api/v1/posts/${getPostId}/comments`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {

          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Invalid fields")
        })
    })
    test("Should response 404 code when creating a comment on not founded post", async () => {
      return chai.request(server)
        .post(`/api/v1/posts/${getFakePostId}/comments`)
        .set("authorization", "Bearer " + getAccToken)
        .send({ comment: "HAHAHAHA" })
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Post not found")
        })
    })
    test("Should response 201 code when creating a comment on post w/desired fields & valid founded postId", async () => {
      return chai.request(server)
        .post("/api/v1/posts")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          title: "How to kick Ass Dolphin",
          textContent: "Nothing specials,just kick dat Ass and swim fast",
          description: "No desc"
        })
        .then(async (res) => {
          return chai.request(server)
            .post(`/api/v1/posts/${res.body.result._id}/comments`)
            .set("authorization", "Bearer " + getAccToken)
            .send({ comment: "HAHAHAHA" })
            .then((res) => {
              assert.equal(res.status, 201)
              assert.equal(res.type, "application/json")
              assert.isTrue(res.body.success)
              assert.isNull(res.body.error)
              assert.isObject(res.body.result)
              assert.isTrue(isValidObjectId(res.body.result._id))
              assert.propertyVal(res.body.result, "comment", "HAHAHAHA")
            })
        })

    })
  })
  suite("#Delete Comments Handler Test", () => {

    test("Should response 404 code when trying to delete a comment on not founded post", async () => {
      return chai.request(server)
        .post("/api/v1/posts")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          title: "How to kick Ass Dolphin",
          textContent: "Nothing specials,just kick dat Ass and swim fast",
          description: "No desc"
        })
        .then(async (res) => {
          return chai.request(server)
            .post(`/api/v1/posts/${res.body.result._id}/comments`)
            .set("authorization", "Bearer " + getAccToken)
            .send({ comment: "HAHAHAHA" })
            .then(async (res) => {
              return chai.request(server)
                .delete(`/api/v1/posts/${getFakePostId}/comments/${res.body.result._id}`)
                .set("authorization", "Bearer " + getAccToken)
                .then((res) => {
                  assert.equal(res.status, 404)
                  assert.equal(res.type, "application/json")
                  assert.isFalse(res.body.success)
                  assert.propertyVal(res.body, "err_message", "Post/Comment not found")
                })
            })
        })


    })
    test("Should response 203 code when deleting a comment on post w/ valid founded postId,commentId", async () => {
      return chai.request(server)
        .post("/api/v1/posts")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          title: "How to kick Ass Dolphin",
          textContent: "Nothing specials,just kick dat Ass and swim fast",
          description: "No desc"
        })
        .then(async (res) => {
          getPostId = res.body.result._id
          return chai.request(server)
            .post(`/api/v1/posts/${res.body.result._id}/comments`)
            .set("authorization", "Bearer " + getAccToken)
            .send({ comment: "HAHAHAHA" })
            .then(async (res) => {
              return chai.request(server)
                .delete(`/api/v1/posts/${getPostId}/comments/${res.body.result._id}`)
                .set("authorization", "Bearer " + getAccToken)
                .then((res) => {
                  assert.equal(res.status, 203)
                  assert.equal(res.type, "application/json")
                  assert.isTrue(res.body.success)
                  assert.isNull(res.body.error)
                  assert.isString(res.body.message)
                  assert.equal(res.body.message, "Comment Deleted Successfully")
                })
            })
        })


    })
  })
})