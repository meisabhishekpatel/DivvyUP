const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const user = require("./router/user");
const cors = require("cors");
const connectDB = require("./config/config");
dotenv.config();


connectDB();

const app = express();
app.use(cors());

// middleware
app.use(bodyParser.json());

// PORT
const PORT = 4000;

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

// router

app.use("/user", user);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
