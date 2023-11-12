const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const user = require("./router/user");
const group = require("./router/group")
const cors = require("cors");
const morgan = require('morgan');
const connectDB = require("./config/config");
dotenv.config();


connectDB();

const app = express();
app.use(cors());
app.use(morgan("dev"));

// middleware
app.use(bodyParser.json());

// PORT
const PORT = 4000;

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

// router
app.use("/user", user);
app.use("/group", group);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
