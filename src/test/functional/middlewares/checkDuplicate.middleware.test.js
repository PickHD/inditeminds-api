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

  suite("#Check Duplicate Users Field Test", () => {
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
      } catch (e) {
        throw new Error(e)
      }

    })
    suiteTeardown(async () => {
      try {
        await User.deleteMany({ roles: "user" })
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should response 400 code when client registering with existed username", async () => {
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Barney Pangalengan",
          email: "barneyPl@gmail.com",
          username: "SugiTum24",
          password: "Sug1Tum_99312312",
          passwordConfirmation: "Sug1Tum_99312312",
          roles: "user"
        })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.propertyVal(res.body, "err_message", "Username is already used,please use another email")
        })
    })
    test("Should response 400 code when client registering with existed email", async () => {
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Sendi Ciateul",
          email: "sugiartotum99@gmail.com",
          username: "SendCia22",
          password: "Sug1Tum_99312312",
          passwordConfirmation: "Sug1Tum_99312312",
          roles: "user"
        })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.propertyVal(res.body, "err_message", "Email is already used,please use another email")
        })
    })
  })
})