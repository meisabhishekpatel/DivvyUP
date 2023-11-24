const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const user = require("./router/user");
const group = require("./router/group");
const friends = require("./router/friends");
const individual = require("./router/individual");
const expense = require("./router/expense");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/config");
const multer = require("multer");
const mongoose = require("mongoose");
dotenv.config();

connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("dev"));
app.use("/files", express.static("files"));

// middleware
app.use(bodyParser.json());

// PORT
const PORT = 4000;

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

//**********************************multer*********************************//
require("./modal/PdfSchema");
const PdfSchema = mongoose.model("PdfDetails");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.floor(Math.random() * 1000) + 1;
    cb(null, "Receipt" + uniqueSuffix + ".pdf");
  },
});
const upload = multer({ storage: storage });

app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req);
  const fileName = req.file.filename;
  const groupId = req.body.group;
  try {
    await PdfSchema.create({ group: groupId, pdf: fileName });
    return res.send({ status: "ok" });
  } catch (error) {
    return res.json({ status: error });
  }
});

app.get("/get-files/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  try {
    PdfSchema.find({ group: groupId }).then((data) => {
      return res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.send(404);
  }
});

// router
app.use("/user", user);
app.use("/group", group);
app.use("/friends", friends);
app.use("/expense", expense);
app.use("/individual", individual);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
