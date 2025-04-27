import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";

// eslint-disable-next-line react/prop-types
export default function DropdownHotel({ hotelId, onEditHotel, onDeleteHotel, isOpen, setOpenDropdown }) {
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
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(prev => (prev === hotelId ? null : hotelId));
                }}
                className="p-2"
            >
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-10">
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onEditHotel(); // Gọi hàm cập nhật khách sạn
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <MdEdit className="mr-2 text-gray-700" />
                        Cập nhật
                    </button>

                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onDeleteHotel(); // Gọi hàm xoá khách sạn
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                    >
                        <MdDelete className="mr-2" />
                        Xóa
                    </button>
                </div>
            )}
        </div>
    );
}
