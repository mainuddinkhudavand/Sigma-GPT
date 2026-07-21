import mongoose from "mongoose";

const SearchHistorySchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("SearchHistory", SearchHistorySchema);
