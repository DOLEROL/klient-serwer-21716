const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [8, "Minimum password length is 8 characters"],
      maxlength: [20, "Maximum password length is 8 characters"],
      validate: isStrongPassword,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
