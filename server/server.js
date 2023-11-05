const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/config');


dotenv.config();
const app = express();
const PORT = process.env.PORT | 8080;

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.get('/', (req, res) => {
    res.send('hello');
})


connectDB();


app.listen(PORT, () => {
    console.log(`Server Running on port no ${PORT}`)
})
