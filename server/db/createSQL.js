const db = require('../models');


const connectDB = async () => {
    db.sequelize.sync().then(() => {
        console.log("SQL Database Connected!");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = connectDB;
