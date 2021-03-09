"use strict"

const server = require("../../../server"),
  chai = require("chai"),
  { assert } = chai,
  chaiHttp = require("chai-http")

chai.use(chaiHttp)

suite("FUNCTIONAL TESTS : Middlewares Test", () => {
  suite("#Test route not found", () => {
    test("Should return response code 404 when route is not found", async () => {
      return chai.request(server)
        .get("/api/v2/zzz")
        .then((res) => {
          assert.equal(res.status, 404)
          assert.equal(res.type, "application/json")
        })
    })
  })

})