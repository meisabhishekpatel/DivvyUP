const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        friends: {
            type: [],
            require: false,
        },
        friendBalance: {
            type: [],
            require: false,
        },
        Recurring_payments: {
            type: [{}],
            require: false,
        }
    },
    { timestamps: true }
)
module.exports = mongoose.model("User", UserSchema)