"use strict"

const User = require("../models/User.model")

const checkDupEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    const checkEmail = await User.findOne({ email })
    if (checkEmail) {
      res.statusCode = 400
      return next(new Error("Email is already used,please use another email"))
    }
    next()
  } catch (e) {
    return next(new Error(e))
  }
}
const checkDupUsername = async (req, res, next) => {
  try {
    const { username } = req.body
    const checkUsername = await User.findOne({ username })
    if (checkUsername) {
      res.statusCode = 400
      return next(new Error("Username is already used,please use another email"))
    }
    next()
  } catch (e) {
    return next(new Error(e))
  }
}

module.exports = { checkDupEmail, checkDupUsername }
