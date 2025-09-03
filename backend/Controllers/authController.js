const { User } = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { deleteImage } = require("../Middleware/upload");

const registerUser = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (user) return res.status(400).send("User already registered");

        // Handle local profile image
        let profilePicture = req.body.profilePicture;
        let profileImage = null;

        if (req.localProfile) {
            profileImage = req.localProfile;
            profilePicture = req.localProfile.url;
            console.log("Profile picture successfully processed:", profilePicture);
        } else {
            console.log("No local profile image found in request");
            // Use default profile picture if none provided
            profilePicture = "https://images.unsplash.com/photo-1615911907304-d418c903b058?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        }

        console.log("Profile Picture URL: ", profilePicture);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await new User({
            ...req.body,
            profilePicture: profilePicture,
            profileImage: profileImage,
            password: hashedPassword
        }).save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                role: newUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json("Invalid email or password");

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).json("Invalid email or password");

        const token = jwt.sign(
            { id: user._id, role: "author" },
            process.env.JWT_SECRET,
            { expiresIn: "10h" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                dateOfBirth: user.dateOfBirth,
                profilePicture: user.profilePicture,
                profileImage: user.profileImage,
                username: user.username,
                email: user.email,
                role: "author"
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    registerUser,
    loginUser
};
