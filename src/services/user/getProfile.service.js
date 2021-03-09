"use strict"

const User = require("../../models/User.model")

const getProfileService = async (userId) => {
  try {
    const tempGetProfileUser = await User.findOne({ _id: userId }).select("-_id -__v -createdAt -updatedAt -password")

    return tempGetProfileUser
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = getProfileService