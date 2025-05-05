import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { FaRegMap } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
export default function DropdownMenuTravelTour({ onDelete, onEdit, onLock, onAssignGuide }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleConfirmDelete = () => {
        setIsConfirmOpen(true);
    };

    const handleDelete = () => {
        onDelete();
        setIsConfirmOpen(false);
    };

    return (
        <div className="relative z-50">
            {/* Dropdown menu */}
            <div
                className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10"
            >
                <button
                    onClick={onEdit}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left whitespace-nowrap"
                >
                    <MdEdit className="mr-2 text-gray-700" /> Cập nhật hành trình
                </button>
                <button
                    onClick={onAssignGuide}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left whitespace-nowrap"
                >
                    <FaRegMap className="mr-2 text-gray-700" /> Gán hướng dẫn viên
                </button>
                <button
                    onClick={onLock}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                    <IoIosLock className="mr-2 text-gray-700" />
                    Đóng lịch khởi hành
                </button>
                <button
                    onClick={handleConfirmDelete}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600 whitespace-nowrap"
                >
                    <MdDelete className="mr-2" /> Xóa hành trình
                </button>
            </div>

            {/* Modal xác nhận xoá */}
            {isConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] animate-fade-in">
                        <h3 className="text-lg font-semibold text-center mb-2">Xác nhận xoá</h3>
                        <p className="text-sm text-gray-600 text-center mb-6">
                            Bạn có chắc chắn muốn xoá hành trình này không?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                                onClick={handleDelete}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
