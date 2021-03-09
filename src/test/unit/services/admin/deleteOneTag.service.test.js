"use strict"
require("dotenv").config()

const deleteOneTagService = require("../../../../services/admin/deleteOneTag.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  Tag = require("../../../../models/Tag.model"),
  { Types } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Delete One Tag Test", () => {

    let newTag = {
      tagName: "Tech"
    }
    let getTagId = ""
    let getFakeTagId = Types.ObjectId()

    suiteSetup(async () => {
      try {
        await connectDB()
        const createNewTag = await Tag.create(newTag)
        return getTagId = createNewTag._id

      } catch (e) {
        throw new Error(e)
      }
    })
    suiteTeardown(async () => {
      try {
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should return a success string if Founded Tag successfully deleted", async () => {
      const delOneTag = await deleteOneTagService(getTagId)

      assert.isString(delOneTag)
      assert.equal(delOneTag, "Tag Deleted Successfully")
    })

    test("Should return null if Tag is not found", async () => {
      const delOneTag = await deleteOneTagService(getFakeTagId)

      assert.isNotObject(delOneTag, "nope.")
      assert.isNull(delOneTag, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await deleteOneTagService(1))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"1\" at path \"_id\" for model \"Tag\"")
      }
    })
  })
})