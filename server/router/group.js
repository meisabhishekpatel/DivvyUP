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

router.get('/getDetailsByEmail/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json("User not found.");
        delete user.password;
        res.send({
            name: user.name,
            email: user.email,
            id: user._id,
        });
    } catch (err) {
        console.log(err);
    }
})

// router.get("/:email", authMiddleWare, async (req, res) => {
//     const user = await User.findOne({ email: req.params.email });
//     if (!user) return res.status(404).send("User not found.");
//     delete user.password;
//     res.send({
//         name: user.name,
//         email: user.email,
//         id: user._id,
//     });
// });

module.exports = router;