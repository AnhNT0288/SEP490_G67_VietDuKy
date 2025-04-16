import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import {CiBoxList} from "react-icons/ci";

export default function DropdownMenuTopic({topic, onAddTourToTopic, onDeleteTopic, onEditTopic, isOpen, setOpenDropdown,onViewTours}) {
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

            <button onClick={() => setOpenDropdown(isOpen ? null : topic.id)} className="p-2">
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                    {/* Xem danh sách tour của chủ đề */}
                    <button
                        onClick={() => {
                            onViewTours(topic);
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <CiBoxList className="mr-2 text-gray-700" />
                        Xem Tour của Chủ đề
                    </button>

                    {/* Thêm Tour vào Chủ đề */}
                    <button
                        onClick={() => {
                            onAddTourToTopic(topic);
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <IoAddCircleOutline className="mr-2 text-gray-700" />
                        Thêm Tour vào Chủ đề
                    </button>

                    {/* Cập nhật Chủ đề */}
                    <button
                        onClick={() => {
                            onEditTopic(topic);
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <MdEdit className="mr-2 text-gray-700" />
                        Cập nhật Chủ đề
                    </button>

                    {/* Xóa Chủ đề */}
                    <button
                        onClick={() => {
                            onDeleteTopic(topic.id);
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                    >
                        <MdDelete className="mr-2" />
                        Xóa Chủ đề
                    </button>
                </div>
            )}

        </div>
    );
}
