/* eslint-disable no-unused-vars */
"use strict"

const router = require("express").Router(),
  { body } = require("express-validator")

//!Import Controllers & Middlewares
const { registerHandler, loginHandler, createTokenHandler, logoutHandler } = require("../controllers/auth.controller"),
  { checkDupEmail, checkDupUsername, createLimiter, checkWListRefToken, verifyAccJWT, verifyRefJWT } = require("../middlewares")

router
  .post("/register", [checkDupEmail, checkDupUsername, body("fullName").notEmpty().isString().custom((value, { req }) => {
    if (value.length < 6) {
      throw new Error("Name too short")
    }
    return true

  }).trim(), body("email").notEmpty().isEmail(), body("username").notEmpty().isString().custom((value, { req }) => {
    if (value.length < 6) {
      throw new Error("Username too short")
    }
    return true
  }).trim(), body("password").notEmpty().isStrongPassword(), body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password")
    }
    return true
  }).trim(), createLimiter], registerHandler)

  .post("/login", [body("username").notEmpty().isString(), body("password").notEmpty().isStrongPassword().trim(), createLimiter], loginHandler)

  .post("/token", [body("refToken").notEmpty().isJWT().trim(), verifyAccJWT, verifyRefJWT, checkWListRefToken, createLimiter], createTokenHandler)

  .get("/logout", [verifyAccJWT, checkWListRefToken], logoutHandler)

module.exports = router