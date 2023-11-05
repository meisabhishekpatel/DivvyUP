const mongoose = require('mongoose');

const connectDB = async () => {
  const url = process.env.MONGO_URI;
  mongoose.connect(url)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => console.log(error));
}

module.exports = connectDB;