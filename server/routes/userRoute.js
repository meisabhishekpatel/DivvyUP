const router = require("express").Router();
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user with the same username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json("Username or email already exists");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPass,
        });

        // Save the user to the database
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json("Wrong credentials");
        }

        // Compare the passwords
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
            return res.status(400).json("Wrong credentials");
        }

        const { password: userPassword, ...other } = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
