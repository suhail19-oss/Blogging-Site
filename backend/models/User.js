const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      minlength: [4, "Username must be at least 4 characters long."],
      unique: true,
      trim: true, 
      lowercase: true, 
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
    },
  },
  { timestamps: true } 
);

UserSchema.index({ username: 1 }, { unique: true });

UserSchema.pre("save", function (next) {
  if (this.isModified("username")) {
    this.username = this.username.toLowerCase();
  }
  next();
});

const UserModel = model("User", UserSchema);
module.exports = UserModel;
