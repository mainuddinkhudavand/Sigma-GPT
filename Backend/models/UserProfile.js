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
    }
}, {
    timestamps: true
});

export default mongoose.model("UserProfile", UserProfileSchema);
