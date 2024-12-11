import { FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();
    const postOwner = post.user;

    const isMyPost = authUser && authUser._id === post.user._id;
    const formattedDate = formatPostDate(post.createdAt);

    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(post.text);
    const [editedImg, setEditedImg] = useState(post.img);
    const imgRef = useRef(null);

    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Something went wrong");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Post deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const { mutate: updatePost, isPending: isUpdating } = useMutation({
        mutationFn: async ({ text, img }) => {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, img }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update post");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Post updated successfully");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            setIsEditing(false);
        },
    });

    const handleDeletePost = () => deletePost();

    const handleEditSubmit = (e) => {
        e.preventDefault();
    
        const payload = {
            text: editedText, // Include updated text
            deleteImg: editedImg === null && post.img !== null, // Set deleteImg flag if image is removed
        };
    
        // Add the new image only if it has been changed
        if (editedImg && editedImg !== post.img) {
            payload.img = editedImg;
        }
    
        console.log("Payload being sent to backend:", payload); // Debug log to verify payload structure
        updatePost(payload);
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setEditedImg(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
            <div className='avatar'>
                <Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
                    <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
                </Link>
            </div>
            <div className='flex flex-col flex-1'>
                <div className='flex gap-2 items-center'>
                    <Link to={`/profile/${postOwner.username}`} className='font-bold'>
                        {postOwner.fullName}
                    </Link>
                    <span className='text-gray-700 flex gap-1 text-sm'>
                        <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                        <span>·</span>
                        <span>{formattedDate}</span>
                    </span>
                    {isMyPost && (
                        <span className='flex gap-2 ml-auto'>
                            {!isDeleting && (
                                <FaEdit
                                    className='cursor-pointer hover:text-blue-500'
                                    onClick={() => setIsEditing((prev) => !prev)}
                                />
                            )}
                            {!isDeleting && (
                                <FaTrash
                                    className='cursor-pointer hover:text-red-500'
                                    onClick={handleDeletePost}
                                />
                            )}
                            {(isDeleting || isUpdating) && <LoadingSpinner size='sm' />}
                        </span>
                    )}
                </div>
                {isEditing ? (
                    <form onSubmit={handleEditSubmit} className='flex flex-col gap-3'>
                        <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800'
                        />
                        {editedImg && (
                            <div className='relative w-72 mx-auto'>
                                <IoCloseSharp
                                    className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
                                    onClick={() => {
                                        setEditedImg(null);
                                        imgRef.current.value = null;
                                        console.log("Image removed from frontend, editedImg set to null");
                                    }}
                                />
                                <img src={editedImg} className='w-full mx-auto h-72 object-contain rounded' />
                            </div>
                        )}
                        <div className='flex justify-between border-t py-2 border-t-gray-700'>
                            <CiImageOn
                                className='fill-primary w-6 h-6 cursor-pointer'
                                onClick={() => imgRef.current.click()}
                            />
                            <input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
                            <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                                {isUpdating ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className='flex flex-col gap-3 overflow-hidden'>
                        <span>{post.text}</span>
                        {post.img && (
                            <img
                                src={post.img}
                                className='h-80 object-contain rounded-lg border border-gray-700'
                                alt=''
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Post;