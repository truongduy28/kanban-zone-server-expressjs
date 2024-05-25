const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");
const { getRandomAvatar } = require("../utils/avatars");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: getRandomAvatar(),
    },
  },
  schemaOptions
);

module.exports = mongoose.model("User", userSchema);
