"use strict"

require("mongoose-type-email")
const { Schema, Types, model } = require("mongoose")

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  titleSlug: {
    type: String,
    required: true
  },
  textContent: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  postedBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  tags: [{
    type: Types.ObjectId,
    ref: "Tag",
    default: null
  }],
  comments: [{
    type: Types.ObjectId,
    ref: "Comment",
    default: null
  }]

}, { timestamps: true })


const Post = model("Post", PostSchema)

module.exports = Post
