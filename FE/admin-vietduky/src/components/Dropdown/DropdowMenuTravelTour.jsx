// components/DropdownMenuTravelTour.jsx
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import {FaRegMap} from "react-icons/fa";

// eslint-disable-next-line react/prop-types
export default function DropdownMenuTravelTour({ onDelete, onEdit, onLock, onAssignGuide  }) {
    return (
        <div style={{
            position: "absolute",
            right: 0,
            marginTop: "8px",
            width: "12rem",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.375rem",
            zIndex: 9999,
        }}>
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
                onClick={onDelete}
                className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600 whitespace-nowrap"
            >
                <MdDelete className="mr-2" /> Xóa hành trình
            </button>
        </div>
    );
}
