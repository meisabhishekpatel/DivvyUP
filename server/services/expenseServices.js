const mongoose = require("mongoose");
const express = require("express");
const User = require("../modal/User");
const Authenticate = require("../middleware/authenticate");
const Group = require("../modal/Group")
const GroupExpense = require("../modal/GroupExpense")

const calculateSplit = (paidBy, members, amount) => {
    const splittedAmount = +Number(amount / members.length).toFixed(2);
    const membersBalance = members.map((member) => {
        if (member._id.toString() === paidBy.toString()) {
            return {
                memberId: member._id,
                name: member.name,
                balance: Number(amount - splittedAmount).toFixed(2),
            };
        } else {
            return {
                memberId: member._id,
                name: member.name,
                balance: `-${Number(splittedAmount).toFixed(2)}`,
            };
        }
    });
    return membersBalance;
};

const updateMemberBalances = async (expenses, members) => {
    let updatedMemberBalances;
    if (expenses) {
        updatedMemberBalances = expenses.map(({ _id, paidBy, amount }) => {
            return {
                expenseId: _id,
                membersBalance: calculateSplit(paidBy, members, amount),
            };
        });
    }

    return Promise.all(updatedMemberBalances);
};
const simplifyDebts = (expenses) => {
    // Step 1: Calculate the total amount each person owes or is owed
    let balances = {};
    let simplifiedDebts = [];
    try {
        if (expenses) {
            expenses.forEach((expense) => {
                // Add the amount to the payer's balance
                balances[expense.payer] = (balances[expense.payer] || 0) + expense.amount;

                // Subtract the amount from each participant's balance
                expense.participants.forEach((participant) => {
                    balances[participant] = (balances[participant] || 0) - expense.amount / expense.participants.length;
                });
            });

            // Step 2: Simplify debts by finding pairs of people who can settle up

            while (true) {
                // Find the person with the maximum positive balance
                let maxCreditor = Object.keys(balances).reduce((a, b) => balances[a] > balances[b] ? a : b);

                // Find the person with the maximum negative balance
                let maxDebtor = Object.keys(balances).reduce((a, b) => balances[a] < balances[b] ? a : b);

                // If both balances are zero or negligible, break the loop
                if (balances[maxCreditor] === 0 || Math.abs(balances[maxCreditor]) < 0.01) {
                    break;
                }

                // Calculate the amount to settle between maxCreditor and maxDebtor
                let settleAmount = Math.min(Math.abs(balances[maxCreditor]), Math.abs(balances[maxDebtor]));

                // Update balances and add the settlement to the result
                balances[maxCreditor] -= settleAmount;
                balances[maxDebtor] += settleAmount;
                simplifiedDebts.push({ from: maxDebtor, to: maxCreditor, amount: settleAmount });
            }
        }
        return simplifiedDebts;
    } catch (err) {
        // console.log(err);
        return {};
    }


}



module.exports = { calculateSplit, updateMemberBalances, simplifyDebts }