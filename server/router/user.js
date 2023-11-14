const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("../modal/User");
const Authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");
const router = express.Router();
router.use(cookieParser());

router.post("/signup", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "please fill the field properly" })
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
        // console.log(token);
        res.cookie("jwttoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        })
        if (isMatch)
          res.json({ message: "user signin sucessfull" });
        else {
          res.status(422).json({ error: "invalid Credentials" })
        }
      }
      else {
        res.json({ error: "invalid Credentials" })

      }
    } catch (e) {
      console.log(e);

    }
  }
);

router.get('/getDetailsByEmail/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json("User not found.");
    delete user.password;
    res.send({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    console.log(err);
  }
})

router.get('/details', Authenticate, (req, res) => {
  res.send(req.rootUser);
})

module.exports = router;
