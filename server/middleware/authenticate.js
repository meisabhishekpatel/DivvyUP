const jwt = require("jsonwebtoken");
const User = require("../modal/User");

const jwtsecretkey = process.env.JWT_SECRET_KEY;

const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwttoken;
        const verifyToken = jwt.verify(token, jwtsecretkey);
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser) {
            throw new Error("User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    } catch (err) {
        res.send(401).send("Unauthorized token");
        console.log(err);
    }
}

module.exports = Authenticate;