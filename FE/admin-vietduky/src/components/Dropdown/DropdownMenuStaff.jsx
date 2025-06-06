import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import {MdOutlineAddLocationAlt} from "react-icons/md";
import {CiBoxList} from "react-icons/ci";

// eslint-disable-next-line react/prop-types
export default function DropdownMenuStaff({ staff, onAddGuide, onViewGuides, isOpen, setOpenDropdown, onAssignLocation, onViewLocations }) {
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
                    setOpenDropdown(prev => (prev === staff.id ? null : staff.id));
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
                            onAssignLocation(staff);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <MdOutlineAddLocationAlt className="mr-2" />
                        Gán địa điểm
                    </button>
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onViewLocations(staff);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <CiBoxList className="mr-2" />
                        Xem địa điểm đã gán
                    </button>
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onAddGuide(staff);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <FaUserPlus className="mr-2" /> Thêm hướng dẫn viên
                    </button>
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onViewGuides(staff);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <FaUsers className="mr-2" />
                        Xem danh sách hướng dẫn viên
                    </button>
                </div>
            )}
        </div>
    );
}
