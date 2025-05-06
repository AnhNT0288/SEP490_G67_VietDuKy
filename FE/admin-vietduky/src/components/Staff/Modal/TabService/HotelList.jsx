import { useEffect, useState } from "react";
import {
    getHotelsByBookingId,
    getHotelsByTravelTourId,
    assignHotelToBooking,
    cancelAssignHotel
} from "../../../../services/API/hotel.service.js";
import ModalSelectHotel from "../ModalAdd/ModalSelectHotel.jsx";

// eslint-disable-next-line react/prop-types
export default function HotelList({ tourId, selectedBookingIds }) {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchHotels();
    }, [tourId, selectedBookingIds]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            if (selectedBookingIds.length === 0) {
                const hotels = await getHotelsByTravelTourId(tourId);
                setHotels(hotels);
            } else {
                const hotelResults = await Promise.all(
                    // eslint-disable-next-line react/prop-types
                    selectedBookingIds.map((bookingId) => getHotelsByBookingId(bookingId))
                );
                const allHotels = hotelResults.flat();
                setHotels(allHotels);
            }
        } catch (error) {
            console.error("❌ Lỗi khi load khách sạn:", error);
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAssign = async (hotelBookingId) => {
        if (!confirm("Bạn có chắc chắn muốn hủy gán khách sạn này?")) return;
        try {
            await cancelAssignHotel(hotelBookingId);
            fetchHotels(); // Reload lại danh sách sau khi hủy
        } catch (error) {
            console.error("❌ Lỗi khi hủy gán khách sạn:", error);
        }
    };

    const handleAssignHotels = async (hotelIds) => {
        try {
            const bookingId = selectedBookingIds[0];
            for (const hotelId of hotelIds) {
                await assignHotelToBooking(bookingId, hotelId);
            }
            setOpenModal(false);
            fetchHotels();
        } catch (error) {
            console.error("❌ Lỗi khi gán khách sạn:", error);
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải khách sạn...</div>;

    return (
        <div className="overflow-y-auto h-full">
            {hotels.length === 0 ? (
                <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-4">
                    <div>Chưa có khách sạn nào.</div>
                    {selectedBookingIds.length === 1 && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md"
                        >
                            Thêm khách sạn
                        </button>
                    )}
                </div>
            ) : (
                <table className="w-full text-sm border-t">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Tên khách sạn</th>
                        <th className="p-2">Địa chỉ</th>
                        <th className="p-2">Số điện thoại</th>
                        <th className="p-2">Số sao</th>
                        <th className="p-2">Thao tác</th>
                        <th className="p-2">

                            <div>
                            {selectedBookingIds.length === 1 && (
                                <button
                                    onClick={() => setOpenModal(true)}
                                    className="bg-red-600 text-white px-2 py-1 rounded-md"
                                >
                                    +
                                </button>
                            )}
                        </div></th>

                    </tr>
                    </thead>
                    <tbody>
                    {hotels.map((hotel) => (
                        <tr key={hotel.id} className="border-t">
                            <td className="p-2">{hotel.Hotel?.name_hotel || "Không rõ"}</td>
                            <td className="p-2">{hotel.Hotel?.address_hotel || "Không rõ"}</td>
                            <td className="p-2">{hotel.Hotel?.phone_number || "Không rõ"}</td>
                            <td className="p-2">Chưa có dữ liệu</td>
                            <td className="p-2">
                                <button
                                    onClick={() => handleCancelAssign(hotel.id)}
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
                <ModalSelectHotel
                    tourId={tourId}
                    onClose={() => setOpenModal(false)}
                    onConfirm={handleAssignHotels}
                />
            )}
        </div>
    );
}
