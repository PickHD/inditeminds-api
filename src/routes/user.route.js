"use strict"

const router = require("express").Router()

//!Import Controllers & Middlewares
const { getDashboardHandler, getProfileHandler } = require("../controllers/user.controller"),
  { verifyAccJWT, cacheWRedis, fetchLimiter, checkWListRefToken } = require("../middlewares")

router
  .get("/dashboard", [verifyAccJWT, cacheWRedis("2 minutes"), fetchLimiter, checkWListRefToken], getDashboardHandler)
  .get("/profile", [verifyAccJWT, cacheWRedis("2 minutes"), fetchLimiter, checkWListRefToken], getProfileHandler)

module.exports = router