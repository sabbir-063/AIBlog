const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
// Add this near the top of your file
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'; // Use environment variable or default
// Create uploads directories if they don't exist
const createUploadDirs = () => {
    const dirs = [
        'uploads',
        'uploads/post-images',
        'uploads/profile-pictures',
        'temp-uploads'
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });
};

// Generate unique filename
const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1E9);
    const ext = path.extname(originalName);
    return `${timestamp}-${randomNum}${ext}`;
};

// Configure multer for temporary storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = 'temp-uploads';
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = generateUniqueFilename(file.originalname);
        cb(null, uniqueName);
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10 // Maximum 10 files
    }
});

// Process and save single image with optimization
const processAndSaveImage = async (file, folder = 'post-images') => {
    try {
        createUploadDirs();

        if (!file) {
            throw new Error('No file provided');
        }

        if (!file.originalname) {
            throw new Error('File missing originalname property');
        }

        console.log(`Processing ${folder} image:`, file.originalname);

        const filename = generateUniqueFilename(file.originalname);
        const uploadPath = path.join('uploads', folder);

        // Ensure the specific folder exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log(`Created directory: ${uploadPath}`);
        }

        const filePath = path.join(uploadPath, filename);
        const webPath = `/uploads/${folder}/${filename}`;
        const fullUrl = `${BASE_URL}${webPath}`;
        // Read the uploaded file
        let imageBuffer;
        if (file.buffer) {
            imageBuffer = file.buffer;
        } else if (file.path) {
            if (!fs.existsSync(file.path)) {
                throw new Error(`File not found at path: ${file.path}`);
            }
            imageBuffer = fs.readFileSync(file.path);
        } else {
            throw new Error('No file data found (neither buffer nor path)');
        }

        console.log(`Processing image with Sharp. Size: ${imageBuffer.length} bytes`);

        // Process image with Sharp for optimization
        const processedBuffer = await sharp(imageBuffer)
            .resize(1200, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({
                quality: 85,
                progressive: true
            })
            .toBuffer();

        console.log(`Image processed. Size after processing: ${processedBuffer.length} bytes`);

        // Get image metadata
        const metadata = await sharp(processedBuffer).metadata();

        // Save the processed image
        fs.writeFileSync(filePath, processedBuffer);
        console.log(`Saved processed image to: ${filePath}`);

        // Clean up temporary file if it exists
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`Cleaned up temporary file: ${file.path}`);
        }

        return {
            filename: filename,
            originalName: file.originalname,
            url: fullUrl,
            path: filePath,
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: processedBuffer.length,
            mimetype: file.mimetype
        };
    } catch (error) {
        console.error("Image processing error:", error);
        // Clean up temporary file on error
        if (file && file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw new Error(`Image processing failed: ${error.message}`);
    }
};

// Delete single image file
const deleteImage = async (imagePath) => {
    try {
        // Handle both full paths and web paths
        let fullPath = imagePath;
        if (imagePath.startsWith('/uploads/')) {
            fullPath = imagePath.substring(1); // Remove leading slash
        }

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            return { success: true, message: 'Image deleted successfully' };
        } else {
            return { success: false, message: 'Image file not found' };
        }
    } catch (error) {
        throw new Error(`Image deletion failed: ${error.message}`);
    }
};

// Middleware to process and save single post image to local storage
const uploadPostImageLocal = async (req, res, next) => {
    try {
        // Create upload directories first
        createUploadDirs();

        console.log('Request body:', req.body);
        console.log('Request file details:', req.file ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        } : 'No file in request');

        if (!req.file) {
            console.log('No file uploaded for post');
            return next();
        }

        // Validate file exists
        if (!fs.existsSync(req.file.path)) {
            console.error(`File not found at path: ${req.file.path}`);
            return res.status(500).json({ error: 'Uploaded file not found on server' });
        }

        console.log('Processing uploaded post image:', req.file.originalname);

        // Process file and save to local storage
        const result = await processAndSaveImage(req.file, 'post-images');

        console.log('Image processed successfully:', result.url);

        // Store local upload data in request
        req.localImage = {
            filename: result.filename,
            originalName: result.originalName,
            url: result.url,
            path: result.path,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.size,
            mimetype: result.mimetype
        };

        next();
    } catch (error) {
        console.error('Error processing post image:', error);
        // Clean up temporary file on error
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
                console.log(`Cleaned up temporary file: ${req.file.path}`);
            } catch (cleanupError) {
                console.error('Error cleaning up temporary file:', cleanupError);
            }
        }
        return res.status(500).json({ error: `Image upload failed: ${error.message}` });
    }
};

// Middleware to handle profile picture uploads
const uploadProfilePictureLocal = async (req, res, next) => {
    try {
        // Create upload directories first
        createUploadDirs();

        if (!req.file) {
            console.log('No profile picture uploaded');
            return next();
        }

        console.log('Processing uploaded profile picture:', req.file.originalname);

        // Process profile picture and save to local storage
        const result = await processAndSaveImage(req.file, 'profile-pictures');

        console.log('Profile picture processed successfully:', result.url);

        req.localProfile = {
            filename: result.filename,
            originalName: result.originalName,
            url: result.url,
            path: result.path,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.size,
            mimetype: result.mimetype
        };

        next();
    } catch (error) {
        console.error('Error processing profile picture:', error);
        // Clean up temporary file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: `Profile picture upload failed: ${error.message}` });
    }
};

module.exports = {
    upload,
    uploadPostImageLocal,
    uploadProfilePictureLocal,
    deleteImage,
    processAndSaveImage,
    createUploadDirs
};
