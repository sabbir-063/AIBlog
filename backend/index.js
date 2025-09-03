require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { dbConnect } = require("./DB/dbConnect");
const authRoutes = require("./Routes/authRoutes");
const postRoutes = require("./Routes/postRoutes");
const userRoutes = require('./Routes/userRoutes');
const aiRoutes = require('./Routes/aiRoutes');

// Database connection
dbConnect();
corsOptions = {
    origin: "*",
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware setup
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const { createUploadDirs } = require('./Middleware/upload');
createUploadDirs();

// Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err);

    // Handle multer errors
    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: `File upload error: ${err.message}`
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});