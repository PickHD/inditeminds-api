"use strict"

//!Import Models

const User = require("../../models/User.model")

const updateUserService = async (userId, body) => {
  try {
    const tempUpdUser = await User.findOneAndUpdate({ _id: userId }, body)

    return tempUpdUser === null ? null : "User Updated Successfully"
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = updateUserService