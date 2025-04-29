import { useEffect, useState } from "react";
import { getAvailableHotelsByTravelTourId } from "../../../../services/API/hotel.service.js";

// eslint-disable-next-line react/prop-types
export default function ModalSelectHotel({ tourId, onClose, onConfirm }) {
    const [availableHotels, setAvailableHotels] = useState([]);
    const [selectedHotelIds, setSelectedHotelIds] = useState([]);

    useEffect(() => {
        async function fetchAvailableHotels() {
            try {
                const hotels = await getAvailableHotelsByTravelTourId(tourId);
                setAvailableHotels(hotels);
            } catch (error) {
                console.error("❌ Lỗi khi lấy danh sách khách sạn khả dụng:", error);
            }
        }

        fetchAvailableHotels();
    }, [tourId]);

    const toggleHotelSelection = (hotelId) => {
        setSelectedHotelIds((prev) =>
            prev.includes(hotelId)
                ? prev.filter(id => id !== hotelId)
                : [...prev, hotelId]
        );
    };

    const handleConfirm = () => {
        if (selectedHotelIds.length === 0) {
            alert("Vui lòng chọn ít nhất một khách sạn!");
            return;
        }
        onConfirm(selectedHotelIds);
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-[500px] max-h-[80%] overflow-y-auto rounded-lg p-6 flex flex-col"
            >
                <h2 className="text-xl font-semibold mb-4">Chọn khách sạn</h2>

                {availableHotels.length === 0 ? (
                    <div className="text-gray-500 text-center">Không có khách sạn khả dụng</div>
                ) : (
                    <ul className="space-y-3">
                        {availableHotels.map((hotel) => (
                            <li key={hotel.id} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedHotelIds.includes(hotel.id)}
                                    onChange={() => toggleHotelSelection(hotel.id)}
                                />
                                <div>
                                    <div className="font-medium">{hotel.name_hotel}</div>
                                    <div className="text-gray-500 text-sm">{hotel.address_hotel}</div>
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
