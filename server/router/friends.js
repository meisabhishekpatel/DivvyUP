const express = require("express");
const User = require("../modal/User");
const Authenticate = require("../middleware/authenticate");
const Group = require("../modal/Group")
const GroupExpense = require("../modal/GroupExpense")
const router = express.Router();
const { updateMemberBalances } = require("../services/expenseServices.js")


router.post("/:userId/friend/:friendId", async (req, res) => {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json("Group not found");
    }
    user.friends.push(friendId);
    // const members = await User.find(
    //     { _id: { $in: user.friends } },
    //     { name: 1, _id: 1 }
    // ).lean();


    // const expenses = await GroupExpense.find({ group: userId });

    // const updatedMemberBalances = await updateMemberBalances(
    //     expenses,
    //     members
    // );

    // await Promise.all(
    //     updatedMemberBalances.map(async (memberBalances) => {
    //         await GroupExpense.updateOne(
    //             { _id: memberBalances.expenseId },
    //             { $set: { membersBalance: memberBalances.membersBalance } }
    //         );
    //     })
    // );

    await user.save();
    res.send(user);
});


router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId)
            .populate("friends", {
                password: 0,
            })
            .lean({ virtuals: true });
        if (!user?._id) {
            return res.status(404).json("Friends not found");
        }
        const totalExpenses = 1;
        res.send({ ...user, totalExpenses });
    } catch (err) {
        console.log(err);
    }
});


router.delete("/:userId/friend/:friendId", async (req, res) => {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send("Group not found");
    }

    const index = user.friends.indexOf(friendId);

    if (index > -1) {
        user.friends.splice(index, 1);
        await user.save();
    }

    // const members = await User.find(
    //     { _id: { $in: group.members } },
    //     { name: 1, _id: 1 }
    // ).lean();

    // const expenses = await GroupExpense.find({ group: userId });

    // const updatedMemberBalances = await updateMemberBalances(
    //     expenses,
    //     members
    // );

    // await Promise.all(
    //     updatedMemberBalances.map(async (memberBalances) => {
    //         await GroupExpense.updateOne(
    //             { _id: memberBalances.expenseId },
    //             { $set: { membersBalance: memberBalances.membersBalance } }
    //         );
    //     })
    // );
    res.send(user);
}
);


module.exports = router;