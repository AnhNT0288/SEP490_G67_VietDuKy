import {FaTrash, FaUserPlus, FaUsers} from "react-icons/fa";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {useEffect, useState} from "react";

// eslint-disable-next-line react/prop-types
export default function DropdownGuideActions({ guide, tourId, isOpen, setOpenDropdown, onAssignPassenger, onViewPassengers, onDeleteGuide }) {
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
                    setOpenDropdown((prev) => (prev === guide.id ? null : guide.id));
                }}
                className="p-2"
            >
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onAssignPassenger(guide);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <FaUserPlus className="mr-2" />
                        Gán KH
                    </button>
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onViewPassengers(guide);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <FaUsers className="mr-2" />
                        Xem KH đã gán
                    </button>
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onDeleteGuide({
                                travel_guide_id: guide.id,
                                travel_tour_id: tourId,
                            });
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                    >
                        <FaTrash className="mr-2" />
                        Xóa
                    </button>

                </div>
            )}
        </div>
    );
}
