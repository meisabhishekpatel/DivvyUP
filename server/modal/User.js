const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
    },
    friends: {
      type: [],
      ref: "User",
      require: false,
    },
    friendBalance: {
      type: [],
      require: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

//Hashing Password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    //salting done 12 times
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

//JWT token generation
UserSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("User", UserSchema);
