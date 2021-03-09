"use strict"

//!Import Models

const User = require("../../models/User.model")

const getAllUserService = async () => {
  try {
    const tempGetAllUser = await User.find({ roles: "user" })

    return tempGetAllUser
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = getAllUserService