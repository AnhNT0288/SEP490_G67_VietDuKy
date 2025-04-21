import { useEffect, useState } from "react";
import {
    getAssignedLocationsByStaffId,
    removeLocationFromStaff,
} from "../../../services/API/staff.service"; // ✅ đảm bảo bạn import đúng

// eslint-disable-next-line react/prop-types
export default function ModalViewLocationsOfStaff({ staff, onClose }) {
    const [locations, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getAssignedLocationsByStaffId(staff.id);
                setLocations(data);
            } catch (err) {
                console.error("❌ Lỗi khi lấy danh sách địa điểm đã gán:", err);
            }
        };

        if (staff?.id) fetchLocations();
    }, [staff]);

    const handleRemoveLocation = async (locationId) => {
        try {
            await removeLocationFromStaff(staff.id, locationId);
            setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
            alert("🗑️ Xoá địa điểm thành công!");
        } catch (err) {
            alert("❌ Xoá địa điểm thất bại!");
        }
    };

    const filteredLocations = locations.filter((loc) =>
        loc.name_location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Địa điểm đã gán cho nhân viên</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-xl"
                        title="Đóng"
                    >
                        &times;
                    </button>
                </div>

                {/* Thông tin nhân viên */}
                <div className="mb-4 text-sm flex items-center gap-x-2">
                    <span className="text-gray-500">Nhân viên:</span>
                    {/* eslint-disable-next-line react/prop-types */}
                    <div className="font-medium text-gray-700">{staff.displayName || staff.email}</div>
                </div>

                {/* Ô tìm kiếm */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm địa điểm theo tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Danh sách địa điểm */}
                <div className="flex-1 overflow-auto text-sm space-y-2">
                    {filteredLocations.length === 0 ? (
                        <div className="text-gray-500 italic">Không tìm thấy địa điểm phù hợp.</div>
                    ) : (
                        filteredLocations.map((loc) => (
                            <div
                                key={loc.id}
                                className="flex justify-between items-center px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg shadow-sm"
                            >
                                <span className="text-gray-800">{loc.name_location}</span>
                                <button
                                    onClick={() => handleRemoveLocation(loc.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Xoá
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Nút đóng */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
