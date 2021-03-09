"use strict"

//!Import Models

const Tag = require("../../models/Tag.model")

const getOneTagService = async (tagId) => {
  try {
    const tempGetOneTag = await Tag.findOne({ _id: tagId })

    return !tempGetOneTag || tempGetOneTag === "" ? null : tempGetOneTag
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = getOneTagService