import { useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";

// eslint-disable-next-line react/prop-types
export default function DropdownMenuService({ serviceId, onEditService, onDeleteService, isOpen, setOpenDropdown }) {
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
        <div className="relative dropdown-container flex items-center justify-end">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown((prev) => (prev === serviceId ? null : serviceId));
                }}
                className="p-2"
            >
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-10">
                    {/* Cập nhật dịch vụ */}
                    <button
                        onClick={() => {
                            onEditService(serviceId);
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <MdEdit className="mr-2 text-gray-700" />
                        Cập nhật
                    </button>

                    {/* Xóa dịch vụ */}
                    <button
                        onClick={() => {
                            onDeleteService(serviceId);
                            setOpenDropdown(null);
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
