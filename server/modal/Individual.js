const mongoose = require('mongoose');


const IndividualSchema = new mongoose.Schema({
    addedBy:{
        type:String,
        required:true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        default:""
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
}, {timestamps: true})

module.exports = mongoose.model('Expense', IndividualSchema)