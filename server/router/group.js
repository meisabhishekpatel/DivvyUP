const express = require("express");
const User = require("../modal/User");
const Authenticate = require("../middleware/authenticate");
const Group = require("../modal/Group")
const GroupExpense = require("../modal/GroupExpense")
const router = express.Router();
const { updateMemberBalances } = require("../services/expenseServices.js")

router.post("/addgroup", async (req, res) => {
    try {
        const { name, description, members } = req.body;
        if (!name || !description || !members) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const group = new Group({
            name,
            description,
            members,
        });

        const savedGroup = await group.save();

        res.status(201).json({
            success: true,
            message: "Group registered successfully",
            data: savedGroup,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

router.get("/member/:memberId", async (req, res) => {
    try {
        const memberId = req.params.memberId;
        let groups = await Group.find({ members: memberId }).lean();
        groups = groups.map(async (group) => {
            const totalExpenses = await GroupExpense.countDocuments({ group: group._id });
            return {
                ...group,
                totalExpenses,
            };
        });
        groups = await Promise.all(groups);
        return res.send(groups);
    } catch (err) {
        console.log(err);
    }
});

router.get("/:groupId", async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId)
            .populate("members", {
                password: 0,
            })
            .lean({ virtuals: true });
        if (!group?._id) {
            res.status(404).json("Group not found");
        }
        const totalExpenses = await GroupExpense.countDocuments({ group: group._id });
        res.send({ ...group, totalExpenses });
    } catch (err) {
        console.log(err);
    }
});

router.delete("/:groupId/member/:memberId", async (req, res) => {
    const groupId = req.params.groupId;
    const memberId = req.params.memberId;
    const group = await Group.findById(groupId);
    if (!group) {
        res.status(404).send("Group not found");
    }

    const index = group.members.indexOf(memberId);

    if (index > -1) {
        group.members.splice(index, 1);
        await group.save();
    }

    const members = await User.find(
        { _id: { $in: group.members } },
        { name: 1, _id: 1 }
    ).lean();

    const expenses = await GroupExpense.find({ group: groupId });

    const updatedMemberBalances = await updateMemberBalances(
        expenses,
        members
    );

    await Promise.all(
        updatedMemberBalances.map(async (memberBalances) => {
            await GroupExpense.updateOne(
                { _id: memberBalances.expenseId },
                { $set: { membersBalance: memberBalances.membersBalance } }
            );
        })
    );
    res.send(group);
}
);

router.post("/:groupId/member/:memberId", async (req, res) => {
    const groupId = req.params.groupId;
    const memberId = req.params.memberId;
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json("Group not found");
    }

    group.members.push(memberId);
    const members = await User.find(
        { _id: { $in: group.members } },
        { name: 1, _id: 1 }
    ).lean();


    const expenses = await GroupExpense.find({ group: groupId });

    const updatedMemberBalances = await updateMemberBalances(
        expenses,
        members
    );

    await Promise.all(
        updatedMemberBalances.map(async (memberBalances) => {
            await GroupExpense.updateOne(
                { _id: memberBalances.expenseId },
                { $set: { membersBalance: memberBalances.membersBalance } }
            );
        })
    );

    await group.save();
    res.send(group);
});

router.delete("/:groupId", async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).send("Group not found");
        }
        const result = await Group.deleteOne({ _id: groupId });
        return res.send("Group Deleted");
    } catch (err) {
        console.log(err);
    }
});



module.exports = router;