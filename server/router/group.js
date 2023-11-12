const express = require("express");
const User = require("../modal/User");
const Authenticate = require("../middleware/authenticate");
const Group = require("../modal/Group")
const router = express.Router();

router.post("/addgroup", async (req, res) => {
    try {
        const group = new Group({
            name: req.body.name,
            description: req.body.description,
            members: req.body.members,
        });
        await group.save();
        res.send(group);
        // res.status(201).json({ message: "Group registered Successfully" });
    } catch (err) {
        console.log(err);
    }
});

router.get("/member/:memberId", async (req, res) => {
    try {
        const memberId = req.params.memberId;
        let groups = await Group.find({ members: memberId }).lean();
        groups = groups.map(async (group) => {
            const totalExpenses = 5000;
            return {
                ...group,
                totalExpenses,
            };
        });
        groups = await Promise.all(groups);
        res.send(groups);
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
        const totalExpenses = 5000;
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
    res.send(group);
}
);

router.post("/:groupId/member/:memberId", async (req, res) => {
    const groupId = req.params.groupId;
    const memberId = req.params.memberId;
    const group = await Group.findById(groupId);
    if (!group) {
        res.status(404).json("Group not found");
    }
    const member = await User.findById(memberId);
    if (!member) {
        res.status(404).json("Member not found");
    }
    group.members.push(memberId);
    await group.save();
    res.send(group);
});

router.delete("/:groupId", async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        if (!group) {
            res.status(404).send("Group not found");
        }
        const result = await Group.deleteOne({ _id: groupId });
        return res.send("Group Deleted");
    } catch (err) {
        console.log(err);
    }
});



module.exports = router;