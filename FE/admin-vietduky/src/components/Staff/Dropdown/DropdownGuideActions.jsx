import { FaTrash, FaUserPlus, FaUsers } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function DropdownGuideActions({guide, tourId, isOpen, setOpenDropdown, onAssignPassenger, onViewPassengers, onDeleteGuide,}) {
    const dropdownRef = useRef(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
                setIsConfirmOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [setOpenDropdown]);

    const handleDelete = () => {
        onDeleteGuide({
            travel_guide_id: guide.id,
            travel_tour_id: tourId,
        });
        setIsConfirmOpen(false);
        setOpenDropdown(null);
    };

    return (
        <div className="relative flex items-center gap-2 justify-end" ref={dropdownRef} >
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
                <>
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                        {/* Nút đóng */}
                        {/*<div className="flex justify-end px-1 pt-1">*/}
                        {/*    <button*/}
                        {/*        onClick={(e) => {*/}
                        {/*            e.stopPropagation();*/}
                        {/*            setOpenDropdown(null);*/}
                        {/*            setIsConfirmOpen(false);*/}
                        {/*        }}*/}
                        {/*        className="text-gray-400 hover:text-gray-600 text-sm"*/}
                        {/*        aria-label="Đóng"*/}
                        {/*    >*/}
                        {/*        ×*/}
                        {/*    </button>*/}
                        {/*</div>*/}

                        {/* Các nút hành động */}
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
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsConfirmOpen(true);
                            }}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                        >
                            <FaTrash className="mr-2" />
                            Xóa
                        </button>
                    </div>

                    {/* Modal xác nhận */}
                    {isConfirmOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] animate-fade-in">
                                <h3 className="text-lg font-semibold text-center mb-2">Xác nhận xoá</h3>
                                <p className="text-sm text-gray-600 text-center mb-6">
                                    Bạn có chắc chắn muốn xoá hướng dẫn viên này không?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                        onClick={() => setIsConfirmOpen(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition"
                                        onClick={handleDelete}
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
