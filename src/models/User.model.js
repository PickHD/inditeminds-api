"use strict"

require("mongoose-type-email")
const { Schema, SchemaTypes, model } = require("mongoose")

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: SchemaTypes.Email,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })


const User = model("User", UserSchema)

module.exports = User
