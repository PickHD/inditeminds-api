"use strict"
require("dotenv").config()

const server = require("../../../server"),
  { connectDB, disconnectDB } = require("../../../config/mongodb.config"),
  User = require("../../../models/User.model"),
  chai = require("chai"),
  chaiHttp = require("chai-http"),
  { assert } = chai

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Middlewares Test", () => {

  suite("#Admin Privileges Required Test", () => {
    let getAccToken = ""

    suiteSetup(async () => {
      try {
        await connectDB()

        return chai.request(server)
          .post("/api/v1/auth/register")
          .send({
            fullName: "Wendy Firmansyah",
            email: "wendfir89@gmail.com",
            username: "WendFir89",
            password: "WendFir89_99312312",
            passwordConfirmation: "WendFir89_99312312",
            roles: "user"
          })
          .then(async () => {
            return chai.request(server)
              .post("/api/v1/auth/login")
              .send({
                username: "WendFir89",
                password: "WendFir89_99312312"
              })
              .then((res) => {
                getAccToken = res.body.result.accessToken.token
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
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }

    })

    test("Should response 403 code when user is trying to access a protected admin route", async () => {
      return chai.request(server)
        .get("/api/v1/admin/manage/users")
        .set("authorization", "Bearer " + getAccToken)
        .then((res) => {
          assert.equal(res.status, 403)
          assert.equal(res.type, "application/json")
          assert.propertyVal(res.body, "err_message", "Forbidden Access")
        })
    })
  })
})