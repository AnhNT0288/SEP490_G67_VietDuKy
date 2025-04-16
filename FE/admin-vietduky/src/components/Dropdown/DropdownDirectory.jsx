import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";

export default function DropdownMenuDirectory({
                                                  directoryId,
                                                  onEdit,
                                                  onDelete,
                                                  isOpen,
                                                  setOpenDropdown,
                                              }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [setOpenDropdown]);

    return (
        <div
            className="relative flex items-center gap-2 justify-end"
            ref={dropdownRef}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown((prev) =>
                        prev === directoryId ? null : directoryId
                    );
                }}
                className="p-2"
            >
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                    {/* Cập nhật danh mục */}
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onEdit?.();
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <MdEdit className="mr-2 text-gray-700" />
                        Cập nhật danh mục
                    </button>

                    {/* Xóa danh mục */}
                    <button
                        onClick={() => {
                            setOpenDropdown(null);
                            onDelete?.();
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                    >
                        <MdDelete className="mr-2" />
                        Xóa danh mục
                    </button>
                </div>
            )}
        </div>
    );
}
