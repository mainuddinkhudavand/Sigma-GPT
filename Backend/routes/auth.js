import express from "express";
import UserProfile from "../models/UserProfile.js";

const router = express.Router();

// Register new user account
router.post("/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required." });
        }

        const existingUser = await UserProfile.findOne({ email: email.toLowerCase() });
        if (existingUser && existingUser.password) {
            return res.status(400).json({ error: "An account with this email already exists. Please sign in." });
        }

        let profile = await UserProfile.findOne({});
        if (!profile || (profile.email && profile.email.toLowerCase() !== email.toLowerCase())) {
            profile = new UserProfile({
                username,
                email: email.toLowerCase(),
                password,
                bio: "Exploring the AI cosmos with SigmaGPT.",
                avatarColor: "#339cff",
                avatarIcon: "fa-robot",
                plan: "Free",
                isLoggedIn: true
            });
        } else {
            profile.username = username;
            profile.email = email.toLowerCase();
            profile.password = password;
            profile.isLoggedIn = true;
        }

        await profile.save();
        res.json({
            message: "Account created successfully!",
            user: {
                username: profile.username,
                email: profile.email,
                bio: profile.bio,
                avatarColor: profile.avatarColor,
                avatarIcon: profile.avatarIcon,
                plan: profile.plan,
                credits: profile.credits,
                isLoggedIn: profile.isLoggedIn
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Registration failed. Server error." });
    }
});

// Login existing user
router.post("/auth/login", async (req, res) => {
    try {
        const { emailOrName, password } = req.body;
        if (!emailOrName) {
            return res.status(400).json({ error: "Please enter your email or display name." });
        }

        let profile = await UserProfile.findOne({
            $or: [
                { email: emailOrName.toLowerCase() },
                { username: emailOrName }
            ]
        });

        if (!profile) {
            // Create a guest/demo account or new profile if matching none
            profile = await UserProfile.findOne({});
            if (!profile) {
                profile = new UserProfile({
                    username: emailOrName,
                    email: emailOrName.includes("@") ? emailOrName : `${emailOrName.toLowerCase()}@sigmagpt.ai`,
                    password: password || "",
                    isLoggedIn: true
                });
            } else {
                profile.username = emailOrName;
                if (emailOrName.includes("@")) profile.email = emailOrName;
                if (password) profile.password = password;
                profile.isLoggedIn = true;
            }
        } else {
            if (profile.password && password && profile.password !== password) {
                return res.status(401).json({ error: "Incorrect password. Please try again." });
            }
            profile.isLoggedIn = true;
        }

        await profile.save();
        res.json({
            message: "Login successful!",
            user: {
                username: profile.username,
                email: profile.email,
                bio: profile.bio,
                avatarColor: profile.avatarColor,
                avatarIcon: profile.avatarIcon,
                plan: profile.plan,
                credits: profile.credits,
                isLoggedIn: profile.isLoggedIn
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed. Server error." });
    }
});

// Logout
router.post("/auth/logout", async (req, res) => {
    try {
        let profile = await UserProfile.findOne({});
        if (profile) {
            profile.isLoggedIn = false;
            await profile.save();
        }
        res.json({ message: "Logged out successfully." });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Logout failed." });
    }
});

export default router;
