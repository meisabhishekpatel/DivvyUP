const express = require("express");
const moment = require("moment");
const IndividualExpense = require("../modal/Individual");

const router = express.Router();

router.post("/add-expense", async (req, res) => {
  const { addedBy, amount, type, category, description, date } = req.body;
  try {
    if (!addedBy || !category || !description || !type) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || !amount) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    const income = new IndividualExpense({
      addedBy,
      amount,
      type,
      category,
      description,
      date,
    });
    await income.save();
    return res.send(income);
    //return res.status(200).json({ message: 'Expense Added' })
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

router.post("/getExpenseBydate", async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    // console.log(req.body);
    // console.log(moment().subtract(Number(frequency), "d").toDate());
    const transections = await IndividualExpense.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      addedBy: req.body.userid,
      ...(type !== "all" && { type }),
    });
    // console.log(transections);
    res.status(200).json(transections);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/get-expenses/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const incomes = await IndividualExpense.find({ addedBy: id }).populate(
      "addedBy",
      {
        name: 1,
        _id: 1,
      }
    );
    return res.status(200).send(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/delete-expense/:id", async (req, res) => {
  const id = req.params.id;
  IndividualExpense.findByIdAndDelete(id)
    .then((income) => {
      res.status(200).json({ message: "Expense Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
});

module.exports = router;
