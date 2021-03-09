"use strict"
require("dotenv").config()

const updateTagService = require("../../../../services/admin/updateTag.service"),
  { connectDB, disconnectDB } = require("../../../../config/mongodb.config"),
  Tag = require("../../../../models/Tag.model"),
  { Types } = require("mongoose"),
  { assert } = require("chai")

suite("UNIT TESTS : Admin Services Test", () => {

  suite("#Update Tag Test", () => {

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

    test("Should return success string if founded Tag successfully updated", async () => {
      const newTagText = { tagName: "Horror" },
        updateTag = await updateTagService(getTagId, newTagText)

      assert.isString(updateTag, "ofc its string!")
      assert.equal(updateTag, "Tag Updated Successfully")
    })

    test("Should return null if Tag is not found", async () => {
      const newTagText = { tagName: "Horror" },
        updateTag = await updateTagService(getFakeTagId, newTagText)

      assert.isNotString(updateTag, "nope.")
      assert.isNull(updateTag, "its null!")
    })

    test("Should throw a Error if parameter is invalid", async () => {
      try {
        assert.Throw(await updateTagService(1, true))
      } catch (e) {
        assert.equal(e.message, "CastError: Cast to ObjectId failed for value \"1\" at path \"_id\" for model \"Tag\"")
      }
    })
  })
})