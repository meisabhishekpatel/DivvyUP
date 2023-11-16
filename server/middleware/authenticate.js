const jwt = require("jsonwebtoken");
const User = require("../modal/User");


const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwttoken;
        if (!token) {
            res.status(404).send("Token not provided")
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser) {
            res.status(404).send("Token not provided")
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    } catch (err) {
        res.status(401);
        console.log(err);
        next();
    }
}

module.exports = Authenticate;