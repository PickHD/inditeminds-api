"use strict"

const rateLimit = require("express-rate-limit")

const maxVal = process.env.NODE_ENV === "test" ? 100 : 20

const fetchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: maxVal,
  message: {
    success: false, err_code: 429, err_message: "Too many fetch requested, please try again after an 15 minutes", err_stack: null
  }
})
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: maxVal,
  message: {
    success: false, err_code: 429, err_message: "Too many tokens/request created, please try again after an 15 minutes", err_stack: null
  }
})

module.exports = {
  fetchLimiter,
  createLimiter
}
