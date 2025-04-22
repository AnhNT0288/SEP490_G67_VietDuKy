import { useState, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaUserPlus, FaUsers } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
export default function DropdownAssignTravelGuide({ travelTour, isOpen, setOpenDropdown, onAssignGuide, onViewGuides }) {
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
                    setOpenDropdown((prev) => (prev === travelTour.id ? null : travelTour.id));
                }}
                className="p-2"
            >
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-md rounded-md z-10">
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onAssignGuide(travelTour); // Gọi hàm mở modal
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <FaUserPlus className="mr-2" />
                        Gán hướng dẫn viên
                    </button>
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onViewGuides(travelTour);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <FaUsers className="mr-2" />
                        Xem hướng dẫn viên đã gán
                    </button>
                </div>
            )}
        </div>
    );
}
