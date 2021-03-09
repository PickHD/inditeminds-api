"use strict"

const server = require("../../../server"),
  { connectDB, disconnectDB } = require("../../../config/mongodb.config"),
  User = require("../../../models/User.model"),
  Tag = require("../../../models/Tag.model"),
  chai = require("chai"),
  chaiHttp = require("chai-http"),
  { assert } = chai,
  { Types, isValidObjectId } = require("mongoose")

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Controllers Test", () => {
  let getAccToken = ""
  let getUserId = ""
  let getFakeUserId = Types.ObjectId()
  let getFakeTagId = Types.ObjectId()

  suiteSetup(async () => {
    try {
      await connectDB()
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Dendi Subagja",
          email: "densub11@gmail.com",
          username: "DenSub11",
          password: "D3n5ub_9930192",
          passwordConfirmation: "D3n5ub_9930192",
          roles: "admin"
        })
        .then(async () => {
          return chai.request(server)
            .post("/api/v1/auth/register")
            .send({
              fullName: "Wardan Sumenep",
              email: "warsum76@gmail.com",
              username: "WarSum76",
              password: "W4rSum76_9012830",
              passwordConfirmation: "W4rSum76_9012830",
              roles: "user"
            })
            .then(async (res) => {
              getUserId = res.body.result._id
              return chai.request(server)
                .post("/api/v1/auth/login")
                .send({
                  username: "DenSub11",
                  password: "D3n5ub_9930192"
                })
                .then((res) => {
                  getAccToken = res.body.result.accessToken.token
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
      await Tag.deleteMany()
      await disconnectDB()
    } catch (e) {
      throw new Error(e)
    }

  })

  suite("#Dashboard Admin Handler Test", () => {
    test("Should response 200 code when admin go to dashboard w/ valid access token", async () => {
      return chai.request(server)
        .get("/api/v1/admin/dashboard")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isNull(res.body.message)
          assert.isObject(res.body.result)
        })
    })
  })
  suite("#Manage Menu Handler Test", () => {
    test("Should response 200 code when admin go to manage menu w/ valid access token", async () => {
      return chai.request(server)
        .get("/api/v1/admin/manage")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isNull(res.body.message)
          assert.isObject(res.body.result)
        })
    })
  })
  suite("#Get Users Handler Test", () => {

    test("Should response 200 code & returning users array of object when retrieving all data user w/ valid access token", async () => {
      return chai.request(server)
        .get("/api/v1/admin/manage/users")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isNull(res.body.message)
          assert.isArray(res.body.result)
          assert.isObject(res.body.result[0])
          assert.exists(res.body.result[0]._id)
          assert.isTrue(isValidObjectId(res.body.result[0]._id))
          assert.exists(res.body.result[0].fullName)
          assert.propertyVal(res.body.result[0], "fullName", "Wardan Sumenep")
        })
    })
    test("Should response 400 code when getting one data user w/ no userId provided", async () => {
      return chai.request(server)
        .get("/api/v1/admin/manage/user")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Id is required")
        })
    })
    test("Should response 404 code when user is not found", async () => {
      return chai.request(server)
        .get(`/api/v1/admin/manage/user/${getFakeUserId}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "User not found")
        })
    })
    test("Should response 200 code & returning specific user object when getting one data user w/ valid access token,provided valid userId", async () => {
      return chai.request(server)
        .get(`/api/v1/admin/manage/user/${getUserId}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isNull(res.body.message)
          assert.isObject(res.body.result)
          assert.isTrue(isValidObjectId(res.body.result._id))
          assert.exists(res.body.result.fullName)
          assert.exists(res.body.result.username)
        })
    })
  })
  suite("#Update Users Handler Test", () => {

    test("Should response 400 code when trying to update user w/ no userId provided", async () => {
      return chai.request(server)
        .put("/api/v1/admin/manage/user")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          username: "SugiTum23"
        })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Invalid Fields")
        })
    })

    test("Should response 404 code when user is not found", async () => {
      return chai.request(server)
        .put(`/api/v1/admin/manage/user/${getFakeUserId}`)
        .set("authorization", "Bearer " + getAccToken)
        .send({
          username: "SugiTum23"
        })
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "User not found")
        })
    })

    test("Should response 203 code when user successfully updated", async () => {
      return chai.request(server)
        .put(`/api/v1/admin/manage/user/${getUserId}`)
        .set("authorization", "Bearer " + getAccToken)
        .send({
          username: "WarSum78"
        })
        .then((res) => {
          assert.equal(res.status, 203)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isNull(res.body.result)
          assert.equal(res.body.message, "User Updated Successfully")
        })
    })
  })
  suite("#Delete Users Handler Test", () => {

    test("Should response 400 code when trying to delete user w/ no userId provided", async () => {
      return chai.request(server)
        .delete("/api/v1/admin/manage/user")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Id is required")
        })
    })

    test("Should response 404 code when user is not found", async () => {
      return chai.request(server)
        .delete(`/api/v1/admin/manage/user/${getFakeUserId}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "User not found")
        })
    })

    test("Should response 203 code when user successfully deleted", async () => {
      return chai.request(server)
        .delete(`/api/v1/admin/manage/user/${getUserId}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 203)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isString(res.body.result)
          assert.equal(res.body.result, "User Deleted Successfully")
        })
    })
  })

  suite("#Create Tags Handler Test", () => {

    test("Should response 400 code when creating a tag w/ bad fields", async () => {
      return chai.request(server)
        .post("/api/v1/admin/manage/tags")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          tagName: 1
        })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Invalid Fields")
        })
    })

    test("Should response 201 code when creating a tag w/ desired fields", async () => {
      return chai.request(server)
        .post("/api/v1/admin/manage/tags")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          tagName: "Tech"
        })
        .then((res) => {
          assert.equal(res.status, 201)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.equal(res.body.message, "Create Tag Successfully")
          assert.isObject(res.body.result)
          assert.exists(res.body.result._id)
          assert.isTrue(isValidObjectId(res.body.result._id))
          assert.propertyVal(res.body.result, "tagName", "Tech")
        })
    })
  })
  suite("#Get Tags Handler Test", () => {
    test("Should response 200 code & returning tags array of object when retrieving all data tag w/ valid access token", async () => {
      return chai.request(server)
        .post("/api/v1/admin/manage/tags")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          tagName: "Tech"
        })
        .then(async () => {
          return chai.request(server)
            .get("/api/v1/admin/manage/tags")
            .set("authorization", "Bearer " + getAccToken)
            .then((res) => {
              assert.equal(res.status, 200)
              assert.equal(res.type, "application/json")
              assert.isTrue(res.body.success)
              assert.isNull(res.body.error)
              assert.isNull(res.body.message)
              assert.isArray(res.body.result)
              assert.isObject(res.body.result[0])
              assert.exists(res.body.result[0]._id)
              assert.isTrue(isValidObjectId(res.body.result[0]._id))
              assert.exists(res.body.result[0].tagName)
              assert.propertyVal(res.body.result[0], "tagName", "Tech")
            })
        })

    })
    test("Should response 400 code when getting one data tag w/ no tagId provided", async () => {
      return chai.request(server)
        .post("/api/v1/admin/manage/tags")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          tagName: "Tech"
        })
        .then(async () => {
          return chai.request(server)
            .get("/api/v1/admin/manage/tag")
            .set("authorization", "Bearer " + getAccToken)
            .then((res) => {
              assert.equal(res.status, 400)
              assert.equal(res.type, "application/json")
              assert.isFalse(res.body.success)
              assert.propertyVal(res.body, "err_message", "Id is required")
            })
        })
    })

    test("Should response 404 code when tag is not found", async () => {
      return chai.request(server)
        .get(`/api/v1/admin/manage/tag/${getFakeTagId}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Tag not found")
        })

    })
    test("Should response 200 code & returning specific tag object when getting one tag user w/ valid access token,provided valid tagId", async () => {
      return chai.request(server)
        .post("/api/v1/admin/manage/tags")
        .send({ tagName: "Horror" })
        .set("authorization", "Bearer " + getAccToken)
        .then(async (res) => {
          return chai.request(server)
            .get(`/api/v1/admin/manage/tag/${res.body.result._id}`)
            .set("authorization", "Bearer " + getAccToken)
            .then((res) => {
              assert.equal(res.status, 200)
              assert.equal(res.type, "application/json")
              assert.isTrue(res.body.success)
              assert.isNull(res.body.error)
              assert.isNull(res.body.message)
              assert.isObject(res.body.result)
              assert.isTrue(isValidObjectId(res.body.result._id))
              assert.exists(res.body.result.tagName)
              assert.propertyVal(res.body.result, "tagName", "Horror")
            })
        })

    })
  })
  suite("#Update Tags Handler Test", () => {

    test("Should response 400 code when trying to update tag w/ no tagId provided", async () => {
      return chai.request(server)
        .put("/api/v1/admin/manage/tag")
        .set("authorization", "Bearer " + getAccToken)
        .send({ tagName: "No Horror" })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Invalid Fields")
        })
    })
    test("Should response 404 code when tag is not found", async () => {
      return chai.request(server)
        .put(`/api/v1/admin/manage/tag/${getFakeTagId}`)
        .set("authorization", "Bearer " + getAccToken)
        .send({ tagName: "No Horror" })
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Tag not found")
        })
    })
    test("Should response 203 code when tag successfully updated", async () => {
      return chai.request(server)
        .post("/api/v1/admin/manage/tags")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          tagName: "Tech"
        })
        .then(async (res) => {
          return chai.request(server)
            .put(`/api/v1/admin/manage/tag/${res.body.result._id}`)
            .set("authorization", "Bearer " + getAccToken)
            .send({
              tagName: "No Tech"
            })
            .then((res) => {
              assert.equal(res.status, 203)
              assert.equal(res.type, "application/json")
              assert.isTrue(res.body.success)
              assert.isNull(res.body.error)
              assert.isNull(res.body.result)
              assert.equal(res.body.message, "Tag Updated Successfully")
            })
        })

    })

  })
  suite("#Delete Tags Handler Test", () => {

    test("Should response 400 code when trying to delete tag w/ no tagId provided", async () => {
      return chai.request(server)
        .delete("/api/v1/admin/manage/tag")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Id is required")
        })
    })
    test("Should response 404 code when tag is not found", async () => {
      return chai.request(server)
        .delete(`/api/v1/admin/manage/tag/${getFakeTagId}`)
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
          assert.isFalse(res.body.success)
          assert.propertyVal(res.body, "err_message", "Tag not found")
        })
    })
    test("Should response 203 code when tag successfully deleted", async () => {
      return chai.request(server)
        .post("/api/v1/admin/manage/tags")
        .set("authorization", "Bearer " + getAccToken)
        .send({
          tagName: "Tech"
        })
        .then(async (res) => {
          return chai.request(server)
            .delete(`/api/v1/admin/manage/tag/${res.body.result._id}`)
            .set("authorization", "Bearer " + getAccToken)
            .then((res) => {
              assert.equal(res.status, 203)
              assert.equal(res.type, "application/json")
              assert.isTrue(res.body.success)
              assert.isNull(res.body.error)
              assert.isString(res.body.result)
              assert.equal(res.body.result, "Tag Deleted Successfully")
            })
        })

    })
  })
})