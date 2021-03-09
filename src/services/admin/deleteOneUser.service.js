"use strict"

const User = require("../../models/User.model")
const deleteOneUserService = async (userId) => {
  try {
    const tempDelOneUser = await User.findOneAndDelete({ _id: userId })

    return tempDelOneUser === null ? null : "User Deleted Successfully"
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = deleteOneUserService