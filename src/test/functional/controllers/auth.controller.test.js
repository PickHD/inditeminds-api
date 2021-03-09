"use strict"

const server = require("../../../server"),
  { connectDB, disconnectDB } = require("../../../config/mongodb.config"),
  User = require("../../../models/User.model"),
  chai = require("chai"),
  chaiHttp = require("chai-http"),
  { assert } = chai,
  { isValidObjectId } = require("mongoose")

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Controllers Test", () => {
  suiteSetup(async () => {
    try {
      await connectDB()
    } catch (e) {
      throw new Error(e)
    }
  })
  suiteTeardown(async () => {
    try {
      await User.deleteMany()
      await disconnectDB()
    } catch (e) {
      throw new Error(e)
    }
  })
  suite("#Register Handler Test", () => {
    test("Should response 400 code when user registering w/ a bad fields", async () => {
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Sugiarto Tumakninah",
          email: "sugiartotum99@gmail.com",
          password: "Sug1Tum_99312312",
          passwordConfirmation: "Sug1Tum_99312312",
          roles: "user"
        })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.propertyVal(res.body, "err_message", "Invalid Fields")
        })
    })
    test("Should response 201 code when user registering w/ a desired fields", async () => {
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Sugiarto Tumakninah",
          email: "sugiartotum99@gmail.com",
          username: "SugTum22",
          password: "Sug1Tum_99312312",
          passwordConfirmation: "Sug1Tum_99312312",
          roles: "user"
        })
        .then((res) => {
          assert.equal(res.status, 201)
          assert.equal(res.type, "application/json")
          assert.isTrue(res.body.success)
          assert.isNull(res.body.error)
          assert.equal(res.body.message, "User Successfully Created")
          assert.isObject(res.body.result)
          assert.isTrue(isValidObjectId(res.body.result._id))
          assert.equal(res.body.result.fullName, "Sugiarto Tumakninah")
          assert.isTrue(res.body.result.isActive, true)
        })
    })
  })
  suite("#Login Handler Test", () => {
    test("Should response 400 code when user login w/ a bad fields", async () => {
      return chai.request(server)
        .post("/api/v1/auth/login")
        .send({
          username: "SugTum22"
        })
        .then((res) => {
          assert.equal(res.status, 400)
          assert.equal(res.type, "application/json")
          assert.propertyVal(res.body, "err_message", "Invalid Fields")
        })
    })
    test("Should response 401 code when user login w/ a invalid username/password", async () => {
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Sugiarto Tumakninah",
          email: "sugiartotum90@gmail.com",
          username: "SugiTum21",
          password: "Sug1Tum_99312312",
          passwordConfirmation: "Sug1Tum_99312312",
          roles: "user"
        })
        .then(async () => {
          return chai.request(server)
            .post("/api/v1/auth/login")
            .send({
              username: "SugiTum21",
              password: "Sug1Tum_99312311"
            })
            .then((res) => {
              assert.equal(res.status, 401)
              assert.equal(res.type, "application/json")
              assert.propertyVal(res.body, "err_message", "Invalid Username or Password")
            })
        })

    })
    test("Should response 200 code when user login w/ a valid username & password", async () => {
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Sugiarto Tumakninah",
          email: "sugiartotum91@gmail.com",
          username: "SugiTum23",
          password: "Sug1Tum_99312312",
          passwordConfirmation: "Sug1Tum_99312312",
          roles: "user"
        })
        .then(async () => {
          return chai.request(server)
            .post("/api/v1/auth/login")
            .send({
              username: "SugiTum23",
              password: "Sug1Tum_99312312"
            })
            .then((res) => {
              assert.equal(res.status, 200)
              assert.equal(res.type, "application/json")
              assert.isTrue(res.body.success)
              assert.isNull(res.body.error)
              assert.equal(res.body.message, "Login Successfully")
              assert.isObject(res.body.result)
              assert.exists(res.body.result.accessToken)
              assert.exists(res.body.result.refreshToken)
            })
        })
    })
  })
  suite("#Create Access Token Handler Test", () => {
    test("Should response 201 code when user requesting a token w/ a valid refresh token", async () => {
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Sugiarto Tumakninah",
          email: "sugiartotum92@gmail.com",
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
              return chai.request(server)
                .post("/api/v1/auth/token")
                .send({
                  refToken: res.body.result.refreshToken.token
                })
                .then((res) => {
                  assert.equal(res.status, 201)
                  assert.equal(res.type, "application/json")
                  assert.isTrue(res.body.success)
                  assert.isNull(res.body.error)
                  assert.equal(res.body.message, "Access Token Re-Created Successfully")
                  assert.isObject(res.body.result)
                  assert.exists(res.body.result.accessToken)
                })
            })
        })
    })
  })
  suite("#Logout Handler Test", () => {
    test("Should response 203 code when user logout w/ a valid access token", async () => {
      return chai.request(server)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Sugiarto Tumakninah",
          email: "sugiartotum101@gmail.com",
          username: "SugiTum30",
          password: "Sug1Tum_99312333",
          passwordConfirmation: "Sug1Tum_99312333",
          roles: "user"
        })
        .then(async () => {
          return chai.request(server)
            .post("/api/v1/auth/login")
            .send({
              username: "SugiTum30",
              password: "Sug1Tum_99312333"
            })
            .then(async (res) => {
              return chai.request(server)
                .get("/api/v1/auth/logout")
                .set("authorization", "Bearer " + res.body.result.accessToken.token)
                .then((res) => {
                  assert.equal(res.status, 203)
                  assert.equal(res.type, "application/json")
                  assert.isTrue(res.body.success)
                  assert.isNull(res.body.error)
                  assert.equal(res.body.message, "Logout Successfully")
                  assert.isNull(res.body.result)
                })
            })
        })
    })
  })
})