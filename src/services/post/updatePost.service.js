"use strict"

const Post = require("../../models/Post.model")

const updatePostService = async (titleSlug, body, userId) => {
  try {

    const tempUpdPost = await Post.findOneAndUpdate({ $and: [{ titleSlug: titleSlug }, { postedBy: userId }] }, body)

    return tempUpdPost === null ? null : "Update Posts Successfully"
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = updatePostService