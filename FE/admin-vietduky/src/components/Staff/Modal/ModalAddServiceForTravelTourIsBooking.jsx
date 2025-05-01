import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getPassengersByTravelTourId } from "../../../services/API/passenger.service.js";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import HotelList from "./TabService/HotelList.jsx";
import RestaurantList from "./TabService/RestaurantList.jsx";
import VehicleList from "./TabService/VehicleList.jsx";

// eslint-disable-next-line react/prop-types
export default function ModalAddServiceForTravelTourIsBooking({ tour, onClose }) {
    const [tourInfo, setTourInfo] = useState(null);
    const [passengersByBooking, setPassengersByBooking] = useState([]);
    const [expandedBookings, setExpandedBookings] = useState([]);
    const [tab, setTab] = useState("hotel");
    const [loading, setLoading] = useState(true);
    const [selectedBookingIds, setSelectedBookingIds] = useState([]);

    const tourId = tour.id;

    useEffect(() => {
        async function fetchTourData() {
            try {
                console.log("🚀 [DEBUG] Thông tin tour nhận vào:", tour);

                setTourInfo(tour);
                const passengers = await getPassengersByTravelTourId(tourId);
                const grouped = passengers.map((booking) => ({
                    booking_id: booking.booking_id,
                    label: `Mã đặt Tour: ${booking.booking_code}`,
                    passengers: booking.passengers.map((p, index) => ({
                        id: `${booking.booking_id}_${index}`,
                        original_id: p.id,
                        name: p.name,
                        birth_date: p.birth_date,
                        gender: p.gender ? "Nam" : "Nữ",
                        phone: p.phone_number,
                    })),
                }));
                setPassengersByBooking(grouped);
            } catch (err) {
                console.error("Lỗi lấy dữ liệu tour hoặc khách hàng:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchTourData();
    }, [tourId]);

    const toggleExpand = (bookingId) => {
        setExpandedBookings((prev) =>
            prev.includes(bookingId)
                ? prev.filter((id) => id !== bookingId)
                : [...prev, bookingId]
        );
    };

    const formatDate = (date) => {
        if (date && !isNaN(new Date(date))) {
            return format(new Date(date), "dd/MM/yyyy");
        }
        return "Không rõ";
    };

    const toggleBookingSelection = (bookingId) => {
        setSelectedBookingIds((prev) =>
            prev.includes(bookingId) ? prev.filter(id => id !== bookingId) : [...prev, bookingId]
        );
    };
    if (loading) return <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">Đang tải...</div>;
    console.log(tourInfo);
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg w-[90%] h-[90%] flex overflow-hidden shadow-xl"
            >
                {/* LEFT: Thông tin Tour + Booking */}
                <div className="w-[30%] p-6 overflow-y-auto text-sm ">
                    <h2 className="text-xl font-semibold mb-2">Thông tin Tour</h2>
                    <h2 className="text-red-700 mb-4">{tourInfo?.name}</h2>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="font-medium text-gray-700">Điểm đi</label>
                            <input
                                type="text"
                                value={tourInfo?.start_location?.name_location || ''}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Điểm đến</label>
                            <input
                                type="text"
                                value={tourInfo?.end_location?.name_location || ''}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Ngày đi</label>
                            <input
                                type="text"
                                value={formatDate(tourInfo?.start_day)}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Ngày về</label>
                            <input
                                type="text"
                                value={formatDate(tourInfo?.end_day)}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="font-medium text-gray-700">Tình trạng chỗ</label>
                            <input
                                type="text"
                                value={`${tourInfo?.current_people || 0}/${tourInfo?.max_people || 0}`}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="font-medium text-gray-700">Giá tour</label>
                            <input
                                type="text"
                                value={tourInfo?.price_tour?.toLocaleString("vi-VN") || tourInfo?.price?.toLocaleString("vi-VN") || ''}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="font-medium text-gray-700">Ghi chú</label>
                            <textarea
                                value={tourInfo?.note || 'Không có ghi chú'}
                                readOnly
                                rows={3}
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2 resize-none"
                            />
                        </div>
                    </div>

                    {/* Booking và khách hàng */}
                    <h2 className="text-lg font-semibold mb-2">Danh sách đặt Tour</h2>
                    <div className="space-y-2">
                        {passengersByBooking.map((group) => (
                            <div key={group.booking_id}>
                                <div className="flex items-center p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={selectedBookingIds.includes(group.booking_id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleBookingSelection(group.booking_id);
                                        }}
                                        className="mr-2"
                                    />
                                    <span>{group.label}</span>
                                    <span
                                        className="ml-auto cursor-pointer"
                                        onClick={() => toggleExpand(group.booking_id)}
                                    >
                                        {expandedBookings.includes(group.booking_id) ? <SlArrowDown /> : <SlArrowUp />}
                                    </span>
                                </div>

                                {expandedBookings.includes(group.booking_id) && (
                                    <ul className="ml-4 mt-2 list-disc text-gray-600 text-sm">
                                        {group.passengers.map((p) => (
                                            <li key={p.id}>
                                                <div>
                                                    <span className="font-semibold">{p.name}</span>
                                                    <span className="text-gray-500"> - {p.gender} - {p.birth_date || 'Không rõ'} - {p.phone}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Tabs Dịch vụ */}
                <div className="w-[70%] p-6 flex flex-col">
                    {/* Tabs */}
                    <div className="flex gap-6 border-b pb-2 mb-4">
                        <button
                            className={`pb-2 ${tab === 'hotel' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                            onClick={() => setTab('hotel')}
                        >
                            Khách sạn
                        </button>
                        <button
                            className={`pb-2 ${tab === 'restaurant' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                            onClick={() => setTab('restaurant')}
                        >
                            Nhà hàng
                        </button>
                        <button
                            className={`pb-2 ${tab === 'car' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                            onClick={() => setTab('car')}
                        >
                            Xe
                        </button>
                    </div>

                    {/* Content theo Tab */}
                    <div className="flex-1 overflow-y-auto">
                        {tab === 'hotel' && (
                            <HotelList tourId={tour.id} selectedBookingIds={selectedBookingIds} />
                        )}
                        {tab === 'restaurant' && (
                            <RestaurantList tourId={tour.id} selectedBookingIds={selectedBookingIds} />
                        )}
                        {tab === 'car' && (
                            <VehicleList tourId={tour.id} selectedBookingIds={selectedBookingIds} />
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="pt-6 flex justify-end gap-4 border-t">
                        <button
                            onClick={onClose}
                            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700"
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-red-700 text-white px-4 py-2 rounded-md"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
