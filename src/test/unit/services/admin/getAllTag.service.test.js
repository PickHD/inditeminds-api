"use strict"
require("dotenv").config()

const getAllTagService = require("../../../../services/admin/getAllTag.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  Tag = require("../../../../models/Tag.model"),
  { isValidObjectId } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Get All Tag Test", () => {

    let newTag = {
      tagName: "Tech"
    }
    let newTag1 = {
      tagName: "Horror"
    }

    suiteSetup(async () => {
      try {
        await connectDB()
        await Tag.create([newTag, newTag1])

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

    test("Should return a tag array object", async () => {
      const getAllTag = await getAllTagService()

      assert.isArray(getAllTag)
      assert.equal(getAllTag.length, 2)
      assert.isObject(getAllTag[0])
      assert.isObject(getAllTag[1])
      assert.exists(getAllTag[0]._id)
      assert.exists(getAllTag[1]._id)
      assert.exists(getAllTag[0].tagName)
      assert.exists(getAllTag[1].tagName)
      assert.propertyVal(getAllTag[0], "tagName", "Tech")
      assert.propertyVal(getAllTag[1], "tagName", "Horror")
      assert.isTrue(isValidObjectId(getAllTag[0]._id))
      assert.isTrue(isValidObjectId(getAllTag[1]._id))
    })

  })
})