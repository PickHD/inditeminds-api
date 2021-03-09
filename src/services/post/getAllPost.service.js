"use strict"

const Post = require("../../models/Post.model")

const getAllPostService = async () => {
  try {
    const tempGetAllPost = await Post.find({}).populate("comments").exec()
    return tempGetAllPost

  } catch (e) {
    throw new Error(e)
  }

}

module.exports = getAllPostService