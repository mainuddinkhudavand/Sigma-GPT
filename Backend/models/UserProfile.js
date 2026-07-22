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
    bio: {
        type: String,
        default: ""
    },
    avatarColor: {
        type: String,
        default: "#339cff"
    },
    plan: {
        type: String,
        default: "Free"
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("UserProfile", UserProfileSchema);

