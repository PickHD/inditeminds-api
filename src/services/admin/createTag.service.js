"use strict"

//!Import Models

const Tag = require("../../models/Tag.model")

const createTagService = async (tagField) => {
  try {
    const tempCreateTag = await Tag.create({
      tagName: tagField
    })

    return tempCreateTag
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = createTagService