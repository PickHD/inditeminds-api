"use strict"

//!Import Models
const Tag = require("../../models/Tag.model")

const getAllTagService = async () => {
  try {
    const tempGetAllTag = await Tag.find({})

    return tempGetAllTag
  } catch (e) {
    throw new Error(e)
  }

}

module.exports = getAllTagService