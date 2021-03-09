"use strict"

//!Configurating App,Root Routes & Middlewares

require("dotenv").config()
const express = require("express"),
  hpp = require("hpp"),
  cors = require("cors"),
  logger = require("morgan"),
  expMongooseSanitize = require("express-mongo-sanitize"),
  helmet = require("helmet"),
  app = express()

const apiRoutes = require("./routes")

const notFound = require("./middlewares/notFound.middleware"),
  errHandler = require("./middlewares/errHandler.middleware")

app.set("etag", false)

app.use(cors())
app.use(helmet())
app.use(hpp())

app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: false }))

app.use(expMongooseSanitize())

app.use(logger("dev", {
  skip: (req, res) => res.statusCode < 400
}))

app.use("/api/v1", apiRoutes)
app.use(notFound)
app.use(errHandler)

module.exports = app

