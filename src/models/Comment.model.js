"use strict"

require("mongoose-type-email")
const { Schema, Types, model } = require("mongoose")

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true
  },
  commentedBy: {
    type: Types.ObjectId,
    ref: "User",
    required:true
  },
  postId: {
    type: Types.ObjectId,
    ref: "Post",
    required:true
  }
}, { timestamps: true })

const Comment = model("Comment", CommentSchema)

module.exports = Comment
