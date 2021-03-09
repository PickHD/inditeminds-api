"use strict"
require("dotenv").config()

const getOneTagService = require("../../../../services/admin/getOneTag.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  Tag = require("../../../../models/Tag.model"),
  { Types, isValidObjectId } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Get One Tag Test", () => {

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
        await Tag.findOneAndDelete({ _id: getTagId })
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should return a tag object itself if Tag successfully founded", async () => {
      const getOneTag = await getOneTagService(getTagId)

      assert.isObject(getOneTag)
      assert.exists(getOneTag._id)
      assert.exists(getOneTag.tagName)
      assert.propertyVal(getOneTag, "tagName", "Tech")
      assert.isTrue(isValidObjectId(getOneTag._id))
    })

    test("Should return null if Tag is not found", async () => {
      const getOneTag = await getOneTagService(getFakeTagId)

      assert.isNotObject(getOneTag, "nope.")
      assert.isNull(getOneTag, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await getOneTagService(1))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"1\" at path \"_id\" for model \"Tag\"")
      }
    })
  })
})