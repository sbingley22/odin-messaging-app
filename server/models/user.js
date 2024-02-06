const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 25 },
  password: { type: String, required: true, maxLength: 100 },
  firstname: { type: String, required: true, maxLength: 30 },
  lastname: { type: String, required: true, maxLength: 30 },
})

module.exports = mongoose.model("User", UserSchema)