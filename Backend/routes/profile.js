import express from "express";
import UserProfile from "../models/UserProfile.js";

const router = express.Router();

// Get profile
router.get("/profile", async (req, res) => {
    try {
        let profile = await UserProfile.findOne({});
        if (!profile) {
            profile = new UserProfile({
                username: "Alex Rivera",
                email: "alex@sigmagpt.ai",
                bio: "Exploring the AI cosmos with SigmaGPT.",
                avatarColor: "#339cff",
                avatarIcon: "fa-robot",
                plan: "Free",
                isLoggedIn: true
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
    const { username, email, bio, avatarColor, avatarIcon, plan, planBillingCycle, isLoggedIn } = req.body;
    try {
        let profile = await UserProfile.findOne({});
        if (!profile) {
            profile = new UserProfile({ username, email, bio, avatarColor, avatarIcon, plan, planBillingCycle, isLoggedIn });
        } else {
            if (username !== undefined) profile.username = username;
            if (email !== undefined) profile.email = email;
            if (bio !== undefined) profile.bio = bio;
            if (avatarColor !== undefined) profile.avatarColor = avatarColor;
            if (avatarIcon !== undefined) profile.avatarIcon = avatarIcon;
            if (plan !== undefined) profile.plan = plan;
            if (planBillingCycle !== undefined) profile.planBillingCycle = planBillingCycle;
            if (isLoggedIn !== undefined) profile.isLoggedIn = isLoggedIn;
        }
        await profile.save();
        res.json({ success: "Profile updated successfully", profile });
    } catch (err) {
        console.error("Failed to update profile:", err);
        res.status(500).json({ error: "Failed to update user profile" });
    }
});

export default router;

