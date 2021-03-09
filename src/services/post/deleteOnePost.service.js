"use strict"

const Post = require("../../models/Post.model")

const deleteOnePostService = async (titleSlug, userId) => {
  try {
    const tempDelOnePost = await Post.findOneAndDelete({ $and: [{ titleSlug: titleSlug }, { postedBy: userId }] })

    return tempDelOnePost === null ? null : "Delete Post Successfully"
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = deleteOnePostService