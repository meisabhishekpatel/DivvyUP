const express = require("express");
const IndividualSchema = require("../modal/Individual")

const router = express.Router();

router.post("/add-expense", async (req, res) => {
    const { addedBy, amount,type, category, description, date } = req.body

    const income = IndividualSchema({
        addedBy,
        amount,
        type,
        category,
        description,
        date: Date.now()
    })

    try {
        if (!addedBy || !category || !description || !type) {
            return res.status(400).json({ message: 'All fields are required!' })
        }
        if (amount <= 0 || !amount) {
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }
        await income.save()
        return res.status(200).json({ message: 'Expense Added' })
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' })
    }
});

router.get("/get-expenses", async (req, res) => {
    try {
        const incomes = await IndividualSchema.find().sort({ createdAt: -1 })
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
});

router.get("/delete-expense/:id", async (req, res) => {
    const { id } = req.params;
    IndividualSchema.findByIdAndDelete(id)
        .then((income) => {
            res.status(200).json({ message: 'Expense Deleted' })
        })
        .catch((err) => {
            res.status(500).json({ message: 'Server Error' })
        })
});
module.exports = router;