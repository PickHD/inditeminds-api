"use strict"

const jwt = require("jsonwebtoken")
const { promisify } = require("util")

const verifyAccJWT = async (req, res, next) => {
  try {
    const checkAuthorization = req.headers.authorization

    if (!checkAuthorization) {
      res.statusCode = 400
      return next(new Error("No Access Token Provided"))
    }
    const getToken = checkAuthorization.split(" ")[1]

    const verifyTokenPromise = promisify(jwt.verify).bind(jwt)

    const userTokenVerified = await verifyTokenPromise(getToken, process.env.JWT_ACC_TOKEN_SECRET)

    req.userId = userTokenVerified.id
    next()
  } catch (e) {
    return next(new Error(e))
  }
}

const verifyRefJWT = async (req, res, next) => {
  try {
    const getRefToken = req.body.refToken

    if (!getRefToken) {
      res.statusCode = 400
      return next(new Error("No Refresh Token Provided"))
    }

    const verifyTokenPromise = promisify(jwt.verify).bind(jwt)

    const userTokenVerified = await verifyTokenPromise(getRefToken, process.env.JWT_REF_TOKEN_SECRET)

    req.userId = userTokenVerified.id
    next()
  } catch (e) {
    return next(new Error(e))
  }
}

module.exports = { verifyAccJWT, verifyRefJWT }
