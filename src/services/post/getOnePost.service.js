"use strict"

const Post = require("../../models/Post.model")

const getOnePostService = async (titleSlug, userId) => {
  try {
    const tempGetOnePost = await Post.findOne({ $and: [{ titleSlug: titleSlug }, { postedBy: userId }] }).populate("comments").exec()

    return !tempGetOnePost || tempGetOnePost === "" ? null : tempGetOnePost

  } catch (e) {
    throw new Error(e)
  }
}

module.exports = getOnePostService