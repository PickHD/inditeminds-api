"use strict"

const Post = require("../../models/Post.model")

const filterPostByDateService = async (year, month) => {
  try {
    const startDate = new Date(`${year}-${month}-1`).toISOString(),
      endDate = new Date(`${year}-${month}-31`).toISOString()

    const tempFilterPosts = await Post.find({ createdAt: { $gte: startDate, $lt: endDate } })

    return tempFilterPosts
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = filterPostByDateService