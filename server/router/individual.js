const express = require("express");
const IndividualExpense = require("../modal/Individual")

const router = express.Router();

router.post("/add-expense", async (req, res) => {
    const { addedBy, amount,type, category, description, date } = req.body
    console.log(req.body);
    try {
        if (!addedBy || !category || !description || !type) {
            return res.status(400).json({ message: 'All fields are required!' })
        }
        if (amount <= 0 || !amount) {
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }
        const income =new IndividualExpense({
            addedBy,
            amount,
            type,
            category,
            description,
            date: Date.now()
        })
        await income.save()
        return res.send(income);
        //return res.status(200).json({ message: 'Expense Added' })
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' })
    }
});

router.get("/get-expenses/:id", async (req, res) => {
    try {
        const id=req.params.id;
        const incomes = await IndividualExpense.find({addedBy:id});
        return res.status(200).send(incomes)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
});

router.delete("/delete-expense/:id", async (req, res) => {
    const id = req.params.id;
    IndividualExpense.findByIdAndDelete(id)
        .then((income) => {
            res.status(200).json({ message: 'Expense Deleted' })
        })
        .catch((err) => {
            res.status(500).json({ message: 'Server Error' })
        })
});

module.exports = router;