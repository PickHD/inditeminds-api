"use strict"

//!Import Services
const { validationResult } = require("express-validator"),
  apicache = require("apicache"),
  getAllUserService = require("../services/admin/getAllUser.service"),
  getOneUserService = require("../services/admin/getOneUser.service"),
  updateUserService = require("../services/admin/updateUser.service"),
  deleteOneUserService = require("../services/admin/deleteOneUser.service"),
  getAllTagService = require("../services/admin/getAllTag.service"),
  createTagService = require("../services/admin/createTag.service"),
  getOneTagService = require("../services/admin/getOneTag.service"),
  updateTagService = require("../services/admin/updateTag.service"),
  deleteOneTagService = require("../services/admin/deleteOneTag.service")

exports.getDashboardHandler = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      cache: {
        isCached: true,
        reCacheResult: null
      },
      error: null,
      message: null,
      result: {
        manageLink: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/admin/manage`,
        postLink: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/posts`,
        logoutLink: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/auth/logout`
      }
    })
  } catch (e) {
    return next(new Error(e))
  }
}

exports.getManageHandler = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      cache: {
        isCached: true,
        reCacheResult: null
      },
      error: null,
      message: null,
      result: {
        manageUsers: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/admin/manage/users`,
        managePosts: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/admin/manage/posts`,
        dashboardLink: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/admin/dashboard`
      }
    })
  } catch (e) {
    return next(new Error(e))
  }
}

/*MANAGE USERS*/
exports.getUsersHandler = async (req, res, next) => {
  try {
    const getAllUser = await getAllUserService()
    return res.status(200).json({
      success: true,
      cache: {
        isCached: true,
        reCacheResult: null
      },
      error: null,
      message: null,
      result: getAllUser
    })
  } catch (e) {
    return next(new Error(e))
  }
}

exports.getOneUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Id is required"))
    } else {
      const getOneUser = await getOneUserService(id)
      if (getOneUser === null) {
        res.statusCode = 404
        return next(new Error("User not found"))
      } else {
        return res.status(200).json({
          success: true,
          cache: {
            isCached: true,
            reCacheResult: null
          },
          error: null,
          message: null,
          result: getOneUser
        })
      }
    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.updateUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid Fields"))
    } else {
      const updUser = await updateUserService(id, req.body)

      if (updUser === null) {
        res.statusCode = 404
        return next(new Error("User not found"))
      } else {
        return res.status(203).json({
          success: true,
          cache: {
            isCached: false,
            reCacheResult: apicache.clear(`${req.originalUrl}`)
          },
          error: null,
          message: updUser,
          result: null
        })
      }
    }

  } catch (e) {
    return next(new Error(e))
  }
}

exports.deleteUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Id is required"))
    } else {
      const delOneUser = await deleteOneUserService(id)
      if (delOneUser === null) {
        res.statusCode = 404
        return next(new Error("User not found"))
      } else {
        return res.status(203).json({
          success: true,
          cache: {
            isCached: false,
            reCacheResult: apicache.clear(`${req.originalUrl}`)
          },
          error: null,
          message: null,
          result: delOneUser
        })
      }
    }
  } catch (e) {
    return next(new Error(e))
  }
}

/*MANAGE TAGS */
exports.createTagHandler = async (req, res, next) => {
  try {
    const { tagName } = req.body

    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid Fields"))
    } else {
      const createTag = await createTagService(tagName)

      return res.status(201).json({
        success: true,
        cache: {
          isCached: false,
          reCacheResult: apicache.clear(`${req.originalUrl}`)
        },
        error: null,
        message: "Create Tag Successfully",
        result: createTag
      })
    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.getOneTagHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Id is required"))
    } else {
      const getOneTag = await getOneTagService(id)

      if (getOneTag === null) {
        res.statusCode = 404
        return next(new Error("Tag not found"))
      } else {
        return res.status(200).json({
          success: true,
          cache: {
            isCached: true,
            reCacheResult: null
          },
          error: null,
          message: null,
          result: getOneTag
        })
      }
    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.updateTagHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid Fields"))
    } else {
      const updTag = await updateTagService(id, req.body)

      if (updTag === null) {
        res.statusCode = 404
        return next(new Error("Tag not found"))
      } else {
        return res.status(203).json({
          success: true,
          cache: {
            isCached: false,
            reCacheResult: apicache.clear(`${req.originalUrl}`)
          },
          error: null,
          message: updTag,
          result: null
        })
      }
    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.getTagsHandler = async (req, res, next) => {
  try {
    const getAllTags = await getAllTagService()
    return res.status(200).json({
      success: true,
      cache: {
        isCached: true,
        reCacheResult: null
      },
      error: null,
      message: null,
      result: getAllTags
    })
  } catch (e) {
    return next(new Error(e))
  }
}

exports.deleteTagHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Id is required"))
    } else {
      const delOneTag = await deleteOneTagService(id)

      if (delOneTag === null) {
        res.statusCode = 404
        return next(new Error("Tag not found"))
      } else {
        return res.status(203).json({
          success: true,
          cache: {
            isCached: false,
            reCacheResult: apicache.clear(`${req.originalUrl}`)
          },
          error: null,
          message: null,
          result: delOneTag
        })
      }
    }
  } catch (e) {
    return next(new Error(e))
  }
}

