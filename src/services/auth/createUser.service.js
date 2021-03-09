"use strict"

//!Import Models
const User = require("../../models/User.model"),
  bCrypt = require("bcrypt")

const createUserService = async (fName, email, user, pass, roles) => {
  try {
    const tempNewUser = await User.create({
      fullName: fName,
      email: email,
      username: user,
      password: await bCrypt.hash(pass, 8),
      roles: roles === undefined ? "user" : roles
    })
    return tempNewUser
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = createUserService
