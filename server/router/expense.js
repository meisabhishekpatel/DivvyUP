const express = require("express");
const Authenticate = require("../middleware/authenticate");
const router = express.Router();
const GroupExpense = require("../modal/GroupExpense");
const Group = require("../modal/Group");
const User = require("../modal/User");
const { calculateSplit, updateMemberBalances } = require("../services/expenseServices");

// Add Expense 
router.post("/addExpense", async (req, res) => {
    const { groupId, paidBy, description, amount } = req.body;
    if (!groupId || !paidBy || !amount) {
        return res.status(404).send("Fill all the neccessary details");
    }
    const group = await Group.findById(groupId);
    if (!group) {
        res.status(404).send("Group not found");
    }

    const members = await User.find(
        { _id: { $in: group.members } },
        { name: 1, _id: 1 }
    ).lean();

    const membersBalance = calculateSplit(paidBy, members, amount);

    const expense = new GroupExpense({
        description,
        amount,
        date: Date.now(),
        group: groupId,
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
            expense.settledMembers.indexOf(memberId) === -1 && !expense.isSettled
        );
    });

    const settledExpenses = expenses.filter((expense) => {
        return expense.settledMembers.indexOf(memberId) > -1 || expense.isSettled;
    });

    res.send({
        activeExpenses,
        settledExpenses,
    });
}
);

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

module.exports = router;
