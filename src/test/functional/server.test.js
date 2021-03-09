"use strict"

const server = require("../../server"),
  chai = require("chai"),
  { assert } = chai,
  chaiHttp = require("chai-http")

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Server Connection Test", () => {
  suite("#Test Server Connections", () => {

    test("Test if server is works", async () => {
      return chai.request(server)
        .get("/api/v1/")
        .then((res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.message, "Root Inditeminds API's")
        })
    })
  })

})