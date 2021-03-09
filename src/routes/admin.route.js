"use strict"

const router = require("express").Router(),
  { body, param } = require("express-validator")

//!Import Controllers & Middlewares

const { getDashboardHandler, getManageHandler, getUsersHandler, getOneUserHandler, updateUserHandler, deleteUserHandler, getTagsHandler, createTagHandler, getOneTagHandler, updateTagHandler, deleteTagHandler } = require("../controllers/admin.controller"),
  { verifyAccJWT, fetchLimiter, createLimiter, cacheWRedis, adminOnly, checkDupEmail, checkDupUsername, checkWListRefToken } = require("../middlewares")

router
  .get("/dashboard", [verifyAccJWT, fetchLimiter, checkWListRefToken, cacheWRedis("2 minutes"), adminOnly], getDashboardHandler)
  .get("/manage", [verifyAccJWT, fetchLimiter, checkWListRefToken, cacheWRedis("2 minutes"), adminOnly], getManageHandler)

  .get("/manage/users", [verifyAccJWT, fetchLimiter, checkWListRefToken, adminOnly, cacheWRedis("2 minutes")], getUsersHandler)
  .get("/manage/user/:id?", [verifyAccJWT, fetchLimiter, checkWListRefToken, param("id").notEmpty().trim(), cacheWRedis("2 minutes"), adminOnly], getOneUserHandler)
  .put("/manage/user/:id?", [verifyAccJWT, createLimiter, checkWListRefToken, param("id").notEmpty().trim(), checkDupEmail, checkDupUsername, adminOnly], updateUserHandler)
  .delete("/manage/user/:id?", [verifyAccJWT, adminOnly, createLimiter, param("id").notEmpty().trim(), checkWListRefToken], deleteUserHandler)

  .get("/manage/tags", [verifyAccJWT, fetchLimiter, checkWListRefToken, cacheWRedis("2 minutes"), adminOnly], getTagsHandler)
  .post("/manage/tags", [verifyAccJWT, createLimiter, checkWListRefToken, adminOnly, body("tagName").isString().notEmpty().trim()], createTagHandler)
  .get("/manage/tag/:id?", [verifyAccJWT, fetchLimiter, checkWListRefToken, param("id").notEmpty().trim(), cacheWRedis("2 minutes"), adminOnly], getOneTagHandler)
  .put("/manage/tag/:id?", [verifyAccJWT, createLimiter, checkWListRefToken, param("id").notEmpty().trim(), adminOnly, body("tagName").isString().notEmpty().trim()], updateTagHandler)
  .delete("/manage/tag/:id?", [verifyAccJWT, adminOnly, param("id").notEmpty().trim(), createLimiter, checkWListRefToken], deleteTagHandler)

module.exports = router
