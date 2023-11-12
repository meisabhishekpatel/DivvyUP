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
    const memberId = req.params.memberId;
    let groups = await Group.find({ members: memberId }).lean();
    groups = groups.map(async (group) => {
        // const totalExpenses = await Expense.countDocuments({ group: group._id });
        const totalExpenses = 5000;
        return {
            ...group,
            totalExpenses,
        };
    });
    groups = await Promise.all(groups);
    res.send(groups);
});



module.exports = router;