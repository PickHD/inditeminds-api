"use strict"

//!Import Services
const getProfileService = require("../services/user/getProfile.service")

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
        profileLink: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/user/profile`,
        postLink: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/posts`,
        logoutLink: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}/api/v1/auth/logout`
      }
    })
  } catch (e) {
    return next(new Error(e))
  }
}

exports.getProfileHandler = async (req, res, next) => {
  try {
    const getProfile = await getProfileService(req.userId)
    return res.status(200).json({
      success: true,
      cache: {
        isCached: true,
        reCacheResult: null
      },
      error: null,
      message: null,
      result: getProfile
    })
  } catch (e) {
    return next(new Error(e))
  }
}