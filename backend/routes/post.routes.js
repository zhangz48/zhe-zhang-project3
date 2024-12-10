import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    createPost,
    deletePost,
    getAllPosts,
    getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);

export default router;