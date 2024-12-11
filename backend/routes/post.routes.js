import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

// Public route for fetching all posts
router.get("/all", getAllPosts);

// Protected route for fetching a user's posts
router.get("/user/:username", protectRoute, getUserPosts);

// Protected route for creating a post
router.post("/create", protectRoute, createPost);

// Protected route for updating a post
router.put("/:id", protectRoute, updatePost);

// Protected route for deleting a post
router.delete("/:id", protectRoute, deletePost);

export default router;