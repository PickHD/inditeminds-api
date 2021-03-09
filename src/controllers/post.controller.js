"use strict"

//!Import Services
const { validationResult } = require("express-validator"),
  apicache = require("apicache"),
  createPostService = require("../services/post/createPost.service"),
  getAllPostService = require("../services/post/getAllPost.service"),
  filterPostByDateService = require("../services/post/filterPost.service"),
  getOnePostService = require("../services/post/getOnePost.service"),
  updatePostService = require("../services/post/updatePost.service"),
  deleteOnePostService = require("../services/post/deleteOnePost.service"),
  deleteAllPostService = require("../services/post/deleteAllPost.service"),
  createCommentService = require("../services/comment/createComment.service"),
  deleteCommentService = require("../services/comment/deleteComment.service")

exports.createPostHandler = async (req, res, next) => {
  try {
    const { title, textContent, description } = req.body

    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid fields"))
    } else {
      const newPost = await createPostService(req.userId, title, textContent, description)

      return res.status(201).json({
        success: true,
        cache: {
          isCached: false,
          reCacheResult: apicache.clear(`${req.originalUrl}`)
        },
        error: null,
        message: "Create Post Successfully",
        result: newPost
      })
    }

  } catch (e) {
    return next(new Error(e))
  }
}

exports.getPostsHandler = async (req, res, next) => {
  try {

    if (Object.keys(req.query).length === 0) {

      const getAllPosts = await getAllPostService()

      return res.status(200).json({
        success: true,
        cache: {
          isCached: true,
          reCacheResult: null
        },
        error: null,
        message: null,
        result: getAllPosts
      })
    } else {
      const { year, month } = req.query

      const getFilteredPosts = await filterPostByDateService(parseInt(year), parseInt(month))

      return res.status(200).json({
        success: true,
        cache: {
          isCached: true,
          reCacheResult: null
        },
        error: null,
        message: null,
        result: getFilteredPosts
      })

    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.getOnePostHandler = async (req, res, next) => {
  try {
    const { title_slug } = req.params
    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid Params"))
    } else {
      const getOnePost = await getOnePostService(title_slug, req.userId)

      if (getOnePost === null) {
        res.statusCode = 404
        return next(new Error("Post Not Found."))
      } else {
        return res.status(200).json({
          success: true,
          cache: {
            isCached: true,
            reCacheResult: null
          },
          error: null,
          message: null,
          result: getOnePost
        })
      }
    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.updatePostHandler = async (req, res, next) => {
  try {
    const { title_slug } = req.params

    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid Fields"))
    } else {
      const updPost = await updatePostService(title_slug, req.body, req.userId)

      if (updPost === null) {
        res.statusCode = 404
        return next(new Error("Post Not Found."))
      } else {
        return res.status(203).json({
          success: true,
          cache: {
            isCached: false,
            reCacheResult: apicache.clear(`${req.originalUrl}`)
          },
          error: null,
          message: updPost,
          result: null
        })
      }
    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.deleteOnePostHandler = async (req, res, next) => {
  try {
    const { title_slug } = req.params

    const delOnePost = await deleteOnePostService(title_slug, req.userId)

    if (delOnePost === null) {
      res.statusCode = 404
      return next(new Error("Post Not Found."))
    } else {
      return res.status(203).json({
        success: true,
        cache: {
          isCached: false,
          reCacheResult: apicache.clear(`${req.originalUrl}`)
        },
        error: null,
        message: delOnePost,
        result: null
      })
    }

  } catch (e) {
    return next(new Error(e))
  }
}

exports.deleteAllPostHandler = async (req, res, next) => {
  try {
    const delAllPostMsg = await deleteAllPostService(req.userId)

    return res.status(203).json({
      success: true,
      cache: {
        isCached: false,
        reCacheResult: apicache.clear(`${req.originalUrl}`)
      },
      error: null,
      message: delAllPostMsg,
      result: null
    })
  } catch (e) {
    return next(new Error(e))
  }
}

exports.createCommentHandler = async (req, res, next) => {
  try {
    const { post_id } = req.params,
      { comment } = req.body

    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid fields"))
    } else {
      const newComment = await createCommentService(post_id, req.userId, comment)

      if (newComment === null) {
        res.statusCode = 404
        return next(new Error("Post not found"))
      } else {
        return res.status(201).json({
          success: true,
          cache: {
            isCached: false,
            reCacheResult: apicache.clear(`${req.originalUrl}`)
          },
          error: null,
          message: null,
          result: newComment
        })
      }
    }

  } catch (e) {
    return next(new Error(e))
  }
}

exports.deleteCommentHandler = async (req, res, next) => {
  try {
    const { post_id, id } = req.params

    const delComment = await deleteCommentService(post_id, id)

    if (delComment === null) {

      res.statusCode = 404
      return next(new Error("Post/Comment not found"))

    } else {
      return res.status(203).json({
        success: true,
        cache: {
          isCached: false,
          reCacheResult: apicache.clear(`${req.originalUrl}`)
        },
        error: null,
        message: delComment,
        result: null
      })
    }

  } catch (e) {
    return next(new Error(e))
  }
}