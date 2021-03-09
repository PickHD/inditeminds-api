"use strict"

const notFound = (req, res, next) => {
  res.statusCode = 404
  return next(new Error("Route not Found"))
}

module.exports = notFound
