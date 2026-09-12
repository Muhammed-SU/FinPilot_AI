// routes/categoryRoutes.js
const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {getAllCategories, createCategory, updateCategory, deleteCategory, bulkAddCategories} = require('../controllers/categoryController');

const router = express.Router();

router.use(auth);
router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.post('/bulk', bulkAddCategories);


module.exports = router;