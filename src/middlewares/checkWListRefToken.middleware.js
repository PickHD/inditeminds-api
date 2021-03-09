"use strict"

const { promisify } = require("util"),
  redCli = require("../config/redisCli.config")

const checkWListRefToken = async (req, res, next) => {
  try {

    const redCliGetPromise = promisify(redCli.get).bind(redCli)
    const getKey = await redCliGetPromise(`wListRefTokenId:${req.userId}`)

    if (getKey === null) {
      res.statusCode = 403
      return next(new Error("Expired Refresh Token,Please to Re-login again."))
    } else {
      return next()
    }

  } catch (e) {
    return next(new Error(e))
  }

}
module.exports = checkWListRefToken