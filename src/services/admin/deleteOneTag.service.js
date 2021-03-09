"use strict"

//!Import Models
const Tag = require("../../models/Tag.model")

const deleteOneTagService = async (tagId) => {
  try {
    const tempDelOneTag = await Tag.findOneAndDelete({ _id: tagId })

    return tempDelOneTag === null ? null : "Tag Deleted Successfully"
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = deleteOneTagService