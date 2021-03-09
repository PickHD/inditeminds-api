"use strict"

const router = require("express").Router(),
  { body, param } = require("express-validator")

//!Import Controllers & Middleware

const { createPostHandler, getPostsHandler, getOnePostHandler, updatePostHandler, deleteOnePostHandler, deleteAllPostHandler, createCommentHandler, deleteCommentHandler } = require("../controllers/post.controller"),
  { verifyAccJWT, cacheWRedis, createLimiter, fetchLimiter, checkWListRefToken } = require("../middlewares")


router
  .post("/", [verifyAccJWT, createLimiter, checkWListRefToken, body("title").isString().notEmpty(), body("textContent").isString().notEmpty(), body("description").isString().notEmpty()], createPostHandler)

  .get("/", [verifyAccJWT, cacheWRedis("2 minutes"), checkWListRefToken, fetchLimiter], getPostsHandler)

  .get("/:title_slug", [verifyAccJWT, cacheWRedis("2 minutes"), fetchLimiter, checkWListRefToken, param("title_slug").isSlug().notEmpty()], getOnePostHandler)

  .put("/:title_slug", [verifyAccJWT, body("title").isString(), createLimiter, checkWListRefToken], updatePostHandler)

  .delete("/:title_slug", [verifyAccJWT, createLimiter, checkWListRefToken, param("title_slug").isSlug().notEmpty()], deleteOnePostHandler)

  .delete("/", [verifyAccJWT, createLimiter, checkWListRefToken], deleteAllPostHandler)

  .post("/:post_id/comments", [verifyAccJWT, createLimiter, checkWListRefToken, param("post_id").notEmpty(), body("comment").isString().notEmpty()], createCommentHandler)

  .delete("/:post_id/comments/:id", [verifyAccJWT, createLimiter, checkWListRefToken, param("post_id").notEmpty(), param("id").notEmpty()], deleteCommentHandler)

module.exports = router