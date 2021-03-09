"use strict"
const mongoose = require("mongoose")

const connectDB = () => {

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "production") {
      mongoose.connect(process.env.MONGODB_PROD_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
        .then(() => resolve())
        .catch((e) => reject(e))
    } else if (process.env.NODE_ENV === "test") {
      mongoose.connect(process.env.MONGODB_TEST_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
        .then(() => resolve())
        .catch((e) => reject(e))
    } else {
      mongoose.connect(process.env.MONGODB_DEV_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
        .then(() => resolve())
        .catch((e) => reject(e))
    }
  })

}

const disconnectDB = () => {
  return new Promise((resolve, reject) => {
    mongoose.disconnect()
      .then(() => resolve())
      .catch((e) => reject(e))
  })

}


module.exports = { connectDB, disconnectDB }