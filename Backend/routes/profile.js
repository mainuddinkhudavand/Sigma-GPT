import express from "express";
import UserProfile from "../models/UserProfile.js";

const router = express.Router();

// Get profile
router.get("/profile", async (req, res) => {
    try {
        let profile = await UserProfile.findOne({});
        if (!profile) {
            profile = new UserProfile({
                username: "Explorer",
                email: "",
                bio: "Exploring the AI cosmos with SigmaGPT.",
                avatarColor: "#339cff"
            });
            await profile.save();
        }
        res.json(profile);
    } catch (err) {
        console.error("Failed to fetch profile:", err);
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
});

// Update profile
router.put("/profile", async (req, res) => {
    const { username, email, bio, avatarColor } = req.body;
    try {
        let profile = await UserProfile.findOne({});
        if (!profile) {
            profile = new UserProfile({ username, email, bio, avatarColor });
        } else {
            if (username !== undefined) profile.username = username;
            if (email !== undefined) profile.email = email;
            if (bio !== undefined) profile.bio = bio;
            if (avatarColor !== undefined) profile.avatarColor = avatarColor;
        }
        await profile.save();
        res.json({ success: "Profile updated successfully", profile });
    } catch (err) {
        console.error("Failed to update profile:", err);
        res.status(500).json({ error: "Failed to update user profile" });
    }
});

export default router;
