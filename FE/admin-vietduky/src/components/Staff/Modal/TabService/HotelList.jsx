import { useEffect, useState } from "react";
import {getHotelsByBookingId, getHotelsByTravelTourId} from "../../../../services/API/hotel.service.js";

// eslint-disable-next-line react/prop-types
export default function HotelList({ tourId, selectedBookingIds }) {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHotels() {
            try {
                setLoading(true);

                if (selectedBookingIds.length === 0) {
                    const hotels = await getHotelsByTravelTourId(tourId);
                    setHotels(hotels);
                } else {
                    let allHotels = [];
                    for (const bookingId of selectedBookingIds) {
                        const hotelsByBooking = await getHotelsByBookingId(bookingId);
                        allHotels = allHotels.concat(hotelsByBooking);
                    }
                    setHotels(allHotels);
                }
            } catch (error) {
                console.error("❌ Lỗi khi load khách sạn:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHotels();
    }, [tourId, selectedBookingIds]);

    if (loading) return <div className="text-center py-10">Đang tải khách sạn...</div>;

    if (hotels.length === 0) return <div className="text-center py-10 text-gray-400">Chưa có khách sạn nào.</div>;

    return (
        <div className="overflow-y-auto h-full">
            <table className="w-full text-sm border-t">
                <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2">Tên khách sạn</th>
                    <th className="p-2">Địa chỉ</th>
                    <th className="p-2">Số điện thoại</th>
                    <th className="p-2">Số sao</th>
                </tr>
                </thead>
                <tbody>
                {hotels.map((hotel) => (
                    <tr key={hotel.id} className="border-t">
                        <td className="p-2">{hotel.Hotel?.name_hotel || "Không rõ"}</td>
                        <td className="p-2">{hotel.Hotel?.address_hotel || "Không rõ"}</td>
                        <td className="p-2">{hotel.Hotel?.phone_number || "Không rõ"}</td>
                        <td className="p-2">Chưa có dữ liệu</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
