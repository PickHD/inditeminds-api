"use strict"

const server = require("../../../server"),
  { connectDB, disconnectDB } = require("../../../config/mongodb.config"),
  User = require("../../../models/User.model"),
  chai = require("chai"),
  chaiHttp = require("chai-http"),
  { assert } = chai

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Controllers Test", () => {

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
      await User.deleteMany()
      await disconnectDB()
    } catch (e) {
      throw new Error(e)
    }
  })

  suite("#Dashboard User Handler Test", () => {
    test("Should response 200 code when retrieving dashboard user", async () => {
      return chai.request(server)
        .get("/api/v1/user/dashboard")
        .set("authorization", "Bearer " + getAccToken)
        .then(async (res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isObject(res.body)
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isObject(res.body.result)
        })
    })
  })
  suite("#Profile User Handler Test", () => {
    test("Should response 200 code when retrieving profile user", async () => {
      return chai.request(server)
        .get("/api/v1/user/profile")
        .set("authorization", "Bearer " + getAccToken)
        .then(async (res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isObject(res.body)
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.isObject(res.body.result)
        })
    })
  })
})