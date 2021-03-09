"use strict"
require("dotenv").config()

const server = require("../../../server"),
  { connectDB, disconnectDB } = require("../../../config/mongodb.config"),
  User = require("../../../models/User.model"),
  chai = require("chai"),
  jwt = require("jsonwebtoken"),
  chaiHttp = require("chai-http"),
  { assert } = chai

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Middlewares Test", () => {

  suite("#Check White List Refresh Token Test", () => {
    let fakeAccToken = jwt.sign({ id: "aowkaokwoakwokakow" }, process.env.JWT_ACC_TOKEN_SECRET, {
      expiresIn: "3m"
    })
    let getAccToken = ""

    suiteSetup(async () => {
      try {
        await connectDB()

        return chai.request(server)
          .post("/api/v1/auth/register")
          .send({
            fullName: "Dendy Subagja",
            email: "densub123@gmail.com",
            username: "DenSub2",
            password: "DenSub_99312312",
            passwordConfirmation: "DenSub_99312312",
            roles: "user"
          })
          .then(async () => {
            return chai.request(server)
              .post("/api/v1/auth/login")
              .send({
                username: "DenSub2",
                password: "DenSub_99312312"
              })
              .then((res) => {
                getAccToken = res.body.result.accessToken.token

                return getAccToken
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
        await User.findOneAndDelete({ username: "DenSub2" })
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should response 403 code when user is invalid / not login", async () => {
      return chai.request(server)
        .get("/api/v1/posts")
        .set("authorization", "Bearer " + fakeAccToken)
        .then((res) => {
          assert.equal(res.status, 403)
          assert.equal(res.type, "application/json")
        })
    })
  })
})