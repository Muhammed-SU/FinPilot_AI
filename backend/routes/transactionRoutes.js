const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { getAll, add,update, delete: remove } = require("../controllers/transactionController");

const router = express.Router();

router.use(auth);
router.get("/", getAll);
router.post("/", add);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
