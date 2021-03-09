"use strict"

const Post = require("../../models/Post.model")

const deleteAllPostService = async (userId) => {
  try {
    const tempDelAllPost = await Post.deleteMany({ postedBy: userId })

    return tempDelAllPost.deletedCount === 0 ? null : "All Post Deleted Successfully"
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = deleteAllPostService