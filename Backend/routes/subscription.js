import express from "express";
import UserProfile from "../models/UserProfile.js";

const router = express.Router();

// Process plan upgrade & simulated payment checkout
router.post("/subscription/checkout", async (req, res) => {
    try {
        const { planId, billingCycle, paymentMethod, cardDetails } = req.body;

        if (!planId) {
            return res.status(400).json({ error: "Plan ID is required for checkout." });
        }

        let profile = await UserProfile.findOne({});
        if (!profile) {
            profile = new UserProfile({});
        }

        // Determine price
        let amount = 0;
        if (planId.toLowerCase() === "pro") {
            amount = billingCycle === "annual" ? 180 : 19;
        } else if (planId.toLowerCase() === "enterprise") {
            amount = billingCycle === "annual" ? 470 : 49;
        }

        const transaction = {
            id: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
            planName: planId,
            amount: amount,
            paymentMethod: paymentMethod || "Credit Card",
            date: new Date()
        };

        profile.plan = planId;
        profile.planBillingCycle = billingCycle || "monthly";
        profile.credits = planId.toLowerCase() === "enterprise" ? 99999 : planId.toLowerCase() === "pro" ? 5000 : 50;
        profile.transactions.push(transaction);

        await profile.save();

        res.json({
            message: `Successfully upgraded to ${planId} plan!`,
            profile: {
                plan: profile.plan,
                planBillingCycle: profile.planBillingCycle,
                credits: profile.credits,
                transactions: profile.transactions
            },
            receipt: transaction
        });
    } catch (err) {
        console.error("Subscription checkout error:", err);
        res.status(500).json({ error: "Payment checkout failed. Server error." });
    }
});

// Get user subscription status and billing history
router.get("/subscription/status", async (req, res) => {
    try {
        let profile = await UserProfile.findOne({});
        if (!profile) {
            profile = new UserProfile({});
            await profile.save();
        }

        res.json({
            plan: profile.plan,
            planBillingCycle: profile.planBillingCycle,
            credits: profile.credits,
            transactions: profile.transactions
        });
    } catch (err) {
        console.error("Fetch subscription error:", err);
        res.status(500).json({ error: "Failed to fetch subscription status." });
    }
});

export default router;
