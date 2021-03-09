"use strict"

const server = require("../../../server"),
  { connectDB, disconnectDB } = require("../../../config/mongodb.config"),
  User = require("../../../models/User.model"),
  chai = require("chai"),
  chaiHttp = require("chai-http"),
  { assert } = chai

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Middlewares Test", () => {

  suite("#JWT Verify Test", () => {
    let getAccToken = ""

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
        await User.findOneAndDelete({ username: "SugiTum24" })
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should response 400 code if accessToken not provided", async () => {
      return chai.request(server)
        .get("/api/v1/user/profile")
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.propertyVal(res.body, "err_message", "No Access Token Provided")
        })
    })
    test("Should response 500 code if sended accessToken is invalid", async () => {
      return chai.request(server)
        .get("/api/v1/user/profile")
        .set("authorization", "Bearer " + "This is a string")
        .then((res) => {
          assert.equal(res.status, 500)
          assert.equal(res.type, "application/json")
        })
    })
    test("Should response 400 code if refreshToken not provided", async () => {
      return chai.request(server)
        .post("/api/v1/auth/token")
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.propertyVal(res.body, "err_message", "No Refresh Token Provided")
        })
    })
    test("Should response 500 code if sended accessToken is invalid", async () => {
      return chai.request(server)
        .post("/api/v1/auth/token")
        .set("authorization", "Bearer " + "This is a string")
        .send({
          refToken: "Ofc this is a string"
        })
        .then((res) => {
          assert.equal(res.status, 500)
          assert.equal(res.type, "application/json")
        })
    })

  })
})