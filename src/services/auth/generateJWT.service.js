"use strict"

const jwt = require("jsonwebtoken"),
  { promisify } = require("util")

const genJWTService = async (userId, secret, expToken) => {
  try {

    const jwtSignPromise = promisify(jwt.sign).bind(jwt)

    const tempCreateJWT = await jwtSignPromise({ id: userId }, secret, {
      expiresIn: expToken
    })

    return tempCreateJWT
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = genJWTService