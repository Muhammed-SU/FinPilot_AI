// controllers/categoryController.js
const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [{ userId: req.userId }, { isDefault: true }],
      isActive: true
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.userId };
    const newCategory = await Category.create(data);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { isActive: false }
    );
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.bulkAddCategories = async (req, res) => {
  try {
    const userId = req.userId;
    const categories = req.body.map((cat) => ({
      ...cat,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const inserted = await Category.insertMany(categories);
    res.status(201).json(inserted);
  } catch (error) {
    console.error('Error inserting categories:', error);
    res.status(500).json({ message: 'Error inserting categories' });
  }
};