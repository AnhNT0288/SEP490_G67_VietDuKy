import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
export default function DropdownRequest({requestId, onApprove, onReject, isOpen, setOpenDropdown,}) {
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
                    setOpenDropdown((prev) => (prev === requestId ? null : requestId));
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
                            onApprove();
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-green-600"
                    >
                        <FaCheck className="mr-2" />
                        Chấp nhận
                    </button>

                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onReject();
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                    >
                        <FaTimes className="mr-2" />
                        Từ chối
                    </button>
                </div>
            )}
        </div>
    );
}
