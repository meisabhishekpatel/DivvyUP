const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    members: {
        type: [],
        ref: "User"
    },
    balance: {
        type: Number
    }
},
    { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
