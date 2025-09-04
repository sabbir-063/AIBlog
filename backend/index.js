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

// Middleware setup
corsOptions = {
    origin: "*",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const { createUploadDirs } = require('./Middleware/upload');
createUploadDirs();

// Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);



PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});