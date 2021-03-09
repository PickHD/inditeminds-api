"use strict"

//!Import Models

const User = require("../../models/User.model")

const getOneUserService = async (userId) => {
  try {
    const tempGetOneUser = await User.findOne({ _id: userId })

    return !tempGetOneUser || tempGetOneUser === "" ? null : tempGetOneUser
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = getOneUserService