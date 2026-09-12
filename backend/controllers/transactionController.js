const Transaction = require("../models/Transaction");
const { recalculateBudgetSpending } = require("./budgetController");

exports.getAll = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.add = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.userId };
    const newTransaction = await Transaction.create(data);
    
    // Recalculate budget spending after adding transaction
    await recalculateBudgetSpending(req.userId);
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found or not authorized" });
    }
    
    // Recalculate budget spending after deleting transaction
    await recalculateBudgetSpending(req.userId);
    
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found or not authorized" });
    }

    // Recalculate budget spending after updating transaction
    await recalculateBudgetSpending(req.userId);

    res.json(updated);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: error.message });
  }
};