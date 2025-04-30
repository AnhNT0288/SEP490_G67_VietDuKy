import { useEffect, useState } from "react";
import {
    assignVehicleToBooking,
    cancelAssignVehicle,
    getVehiclesByBookingId,
    getVehiclesByTravelTourIdFromBooking
} from "../../../../services/API/vehicle.service.js";
import ModalSelectVehicle from "../ModalAdd/ModalSelectVehicle.jsx";

// eslint-disable-next-line react/prop-types
export default function VehicleList({ tourId, selectedBookingIds }) {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, [tourId, selectedBookingIds]);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            if (selectedBookingIds.length === 0) {
                const data = await getVehiclesByTravelTourIdFromBooking(tourId);
                setVehicles(data);
            } else {
                const results = await Promise.all(
                    selectedBookingIds.map((bookingId) => getVehiclesByBookingId(bookingId))
                );
                const all = results.flat();
                setVehicles(all);
            }
        } catch (error) {
            console.error("❌ Lỗi khi load danh sách xe:", error);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAssign = async (vehicleBookingId) => {
        if (!confirm("Bạn có chắc chắn muốn hủy gán xe này?")) return;
        try {
            await cancelAssignVehicle(vehicleBookingId);
            fetchVehicles();
        } catch (error) {
            console.error("❌ Lỗi khi hủy gán xe:", error);
        }
    };

    const handleAssignVehicles = async (vehicleIds) => {
        try {
            const bookingId = selectedBookingIds[0];
            for (const vehicleId of vehicleIds) {
                await assignVehicleToBooking({ booking_id: bookingId, vehicle_id: vehicleId });
            }
            setOpenModal(false);
            fetchVehicles();
        } catch (error) {
            console.error("❌ Lỗi khi gán xe:", error);
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải xe...</div>;

    return (
        <div className="overflow-y-auto h-full">
            {vehicles.length === 0 ? (
                <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-4">
                    <div>Chưa có xe nào được gán.</div>
                    {selectedBookingIds.length === 1 && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md"
                        >
                            Gán xe
                        </button>
                    )}
                </div>
            ) : (
                <table className="w-full text-sm border-t">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Tên xe</th>
                        <th className="p-2">Biển số</th>
                        <th className="p-2">Số điện thoại</th>
                        <th className="p-2"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-t">
                            <td className="p-2">{vehicle.Vehicle?.name_vehicle || "Không rõ"}</td>
                            <td className="p-2">{vehicle.Vehicle?.plate_number || "Không rõ"}</td>
                            <td className="p-2">{vehicle.Vehicle?.phone_number || "Không rõ"}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => handleCancelAssign(vehicle.id)}
                                    className="text-red-600 underline text-sm"
                                >
                                    Hủy gán
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {openModal && (
                <ModalSelectVehicle
                    tourId={tourId}
                    onClose={() => setOpenModal(false)}
                    onConfirm={handleAssignVehicles}
                />
            )}
        </div>
    );
}
