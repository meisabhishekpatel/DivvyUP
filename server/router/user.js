const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("../modal/User");
const router = express.Router();

router.post(
  "/signup",
  [
    check("name", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json("please fill the field properly")
    }
    try {
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.status(422).json({ error: "user already exists" });
      } else if (password !== confirmpassword) {
        return res.status(422).json({ error: "password are not matching" });
      } else {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: "User registered Successfully" });
      }
    }
    catch (e) {
      console.log(e);
    }
  }
);
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "incomplete details" })
      }
      const userLogin = await User.findOne({ email: email });
      if (userLogin) {
        isMatch = await bcrypt.compare(password, userLogin.password);
        const token = await userLogin.generateAuthToken();
        console.log(token);
        res.cookie("jwttoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        })
        if (isMatch)
          res.json({ message: "user signin sucessfull" });
        else {
          res.json({ message: "invalid Credentials" })
        }
      }
      else {
        res.json({ message: "invalid Credentials" })

      }
    } catch (e) {
      console.log(e);

    }
  }
);

module.exports = router;
