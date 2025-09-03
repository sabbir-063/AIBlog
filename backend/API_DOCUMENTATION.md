# BlogSite Backend API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Content-Type:** `multipart/form-data`

**Body:**
```javascript
{
  "firstname": "John",
  "lastname": "Doe", 
  "datathOfBirth": "1990-01-01",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "profilePicture": <file> // Optional image file
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -F "firstname=John" \
  -F "lastname=Doe" \
  -F "datathOfBirth=1990-01-01" \
  -F "username=johndoe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "profilePicture=@/path/to/image.jpg"
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "firstname": "John",
    "lastname": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "profilePicture": "/uploads/profile-pictures/1693891234567-image.jpg",
    "role": "reader"
  }
}
```

### 2. Login User
**POST** `/api/auth/login`

**Content-Type:** `application/json`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "firstname": "John",
    "lastname": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "profilePicture": "/uploads/profile-pictures/1693891234567-image.jpg",
    "role": "author"
  }
}
```

---

## 📝 Post Endpoints

### 1. Create Post
**POST** `/api/posts/create`

**Auth Required:** Yes

**Content-Type:** `multipart/form-data`

**Body:**
```javascript
{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "coverImage": <file>, // Required image file
  "tags": ["technology", "programming"] // Optional
}
```
    
**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/posts/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=My First Blog Post" \
  -F "content=This is the content of my blog post..." \
  -F "coverImage=@/path/to/cover-image.jpg" \
  -F "tags=technology,programming"
```

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "author": "64f5a1b2c3d4e5f6a7b8c9d0",
  "coverImage": {
    "filename": "1693891234567-cover.jpg",
    "originalName": "cover.jpg",
    "url": "/uploads/post-images/1693891234567-cover.jpg",
    "path": "uploads/post-images/1693891234567-cover.jpg",
    "width": 1200,
    "height": 800,
    "format": "jpeg",
    "size": 245760,
    "mimetype": "image/jpeg"
  },
  "likes": [],
  "viewCount": 0,
  "tags": ["technology", "programming"],
  "createdAt": "2023-09-04T10:30:45.123Z",
  "updatedAt": "2023-09-04T10:30:45.123Z",
  "likeCount": 0
}
```

### 2. Get All Posts
**GET** `/api/posts/all`

**Auth Required:** No

**Query Parameters:**
- `sort` (optional): `latest`, `oldest`, `most_viewed`, `most_liked`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

**Example using curl:**
```bash
curl "http://localhost:5000/api/posts/all?sort=latest&page=1&limit=10"
```

**Response:**
```json
{
  "posts": [
    {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
      "title": "My First Blog Post",
      "content": "This is the content...",
      "author": {
        "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
        "firstname": "John",
        "lastname": "Doe",
        "username": "johndoe",
        "profilePicture": "/uploads/profile-pictures/1693891234567-image.jpg"
      },
      "coverImage": {
        "url": "/uploads/post-images/1693891234567-cover.jpg",
        "width": 1200,
        "height": 800
      },
      "likes": [],
      "viewCount": 5,
      "likeCount": 0,
      "createdAt": "2023-09-04T10:30:45.123Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

### 3. Get Post by ID
**GET** `/api/posts/:id`

**Auth Required:** No

**Example using curl:**
```bash
curl "http://localhost:5000/api/posts/64f5a1b2c3d4e5f6a7b8c9d1"
```

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "author": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "firstname": "John",
    "lastname": "Doe",
    "username": "johndoe",
    "profilePicture": "/uploads/profile-pictures/1693891234567-image.jpg"
  },
  "coverImage": {
    "filename": "1693891234567-cover.jpg",
    "url": "/uploads/post-images/1693891234567-cover.jpg",
    "width": 1200,
    "height": 800
  },
  "likes": [
    {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d2",
      "firstname": "Jane",
      "lastname": "Smith",
      "username": "janesmith"
    }
  ],
  "viewCount": 6,
  "likeCount": 1,
  "tags": ["technology", "programming"],
  "createdAt": "2023-09-04T10:30:45.123Z",
  "updatedAt": "2023-09-04T10:30:45.123Z"
}
```

### 4. Update Post
**PUT** `/api/posts/:id`

**Auth Required:** Yes (Author or Admin only)

**Content-Type:** `multipart/form-data`

**Body:**
```javascript
{
  "title": "Updated Blog Post Title", // Optional
  "content": "Updated content...", // Optional
  "coverImage": <file> // Optional - new cover image
}
```

**Example using curl:**
```bash
curl -X PUT http://localhost:5000/api/posts/64f5a1b2c3d4e5f6a7b8c9d1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Updated Blog Post Title" \
  -F "content=Updated content..." \
  -F "coverImage=@/path/to/new-cover.jpg"
```

### 5. Delete Post
**DELETE** `/api/posts/:id`

**Auth Required:** Yes (Author or Admin only)

**Example using curl:**
```bash
curl -X DELETE http://localhost:5000/api/posts/64f5a1b2c3d4e5f6a7b8c9d1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

### 6. Toggle Like/Unlike Post
**POST** `/api/posts/:id/like`

**Auth Required:** Yes

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/posts/64f5a1b2c3d4e5f6a7b8c9d1/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "message": "Post liked",
  "post": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "title": "My First Blog Post",
    "likes": ["64f5a1b2c3d4e5f6a7b8c9d0"],
    "likeCount": 1
  },
  "isLiked": true
}
```

### 7. Search Posts
**GET** `/api/posts/search`

**Auth Required:** No

**Query Parameters:**
- `query` (optional): Search text
- `author` (optional): Author ID
- `tags` (optional): Comma-separated tags
- `sort` (optional): `latest`, `oldest`, `most_viewed`, `most_liked`, `relevance`
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example using curl:**
```bash
curl "http://localhost:5000/api/posts/search?query=technology&tags=programming,javascript&sort=relevance&page=1&limit=5"
```

---

## 👤 User Endpoints

### 1. Get User Profile
**GET** `/api/user/profile`

**Auth Required:** Yes

**Example using curl:**
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
  "firstname": "John",
  "lastname": "Doe",
  "datathOfBirth": "1990-01-01T00:00:00.000Z",
  "profilePicture": "/uploads/profile-pictures/1693891234567-image.jpg",
  "profileImage": {
    "filename": "1693891234567-image.jpg",
    "url": "/uploads/profile-pictures/1693891234567-image.jpg",
    "width": 400,
    "height": 400
  },
  "username": "johndoe",
  "email": "john@example.com",
  "role": "author",
  "createdAt": "2023-09-04T10:00:00.000Z",
  "updatedAt": "2023-09-04T10:30:45.123Z"
}
```

### 2. Get User Posts
**GET** `/api/user/posts`

**Auth Required:** Yes

**Example using curl:**
```bash
curl -X GET http://localhost:5000/api/user/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "title": "My First Blog Post",
    "content": "This is the content...",
    "coverImage": {
      "url": "/uploads/post-images/1693891234567-cover.jpg"
    },
    "author": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "firstname": "John",
      "lastname": "Doe",
      "username": "johndoe",
      "profilePicture": "/uploads/profile-pictures/1693891234567-image.jpg"
    },
    "likeCount": 5,
    "viewCount": 25,
    "createdAt": "2023-09-04T10:30:45.123Z"
  }
]
```

### 3. Update Profile
**PUT** `/api/user/profile`

**Auth Required:** Yes

**Content-Type:** `multipart/form-data`

**Body:**
```javascript
{
  "firstname": "John", // Optional
  "lastname": "Doe", // Optional
  "datathOfBirth": "1990-01-01", // Optional
  "username": "johndoe", // Optional
  "profilePicture": <file> // Optional - new profile picture
}
```

**Example using curl:**
```bash
curl -X PUT http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "firstname=John" \
  -F "lastname=Doe" \
  -F "username=johndoe_updated" \
  -F "profilePicture=@/path/to/new-profile.jpg"
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "firstname": "John",
    "lastname": "Doe",
    "username": "johndoe_updated",
    "email": "john@example.com",
    "profilePicture": "/uploads/profile-pictures/1693891234567-new-profile.jpg",
    "role": "author"
  }
}
```

### 4. Update Password
**PUT** `/api/user/password`

**Auth Required:** Yes

**Content-Type:** `application/json`

**Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Example using curl:**
```bash
curl -X PUT http://localhost:5000/api/user/password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

---

## 📁 Static File Access

### Access Uploaded Images
**GET** `/uploads/{folder}/{filename}`

**Examples:**
```bash
# Post cover images
http://localhost:5000/uploads/post-images/1693891234567-cover.jpg

# Profile pictures
http://localhost:5000/uploads/profile-pictures/1693891234567-profile.jpg
```

---

## 🔧 Testing with Postman

### 1. Environment Variables
Create a Postman environment with:
```
BASE_URL: http://localhost:5000
JWT_TOKEN: (will be set after login)
```

### 2. Authentication Flow
1. **Register**: Use form-data with image file
2. **Login**: Use raw JSON, save token to environment
3. **Protected Routes**: Use Bearer token from environment

### 3. File Upload Tests
- Use **form-data** for endpoints with file uploads
- Set file type for image fields
- Include other form fields as text

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Title and content are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "error": "Only authors or admins can create posts"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Post creation failed"
}
```

---

## 🚀 Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "Testing Blog API..."

# 1. Register user
echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -F "firstname=Test" \
  -F "lastname=User" \
  -F "datathOfBirth=1990-01-01" \
  -F "username=testuser" \
  -F "email=test@example.com" \
  -F "password=password123")

echo "Register Response: $REGISTER_RESPONSE"

# 2. Login user
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Login Response: $LOGIN_RESPONSE"
echo "Token: $TOKEN"

# 3. Get all posts
echo "3. Getting all posts..."
curl -s "$BASE_URL/api/posts/all" | head -200

echo "API test completed!"
```

Run with: `chmod +x test-api.sh && ./test-api.sh`

---

## 📋 Data Models

### User Model
```javascript
{
  firstname: String (required),
  lastname: String (required),
  datathOfBirth: Date (required),
  profilePicture: String (URL),
  profileImage: {
    filename: String,
    url: String,
    path: String,
    width: Number,
    height: Number,
    format: String,
    size: Number,
    mimetype: String
  },
  username: String (required, unique),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ["admin", "author", "reader"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  title: String (required),
  content: String (required),
  author: ObjectId (required, ref: User),
  coverImage: {
    filename: String (required),
    originalName: String (required),
    url: String (required),
    path: String (required),
    width: Number,
    height: Number,
    format: String,
    size: Number,
    mimetype: String
  },
  likes: [ObjectId] (ref: User),
  viewCount: Number (default: 0),
  tags: [String],
  likeCount: Number (virtual),
  createdAt: Date,
  updatedAt: Date
}
```
