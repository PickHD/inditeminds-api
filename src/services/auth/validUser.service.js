"use strict"

const bCrypt = require("bcrypt"),
  User = require("../../models/User.model")

const validUserService = async (username, password) => {
  try {
    const checkUser = await User.findOne({ username: username }),
      validPass = await bCrypt.compare(password, checkUser.password)

    return checkUser && validPass ? checkUser : false
  } catch (e) {
    throw new Error(e)
  }
}


module.exports = validUserService