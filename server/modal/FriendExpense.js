const mongoose = require("mongoose");

const friendExpenseSchema = new mongoose.Schema({
    description: {
        type: String,
        maxlength: 100,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    category: {
        type: String,
    },
    friend:{
        type:String,
        ref:"User",
        required:true
    },
    paidBy: {
        type: String,
        ref: "User",
        required: true,
    },
    membersBalance: {
        type: Array,
        required: true,
        default: [],
    },
    settledMembers: {
        type: Array,
        default: [],
    },

    isSettled: {
        type: Boolean,
        default: false,
    },
});

const FriendExpense = mongoose.model("FriendExpense", friendExpenseSchema);
module.exports = FriendExpense;
