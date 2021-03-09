"use strict"

const User = require("../models/User.model")

const adminOnly = async (req, res, next) => {
  try {
    const getUser = await User.findOne({ _id: req.userId })
    if (getUser.roles === "admin") {
      return next()
    }
    res.statusCode = 403
    return next(new Error("Forbidden Access"))
  } catch (e) {
    console.log(e)
    return next(new Error(e))
  }
}

module.exports = adminOnly
