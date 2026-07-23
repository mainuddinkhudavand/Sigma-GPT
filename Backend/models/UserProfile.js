import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema({
    username: {
        type: String,
        default: "Explorer"
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "Exploring the AI cosmos with SigmaGPT."
    },
    avatarColor: {
        type: String,
        default: "#339cff"
    },
    avatarIcon: {
        type: String,
        default: "fa-robot"
    },
    plan: {
        type: String,
        default: "Free"
    },
    planBillingCycle: {
        type: String,
        default: "monthly"
    },
    credits: {
        type: Number,
        default: 50
    },
    transactions: [
        {
            id: String,
            planName: String,
            amount: Number,
            paymentMethod: String,
            date: { type: Date, default: Date.now }
        }
    ],
    isLoggedIn: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("UserProfile", UserProfileSchema);


