import { useEffect, useState } from "react";
import { getAllVehicles } from "../../../../services/API/vehicle.service.js";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalSelectVehicle({ tourId, onClose, onConfirm }) {
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);

    useEffect(() => {
        async function fetchAvailableVehicles() {
            try {
                const vehicles = await getAllVehicles(); // Có thể đổi sang getAvailableVehiclesByTourId nếu có API riêng
                setAvailableVehicles(vehicles);
            } catch (error) {
                console.error("❌ Lỗi khi lấy danh sách xe khả dụng:", error);
            }
        }

        fetchAvailableVehicles();
    }, [tourId]);

    const toggleVehicleSelection = (vehicleId) => {
        setSelectedVehicleIds((prev) =>
            prev.includes(vehicleId)
                ? prev.filter((id) => id !== vehicleId)
                : [...prev, vehicleId]
        );
    };

    const handleConfirm = () => {
        if (selectedVehicleIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một xe!");
            return;
        }
        onConfirm(selectedVehicleIds);
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-[500px] max-h-[80%] overflow-y-auto rounded-lg p-6 flex flex-col"
            >
                <h2 className="text-xl font-semibold mb-4">Chọn xe</h2>

                {availableVehicles.length === 0 ? (
                    <div className="text-gray-500 text-center">Không có xe khả dụng</div>
                ) : (
                    <ul className="space-y-3">
                        {availableVehicles.map((vehicle) => (
                            <li key={vehicle.id} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedVehicleIds.includes(vehicle.id)}
                                    onChange={() => toggleVehicleSelection(vehicle.id)}
                                />
                                <div>
                                    <div className="font-medium">{vehicle.name_vehicle}</div>
                                    <div className="text-gray-500 text-sm">
                                        {vehicle.plate_number} – {vehicle.phone_number}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
