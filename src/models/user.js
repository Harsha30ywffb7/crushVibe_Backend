const mongoose = require("mongoose");

const userScehma = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      Validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Invalid gender type");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    about: {
      type: String,
      default: "Hey there! I am using Tinder.",
    },
    hobbies: {
      type: [String],
    },
  },
  { timeStamps: true } // gives the time of creation and updation
);

const User = mongoose.model("User", userScehma);

module.exports = User;
