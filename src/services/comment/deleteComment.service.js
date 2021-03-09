"use strict"

const Post = require("../../models/Post.model"),
  Comment = require("../../models/Comment.model")

const deleteCommentService = async (postId, commentId) => {
  try {
    const checkPost = await Post.findOne({ _id: postId }),
      checkComment = await Comment.findOne({ _id: commentId })

    if (checkPost && checkComment) {

      checkPost.comments.filter((c) => c !== commentId)
      await checkPost.save()

      await Comment.findByIdAndDelete({ _id: commentId })

      return "Comment Deleted Successfully"
    } else {
      return null
    }

  } catch (e) {
    throw new Error(e)
  }
}


module.exports = deleteCommentService