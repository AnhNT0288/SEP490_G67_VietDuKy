import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";
import {GrView} from "react-icons/gr";

// eslint-disable-next-line react/prop-types
export default function DropdownMenuTopic({ postId, onDeleteArticle, onEditArticle, isOpen, setOpenDropdown }) {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-container")) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [setOpenDropdown]);

    return (
        <div
            className="relative dropdown-container flex items-center gap-2 justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            <button onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(prev => (prev === postId ? null : postId));
                }}
                className="p-2"
            >
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                    {/* Xem danh sách tour của chủ đề */}
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <GrView className="mr-2 text-gray-700" />
                        Xem bài viết
                    </button>

                    {/* Cập nhật Chủ đề */}
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <MdEdit className="mr-2 text-gray-700" />
                        Cập nhật bài viết
                    </button>

                    {/* Xóa Chủ đề */}
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                    >
                        <MdDelete className="mr-2" />
                        Xóa bài viết
                    </button>
                </div>
            )}

        </div>
    );
}
