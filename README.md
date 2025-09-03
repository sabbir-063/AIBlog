# 🚀 AI Blog Platform

<div align="center">

![AI Blog Platform](https://img.shields.io/badge/AI%20Blog-Platform-blue?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

*A modern, full-stack blog platform built with cutting-edge web technologies*

[🌟 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [🚀 Quick Start](#-quick-start) • [📖 API Documentation](#-api-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## 📋 Overview

AI Blog Platform is a sophisticated, feature-rich blogging application built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a seamless experience for content creators and readers with modern UI/UX, robust authentication, and comprehensive content management capabilities.

## ✨ Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** - Secure user sessions
- **Role-based Access Control** -  Author, and Reader roles
- **Password Encryption** - bcrypt for secure password hashing
- **Protected Routes** - Route-level authentication guards

### 📝 **Content Management**
- **Image Upload & Optimization** - Automatic image processing with Sharp
- **Real-time Search** - Full-text search across posts and tags
- **Post Categories & Tags** - Organize content efficiently

### 👥 **User Experience**
- **User Profiles** - Customizable profiles with profile pictures
- **Social Interactions** - Like posts and view counts
- **Infinite Scroll** - Smooth content loading
- **Toast Notifications** - Real-time feedback for user actions

## 🛠️ Tech Stack

### **Frontend**
```json
{
  "framework": "React 19.1.1",
  "routing": "React Router DOM 7.8.2",
  "styling": "Tailwind CSS 4.1.12",
  "state_management": "React Context API",
  "http_client": "Axios 1.11.0",
  "notifications": "React Toastify 11.0.5",
  "icons": "Lucide React 0.542.0",
  "build_tool": "Vite 7.1.2",
  "linting": "ESLint 9.33.0"
}
```

### **Backend**
```json
{
  "runtime": "Node.js",
  "framework": "Express 5.1.0",
  "database": "MongoDB with Mongoose 8.16.3",
  "authentication": "JWT (jsonwebtoken 9.0.2)",
  "encryption": "bcrypt 6.0.0",
  "file_upload": "Multer 2.0.2",
  "image_processing": "Sharp 0.34.3",
  "cors": "CORS 2.8.5",
  "environment": "dotenv 17.2.0"
}
```


## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sabbir-063/AIBlog.git
   cd AIBlog
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/aiblog
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aiblog
   
   # Authentication
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   
   # Server Configuration
   PORT=5000
   BASE_URL=http://localhost:5000

   ```

5. **Start the Development Servers**
   
   **Terminal 1 - Backend Server:**
   ```bash
   cd backend
   npm start
   ```
   
   **Terminal 2 - Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
   - **API Documentation:** [View API Docs](./backend/API_DOCUMENTATION.md)

## 📁 Project Structure

```
AIBlog/
├── 📁 backend/                    # Backend API server
│   ├── 📁 Controllers/            # Request handlers
│   │   ├── authController.js      # Authentication logic
│   │   ├── postController.js      # Post management
│   │   └── userController.js      # User management
│   ├── 📁 DB/                     # Database configuration
│   │   └── dbConnect.js           # MongoDB connection
│   ├── 📁 Middleware/             # Custom middleware
│   │   ├── authMiddleware.js      # JWT authentication
│   │   ├── localUpload.js         # Local file upload
│   │   └── upload.js              # File upload configuration
│   ├── 📁 Models/                 # Database schemas
│   │   ├── Post.js                # Post model
│   │   └── userSchema.js          # User model
│   ├── 📁 Routes/                 # API routes
│   │   ├── authRoutes.js          # Authentication routes
│   │   ├── postRoutes.js          # Post routes
│   │   └── userRoutes.js          # User routes
│   ├── 📁 uploads/                # Uploaded files storage
│   │   ├── 📁 post-images/        # Blog post cover images
│   │   └── 📁 profile-pictures/   # User profile pictures
│   ├── 📁 utils/                  # Utility functions
│   ├── index.js                   # Server entry point
│   ├── package.json               # Backend dependencies
│   └── API_DOCUMENTATION.md       # Comprehensive API docs
├── 📁 frontend/                   # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/         # React components
│   │   │   ├── CreatePost.jsx     # Post creation form
│   │   │   ├── EditPost.jsx       # Post editing form
│   │   │   ├── Home.jsx           # Homepage with post feed
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── Navbar.jsx         # Navigation components
│   │   │   ├── PostCard.jsx       # Post preview card
│   │   │   ├── PostDetails.jsx    # Full post view
│   │   │   ├── Profile.jsx        # User profile page
│   │   │   └── Register.jsx       # Registration form
│   │   ├── 📁 contexts/           # React Context providers
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   ├── 📁 utils/              # Utility functions
│   │   │   ├── axiosInstance.js   # API client configuration
│   │   │   ├── decode_token.js    # JWT token utilities
│   │   │   ├── protectedRoute.jsx # Route protection
│   │   │   └── validateUser.js    # User validation
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # App entry point
│   │   └── index.css              # Global styles
│   ├── 📁 public/                 # Static assets
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── postcss.config.mjs         # PostCSS configuration
│   └── eslint.config.js           # ESLint configuration
└── README.md                      # Project documentation
```

## 🔌 Key API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `GET` | `/api/posts/all` | Get all posts (paginated) | ❌ |
| `GET` | `/api/posts/search` | Search posts by query/tags | ❌ |
| `GET` | `/api/posts/:id` | Get single post | ❌ |
| `POST` | `/api/posts/create` | Create new post | ✅ |
| `PUT` | `/api/posts/:id` | Update post | ✅ (Author/Admin) |
| `DELETE` | `/api/posts/:id` | Delete post | ✅ (Author/Admin) |
| `POST` | `/api/posts/:id/like` | Toggle like/unlike | ✅ |
| `GET` | `/api/user/profile` | Get user profile | ✅ |
| `PUT` | `/api/user/profile` | Update profile | ✅ |
| `PUT` | `/api/user/password` | Change password | ✅ |
| `GET` | `/api/user/posts` | Get user's posts | ✅ |



## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   ```
5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push and create a pull request**

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Update documentation for new features
- Add tests for new functionality
- Ensure all existing tests pass


## 👨‍💻 Author

**Mohammad Sabbir Musfique**
- GitHub: [@sabbir-063](https://github.com/sabbir-063)
- Email: sabbir.musfique@bedatasolutions.com

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[🐛 Report Bug](https://github.com/sabbir-063/AIBlog/issues) • [🚀 Request Feature](https://github.com/sabbir-063/AIBlog/issues) • [💬 Discussions](https://github.com/sabbir-063/AIBlog/discussions)

Made with ❤️ using the MERN Stack

</div>
