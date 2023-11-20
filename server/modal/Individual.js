const mongoose = require('mongoose');


const individualSchema = new mongoose.Schema({
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

const IndividualExpense=mongoose.model('individualExpense', individualSchema)
module.exports = IndividualExpense;