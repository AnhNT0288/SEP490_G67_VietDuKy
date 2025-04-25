import { useEffect, useState } from "react";
import { getLocations } from "../../../services/API/location.service";
import { getAssignedLocationsByStaffId, assignLocationsToStaff } from "../../../services/API/staff.service.js";
import Select from "react-select";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalAssignLocationToStaff({ staff, onClose }) {
    const [locations, setLocations] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [assignedLocations, setAssignedLocations] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [allLocations, assigned] = await Promise.all([
                    getLocations(),
                    getAssignedLocationsByStaffId(staff.id),
                ]);
                setLocations(allLocations);
                setAssignedLocations(assigned);
            } catch (err) {
                console.error("❌ Lỗi khi load dữ liệu:", err);
            }
        };

        if (staff?.id) fetchAllData();
    }, [staff]);

    const handleAssign = async () => {
        if (!selectedOptions.length) {
            toast.error("Vui lòng chọn ít nhất một địa điểm!");
            return;
        }

        const location_ids = selectedOptions.map((option) => Number(option.value));
        setIsLoading(true);

        try {
            await assignLocationsToStaff(staff.id, location_ids);
            toast.success("Gán địa điểm thành công!");
            onClose();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            toast.error("Lỗi khi gán địa điểm!");
        } finally {
            setIsLoading(false);
        }
    };

    const locationOptions = locations.map((loc) => ({
        value: String(loc.id),
        label: loc.name_location,
    }));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-md w-2/5 h-3/5 flex flex-col">
                {/* Nội dung cuộn */}
                <div className="flex-1 overflow-auto p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Gán địa điểm cho nhân viên</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">
                            &times;
                        </button>
                    </div>

                    {/* Nhân viên */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <input
                            readOnly
                            value={staff.displayName || "—"}
                            className="border px-3 py-2 rounded bg-gray-50"
                            placeholder="Tên nhân viên"
                        />
                        <input
                            readOnly
                            value={staff.email || "—"}
                            className="border px-3 py-2 rounded bg-gray-50"
                            placeholder="Email"
                        />
                    </div>

                    {/* Select multiple location */}
                    <div className="mb-4 text-sm">
                        <label className="block mb-1 text-gray-600 font-medium">Chọn địa điểm</label>
                        <Select
                            isMulti
                            isSearchable
                            placeholder="Chọn địa điểm"
                            className="w-full"
                            options={locationOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                        />
                    </div>

                    {/* Danh sách địa điểm đã gán */}
                    <div className="mb-4 text-sm">
                        <label className="block mb-1 text-gray-600 font-medium">Địa điểm đã gán</label>
                        {assignedLocations.length === 0 ? (
                            <div className="text-gray-500 italic">Chưa có địa điểm nào.</div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {assignedLocations.map((loc) => (
                                    <div
                                        key={loc.id}
                                        className="inline-flex items-center px-3 py-1.5 rounded-2xl border border-gray-300 bg-white shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        <span className="truncate max-w-[120px]">{loc.name_location}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Nút thao tác cố định dưới cùng */}
                <div className="sticky bottom-0 bg-white px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                        Hủy
                    </button>
                    <button
                        onClick={handleAssign}
                        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 disabled:opacity-60"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang gán..." : "Gán địa điểm"}
                    </button>
                </div>
            </div>
        </div>
    );
}
