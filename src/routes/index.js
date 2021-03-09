"use strict"

const router = require("express").Router()

//! Import Routes
const admRoute = require("./admin.route"),
  authRoute = require("./auth.route"),
  postRoute = require("./post.route"),
  userRoute = require("./user.route")

//! Import Middlewares
const { cacheWRedis, fetchLimiter } = require("../middlewares")

router
  .get("/", [cacheWRedis("2 minutes"), fetchLimiter], (req, res) => {
    res.status(200).json({
      success: true,
      cached: true,
      message: "Root Inditeminds API's",
      error: null,
      result: {
        registerLink: {
          method: "POST",
          link: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}${req.baseUrl}/auth/register`
        },
        loginLink: {
          method: "POST",
          link: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}${req.baseUrl}/auth/login`
        },
        tokenLink:{
          method:"POST",
          link: `${req.protocol}://${req.hostname}:${process.env.LOAD_BALANCER_PORT}${req.baseUrl}/auth/token`
        }
      }
    })
  })
  .use("/auth", authRoute)
  .use("/user", userRoute)
  .use("/posts", postRoute)
  .use("/admin", admRoute)

module.exports = router
