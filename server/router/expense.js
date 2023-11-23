const express = require("express");
const Authenticate = require("../middleware/authenticate");
const router = express.Router();
const GroupExpense = require("../modal/GroupExpense");
const Group = require("../modal/Group");
const User = require("../modal/User");
const moment = require("moment");
const {
  calculateSplit,
  updateMemberBalances,
  simplifyDebts,
} = require("../services/expenseServices");
const FriendExpense = require("../modal/FriendExpense");

// Add Expense
router.post("/addExpense", async (req, res) => {
  const { groupId, paidBy, category, description, amount, date } = req.body;
  if (!groupId || !paidBy || !amount) {
    return res.status(404).send("Fill all the neccessary details");
  }
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).send("Group not found");
  }

  const members = await User.find(
    { _id: { $in: group.members } },
    { name: 1, _id: 1 }
  ).lean();

  const membersBalance = calculateSplit(paidBy, members, amount);

  const expense = new GroupExpense({
    description,
    amount,
    category,
    date: date,
    group: groupId,
    paidBy,
    membersBalance,
    settledMembers: [],
  });

  await expense.save();
  res.send(expense);
});

//Add Friend Expense
router.post("/addFriendExpense", async (req, res) => {
  const { friendId, paidBy, category, description, amount, date } = req.body;
  if (!friendId || !paidBy || !amount) {
    return res.status(404).send("Fill all the neccessary details");
  }
  const user = await User.findById(friendId);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const friends = [friendId, paidBy];
  const members = await User.find(
    { _id: { $in: friends } },
    { name: 1, _id: 1 }
  ).lean();

  const membersBalance = calculateSplit(paidBy, members, amount);

  const expense = new FriendExpense({
    description,
    amount,
    category,
    date,
    friend: friendId,
    paidBy,
    membersBalance,
    settledMembers: [],
  });

  await expense.save();
  res.send(expense);
});

//Get Expense
router.get("/group/:groupId/member/:memberId", async (req, res) => {
  const groupId = req.params.groupId;
  const memberId = req.params.memberId;
  const expenses = await GroupExpense.find({
    group: groupId,
  }).populate("paidBy", {
    name: 1,
    _id: 1,
  });

  const activeExpenses = expenses.filter((expense) => {
    return (
      expense.approvedBalance.indexOf(memberId) === -1 &&
      !expense.isApproved &&
      expense.settledMembers.indexOf(memberId) === -1 &&
      !expense.isSettled
    );
  });

  const approvedExpenses = expenses.filter((expense) => {
    return (
      expense.approvedBalance.indexOf(memberId) > -1 ||
      (expense.isApproved &&
        expense.settledMembers.indexOf(memberId) === -1 &&
        !expense.isSettled)
    );
  });
  const settledExpenses = expenses.filter((expense) => {
    return expense.settledMembers.indexOf(memberId) > -1 || expense.isSettled;
  });

  res.send({
    activeExpenses,
    approvedExpenses,
    settledExpenses,
  });
});

//Get Expense By group Id
router.post("/getGroupExpenseBydate", async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    console.log(req.body);
    // console.log(moment().subtract(Number(frequency), "d").toDate());
    const transections = await GroupExpense.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      group: req.body.userid,
      ...(type !== "all" && { type }),
    });
    res.status(200).json(transections);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/getFriendExpenseBydate", async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    console.log(req.body);
    // console.log(moment().subtract(Number(frequency), "d").toDate());
    const transections = await FriendExpense.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      $or: [{ friend: req.body.userid }, { paidBy: req.body.userid }],
      ...(type !== "all" && { type }),
    });
    res.status(200).json(transections);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//Get Friend Expense
router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  // const friendId = req.params.friendId;
  const expenses = await FriendExpense.find({
    $or: [{ friend: userId }, { paidBy: userId }],
  })
    .populate("paidBy", {
      name: 1,
      _id: 1,
    })
    .populate("friend", {
      name: 1,
      _id: 1,
    });

  const activeExpenses = expenses.filter((expense) => {
    return expense.settledMembers.indexOf(userId) === -1 && !expense.isSettled;
  });

  const settledExpenses = expenses.filter((expense) => {
    return expense.settledMembers.indexOf(userId) > -1 || expense.isSettled;
  });

  res.send({
    activeExpenses,
    settledExpenses,
  });
});

//Settle Expense
router.post("/:expenseId/settle/:memberId", async (req, res) => {
  const expenseId = req.params.expenseId;
  const memberId = req.params.memberId;
  if (!expenseId || !memberId) return res.status(404).send("no id received");
  const expense = await GroupExpense.findById(expenseId);
  if (!expense) {
    return res.status(404).send("Expense not found");
  }
  const index = expense.settledMembers.indexOf(memberId);
  if (index > -1) {
    expense.settledMembers.splice(index, 1);
  } else {
    expense.settledMembers.push(memberId);
  }
  if (
    expense.settledMembers.length ===
    expense.membersBalance.filter(
      (member) => member.memberId.toString() !== expense.paidBy.toString()
    ).length
  ) {
    expense.isSettled = true;
  }
  await expense.save();
  return res.send(expense);
});

router.post("/:expenseId/approve/:memberId", async (req, res) => {
  const expenseId = req.params.expenseId;
  const memberId = req.params.memberId;
  if (!expenseId || !memberId) return res.status(404).send("no id received");
  const expense = await GroupExpense.findById(expenseId);
  if (!expense) {
    return res.status(404).send("Expense not found");
  }
  const index = expense.approvedBalance.indexOf(memberId);
  if (index > -1) {
    expense.approvedBalance.splice(index, 1);
  } else {
    expense.approvedBalance.push(memberId);
  }
  if (
    expense.approvedBalance.length ===
    expense.membersBalance.filter(
      (member) => member.memberId.toString() !== expense.paidBy.toString()
    ).length
  ) {
    expense.isApproved = true;
  }
  await expense.save();
  return res.send(expense);
});

//Settle Friend Expense
router.post("/:expenseId/friendsettle/:memberId", async (req, res) => {
  const expenseId = req.params.expenseId;
  const memberId = req.params.memberId;
  if (!expenseId || !memberId) return res.status(404).send("no id received");
  const expense = await FriendExpense.findById(expenseId);
  if (!expense) {
    return res.status(404).send("Expense not found");
  }
  const index = expense.settledMembers.indexOf(memberId);
  if (index > -1) {
    expense.settledMembers.splice(index, 1);
  } else {
    expense.settledMembers.push(memberId);
  }
  if (
    expense.settledMembers.length ===
    expense.membersBalance.filter(
      (member) => member.memberId.toString() !== expense.paidBy.toString()
    ).length
  ) {
    expense.isSettled = true;
  }
  await expense.save();
  return res.send(expense);
});

//Revert Expense
router.post("/:expenseId/revert/:memberId", async (req, res) => {
  const expenseId = req.params.expenseId;
  const memberId = req.params.memberId;
  if (!expenseId || !memberId) return res.status(404).send("no id received");
  const expense = await GroupExpense.findById(expenseId);
  if (!expense) {
    return res.status(404).send("Expense not found");
  }
  const index = expense.settledMembers.indexOf(memberId);
  if (index > -1) {
    expense.settledMembers.splice(index, 1);
  }

  if (
    expense.settledMembers.length !==
    expense.membersBalance.filter(
      (member) => member.memberId.toString() !== expense.paidBy.toString()
    ).length
  ) {
    expense.isSettled = false;
  }
  await expense.save();
  return res.send(expense);
});

//Revert Friend Expense
router.post("/:expenseId/friendrevert/:memberId", async (req, res) => {
  const expenseId = req.params.expenseId;
  const memberId = req.params.memberId;
  if (!expenseId || !memberId) return res.status(404).send("no id received");
  const expense = await FriendExpense.findById(expenseId);
  if (!expense) {
    return res.status(404).send("Expense not found");
  }
  const index = expense.settledMembers.indexOf(memberId);
  if (index > -1) {
    expense.settledMembers.splice(index, 1);
  }

  if (
    expense.settledMembers.length !==
    expense.membersBalance.filter(
      (member) => member.memberId.toString() !== expense.paidBy.toString()
    ).length
  ) {
    expense.isSettled = false;
  }
  await expense.save();
  return res.send(expense);
});

//Simplify Debts
router.get("/simplify/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    if (!groupId) return res.status(404).send("no id recieved");
    const expenses = await GroupExpense.find({ group: groupId });
    if (!expenses) return res.status(201).send("expense list is empty");
    const newexpense = [];
    expenses.forEach((expense) => {
      participants = [];
      expense.membersBalance.forEach((member) => {
        participants.push(member.memberId);
      });
      newexpense.push({
        payer: expense.paidBy,
        participants: participants,
        amount: expense.amount,
      });
    });
    const simplify = simplifyDebts(newexpense);
    return res.status(201).send(simplify);
  } catch (err) {
    console.log(err);
    return res.status(404).send(err);
  }
});

module.exports = router;
