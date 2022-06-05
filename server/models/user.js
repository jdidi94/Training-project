const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      index: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    // bio: String,
    // image: String,

    dateOfBirth: String,
    number: Number,
    gender: String,
    hash: String,
    salt: String,
  },
  { timestamps: true }
);
UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};
UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      firstName: this.firstName,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};
UserSchema.methods.toAuthJSON = function () {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    token: this.generateJWT(),
    number: this.number,
    dateOfBirth: this.dateOfBirth,
  };
};

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    firstName: this.firstName,
    bio: this.bio,
    image:
      this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
  };
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
