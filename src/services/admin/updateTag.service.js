"use strict"

//!Import Models
const Tag = require("../../models/Tag.model")

const updateTagService = async (tagId, body) => {
  try {
    const tempUpdTag = await Tag.findOneAndUpdate({ _id: tagId }, body)

    return tempUpdTag === null ? null : "Tag Updated Successfully"
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = updateTagService