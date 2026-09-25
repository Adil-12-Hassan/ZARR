const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
// Fetch Secrets from .env
dotenv.config();
// Connect to mongoDB
connectDB();
const app = express();
/* Middleware
Allows requests from the React frontend */
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credential: true,
})
)
// Parse incoming JSON request bodies
app.use(express.json());
// Routes
app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/products", require("./routes/productRoutes.js"));
app.use("/api/orders", require("./routes/orderRoutes.js"));
app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/messages", require("./routes/messageRoutes.js"));
// Health Check 
app.get("/", (req, res) => {
    res.json({
        message: "ZARR API is running."
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found/exists."
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.err(err.status);
    req.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`ZARR server running on ${PORT}`);
});