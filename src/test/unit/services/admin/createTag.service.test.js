"use strict"
require("dotenv").config()

const createTagService = require("../../../../services/admin/createTag.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  Tag = require("../../../../models/Tag.model"),
  { isValidObjectId } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Create Tag Test", () => {

    suiteSetup(async () => {
      try {
        await connectDB()
      } catch (e) {
        throw new Error(e)
      }
    })
    suiteTeardown(async () => {
      try {
        await Tag.deleteMany({})
        await disconnectDB()
      } catch (e) {
        throw new Error(e)
      }
    })

    test("Should returning a tag object itself if given parameter is valid", async () => {
      const tagNameText = "Tech",
        createTag = await createTagService(tagNameText)

      assert.isObject(createTag)
      assert.exists(createTag._id)
      assert.exists(createTag.tagName)
      assert.propertyVal(createTag, "tagName", tagNameText)
      assert.isTrue(isValidObjectId(createTag._id))
    })
    test("Should throw a Error if given paramater is invalid or null", async () => {
      try {
        assert.Throw(await createTagService())
      } catch (e) {
        assert.equal(e.message, "ValidationError: tagName: Path `tagName` is required.")
      }
    })
  })

})