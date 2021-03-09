"use strict"

const Post = require("../../models/Post.model"),
  slugify = require("slugify")

const createPostService = async (userId, titleField, textConField, descField) => {
  try {
    const tempNewPost = await Post.create({
      title: titleField,
      titleSlug: slugify(titleField, { lower: true }),
      textContent: textConField,
      description: descField,
      postedBy: userId
    })

    return tempNewPost
  } catch (e) {
    throw new Error(e)
  }

}

module.exports = createPostService