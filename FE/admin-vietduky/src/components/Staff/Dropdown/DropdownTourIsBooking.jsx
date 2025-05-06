import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {FaUserPlus, FaUsers, FaConciergeBell, FaFileImport} from "react-icons/fa";
import {cancelTravelTour} from "@/services/API/travel_tour.service.js";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function DropdownTourIsBooking({ travelTour, isOpen, setOpenDropdown, onAssignGuide, onViewGuides, onAssignService, onMarkAssigned, onImportPassengers, onCanceled }) {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const widthDropdown = 224;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-button")) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [setOpenDropdown]);

    const handleButtonClick = (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
            top: rect.bottom + window.scrollY,
            left: rect.right + window.scrollX - widthDropdown,
        });
        setOpenDropdown((prev) => (prev === travelTour.id ? null : travelTour.id));
    };

    const handleCancelTour = async () => {
        const confirm = window.confirm("Bạn có chắc chắn muốn huỷ tour này không?");
        if (!confirm) return;

        try {
            await cancelTravelTour(travelTour.id);
            setOpenDropdown(null);
            toast.success("Tour đã được huỷ thành công!");

            // Gọi lại danh sách tour từ màn cha nếu truyền vào props:
            if (typeof travelTour.onCanceled === "function") {
                travelTour.onCanceled(); // gọi callback nếu có
            }
        } catch (error) {
            console.error("❌ Lỗi khi huỷ tour:", error);
            toast.error("Huỷ tour thất bại");
        }
    };
    return (
        <div className="relative flex items-center gap-2 justify-end">
            <button
                onClick={handleButtonClick}
                className="p-2 dropdown-button"
            >
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen &&
                createPortal(
                    <div
                        style={{ top: position.top, left: position.left }}
                        className="absolute bg-white shadow-md rounded-md z-[9999] w-56"
                    >
                        <button
                            onClick={() => {
                                setOpenDropdown(null);
                                onImportPassengers(travelTour);
                            }}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                        >
                            <FaFileImport className="mr-2" />
                            Nhập danh sách khách hàng
                        </button>
                        <button
                            onClick={() => {
                                setOpenDropdown(null);
                                onAssignGuide(travelTour);
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
                            Xem danh sách HDV & KH
                        </button>

                        <button
                            onClick={() => {
                                setOpenDropdown(null);
                                onAssignService(travelTour);
                            }}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                        >
                            <FaConciergeBell className="mr-2" />
                            Gán dịch vụ
                        </button>
                        <button
                            onClick={handleCancelTour}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600 font-medium"
                        >
                            ❌ Huỷ tour
                        </button>
                    </div>,
                    document.body
                )
            }
        </div>
    );
}
