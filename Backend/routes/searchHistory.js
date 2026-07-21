import express from "express";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();

// Get all search history
router.get("/search-history", async (req, res) => {
    try {
        const history = await SearchHistory.find({}).sort({ timestamp: -1 }).limit(50);
        res.json(history);
    } catch (err) {
        console.error("Failed to fetch search history:", err);
        res.status(500).json({ error: "Failed to fetch search history" });
    }
});

// Add new search query log
router.post("/search-history", async (req, res) => {
    const { query } = req.body;
    if (!query || !query.trim()) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        const trimmedQuery = query.trim();
        // Delete existing item if duplicate to move to top
        await SearchHistory.deleteMany({ query: trimmedQuery });
        
        const newLog = new SearchHistory({ query: trimmedQuery });
        await newLog.save();
        res.status(201).json(newLog);
    } catch (err) {
        console.error("Failed to save search query:", err);
        res.status(500).json({ error: "Failed to save search query" });
    }
});

// Delete single search history item
router.delete("/search-history/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await SearchHistory.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Search item not found" });
        }
        res.json({ success: "Search item deleted successfully" });
    } catch (err) {
        console.error("Failed to delete search item:", err);
        res.status(500).json({ error: "Failed to delete search item" });
    }
});

// Clear all search history
router.delete("/search-history", async (req, res) => {
    try {
        await SearchHistory.deleteMany({});
        res.json({ success: "All search history cleared" });
    } catch (err) {
        console.error("Failed to clear search history:", err);
        res.status(500).json({ error: "Failed to clear search history" });
    }
});

export default router;
