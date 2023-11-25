const express = require("express");
const mongoose = require("mongoose");
const GroupExpense = require("../modal/GroupExpense");
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
    return res.status(422).json({ error: "please fill the field properly" });
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
  } catch (e) {
    console.log(e);
  }
});
router.post("/googlesignup", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(422).json({ error: "please fill the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "user already exists" });
    } else {
      const user = new User({ name, email });
      await user.save();
      const userLogin = await User.findOne({ email: email });
      const token = await userLogin.generateAuthToken();
      res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      res.status(201).json({ message: "User registered Successfully" });
    }
  } catch (e) {
    console.log(e);
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "incomplete details" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const isMatch = bcrypt.compare(password, userLogin.password);
      // const token = await userLogin.generateAuthToken();
      // // console.log(token);
      // res.cookie("jwttoken", token, {
      //   expires: new Date(Date.now() + 25892000000),
      //   httpOnly: true,
      // });
      if (isMatch) {
        const token = await userLogin.generateAuthToken();
        // console.log(token);
        res.cookie("jwttoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
        res.json({ message: "user signin sucessfull" });
      } else {
        res.status(422).json({ error: "invalid Credentials" });
      }
    } else {
      res.json({ error: "invalid Credentials" });
    }
  } catch (e) {
    console.log(e);
  }
});
router.post("/googlelogin", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "incomplete details" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const token = await userLogin.generateAuthToken();
      res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      res.json({ message: "user signin sucessfull" });
    } else {
      res.json({ error: "invalid Credentials" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/getDetailsByEmail/:email", async (req, res) => {
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
});

router.get("/settledMembers", async (req, res) => {
  const { userIds } = req.query;

  if (!userIds) return res.send("no id received");

  const parsedUserIds = JSON.parse(userIds);

  if (!parsedUserIds || parsedUserIds.length < 1) return res.send([]);

  const result = await User.find(
    {
      _id: {
        $in: parsedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    },
    { name: 1, _id: 1 }
  ).lean();
  return res.send(result);
});

router.get("/details", Authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find expenses where the user is the payer
    const paidByExpenses = await GroupExpense.find({ paidBy: userId });

    // Find expenses where the user is one of the members and hasn't settled
    const owedExpenses = await GroupExpense.find({
      paidBy: { $ne: new mongoose.Types.ObjectId(userId) },
      $and: [
        {
          membersBalance: {
            $elemMatch: { memberId: new mongoose.Types.ObjectId(userId) },
          },
        },
        { settledMembers: { $ne: userId } },
      ],
    });

    // Calculate Lent
    const lent = paidByExpenses.reduce((previousValue, currentValue) => {
      if (currentValue.membersBalance.length < 1) return previousValue;
      const myBalance = currentValue.membersBalance.find(
        (member) => member.memberId.toString() === userId
      )?.balance;

      const settledExpenses =
        currentValue.settledMembers && currentValue.settledMembers.length > 0
          ? currentValue.settledMembers.map((member) => {
              return currentValue.membersBalance.find(
                (memberBalance) => memberBalance.memberId.toString() === member
              )?.balance;
            })
          : [];

      const updatedBalance =
        Number(myBalance) +
        (settledExpenses
          ? settledExpenses.reduce((acc, val) => acc + Number(val), 0)
          : 0);

      return previousValue + Number(updatedBalance);
    }, 0);

    // Calculate Owe
    const owe = owedExpenses.reduce((previousValue, currentValue) => {
      if (
        currentValue.membersBalance.length < 1 ||
        currentValue.settledMembers.includes(userId)
      ) {
        return previousValue;
      }

      const myBalance = currentValue.membersBalance.find(
        (member) => member.memberId.toString() === userId
      )?.balance;

      return previousValue + Number(myBalance);
    }, 0);

    return res.send({ lent, owe });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;

module.exports = router;
