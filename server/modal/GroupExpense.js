const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    maxlength: 100,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  group: {
    type: String,
    ref: "Group",
    required: true,
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
  approvedBalance: {
    type: Array,
    default: [],
  },
  isApproved: {
    type: Boolean,
    default: false,
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

const GroupExpense = mongoose.model("GroupExpense", expenseSchema);
module.exports = GroupExpense;
