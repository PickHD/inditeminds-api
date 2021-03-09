"use strict"

const { validationResult } = require("express-validator"),
  apicache = require("apicache"),
  { promisify } = require("util"),
  redCli = require("../config/redisCli.config")

//!Import Services

const createUserService = require("../services/auth/createUser.service"),
  genJWTService = require("../services/auth/generateJWT.service"),
  validUserService = require("../services/auth/validUser.service")

exports.registerHandler = async (req, res, next) => {
  try {
    const { fullName, email, username, password, roles } = req.body
    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid Fields"))

    } else {

      const genUser = await createUserService(fullName, email, username, password, roles)

      return res.status(201).json({
        success: true,
        cache: {
          isCached: false,
          reCacheResult: apicache.clear(`${req.originalUrl}`)
        },
        error: null,
        message: "User Successfully Created",
        result: genUser
      })
    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.loginHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!validationResult(req).isEmpty()) {
      res.statusCode = 400
      return next(new Error("Invalid Fields"))
    } else {

      const validUser = await validUserService(username, password)

      if (!validUser) {
        res.statusCode = 401
        return next(new Error("Invalid Username or Password"))
      }
      else {

        const jwtAccToken = await genJWTService(validUser._id, process.env.JWT_ACC_TOKEN_SECRET, process.env.JWT_ACC_TOKEN_VALID_UNTIL)

        const jwtRefreshToken = await genJWTService(validUser._id, process.env.JWT_REF_TOKEN_SECRET, process.env.JWT_REF_TOKEN_VALID_UNTIL)

        const redCliSetexPromise = promisify(redCli.setex).bind(redCli)
        await redCliSetexPromise(`wListRefTokenId:${validUser._id}`, 86400, JSON.stringify({ refToken: jwtRefreshToken }))

        return res.status(200).json({
          success: true,
          cache: {
            isCached: true,
            reCacheResult: null
          },
          error: null,
          message: "Login Successfully",
          result: {
            accessToken: {
              token: jwtAccToken,
              validUntil: process.env.JWT_ACC_TOKEN_VALID_UNTIL
            },
            refreshToken: {
              token: jwtRefreshToken,
              validUntil: process.env.JWT_REF_TOKEN_VALID_UNTIL
            }
          }
        })
      }
    }
  } catch (e) {
    return next(new Error(e))
  }
}

exports.createTokenHandler = async (req, res, next) => {
  try {
    const newAccToken = await genJWTService(req.userId, process.env.JWT_ACC_TOKEN_SECRET, process.env.JWT_ACC_TOKEN_VALID_UNTIL)

    return res.status(201).json({
      success: true,
      cache: {
        isCached: false,
        reCacheResult: apicache.clear(`${req.originalUrl}`)
      },
      error: null,
      message: "Access Token Re-Created Successfully",
      result: {
        accessToken: {
          token: newAccToken,
          validUntil: process.env.JWT_ACC_TOKEN_VALID_UNTIL
        }
      }
    })

  } catch (e) {
    return next(new Error(e))
  }
}

exports.logoutHandler = async (req, res, next) => {
  try {

    const redCliDelPromise = promisify(redCli.del).bind(redCli)

    await redCliDelPromise(`wListRefTokenId:${req.userId}`)

    return res.status(203).json({
      success: true,
      cache: {
        isCached: false,
        reCacheResult: null
      },
      error: null,
      message: "Logout Successfully",
      result: null
    })
  } catch (e) {
    return next(new Error(e))
  }
}

