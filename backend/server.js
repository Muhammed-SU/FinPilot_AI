const express = require('express');
const mongoose = require('mongoose');
const dotenv = require ('dotenv');
const cors = require('cors')

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const aiInsightsRoutes = require("./routes/aiInsightsRoutes");

const app =express();

app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/ai-insights", aiInsightsRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT || 5000, () =>
        console.log("Server running on port", process.env.PORT || 5000)
    );
}).catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit the process with failure
});