"use strict"

const Post = require("../../models/Post.model"),
  Comment = require("../../models/Comment.model")

const createCommentService = async (postId, userId, commentField) => {
  try {
    const checkPost = await Post.findOne({ _id: postId })
    if (!checkPost) {
      return null
    } else {
      const tempNewComment = await Comment.create({
        comment: commentField,
        commentedBy: userId,
        postId: userId
      })

      //!push new comment to comments array in Post & Save it
      checkPost.comments.push(tempNewComment._id)
      await checkPost.save()

      return tempNewComment
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = createCommentService