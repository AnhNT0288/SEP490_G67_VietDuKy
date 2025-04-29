import { useEffect, useState } from "react";
import {
    getRestaurantsByBookingId,
    getRestaurantsByTravelTourId,
    assignRestaurantToBooking,
    cancelAssignRestaurant
} from "../../../../services/API/restaurant.service.js";
import ModalSelectRestaurant from "../ModalAdd/ModalSelectRestaurant.jsx";

// eslint-disable-next-line react/prop-types
export default function RestaurantList({ tourId, selectedBookingIds }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchRestaurants();
    }, [tourId, selectedBookingIds]);

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            if (selectedBookingIds.length === 0) {
                const res = await getRestaurantsByTravelTourId(tourId);
                setRestaurants(res);
            } else {
                const res = await Promise.all(
                    selectedBookingIds.map((id) => getRestaurantsByBookingId(id))
                );
                setRestaurants(res.flat());
            }
        } catch (error) {
            console.error("❌ Lỗi khi load nhà hàng:", error);
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRestaurants = async (dataList) => {
        try {
            const bookingId = selectedBookingIds[0];
            for (const { restaurantId, meal, date } of dataList) {
                await assignRestaurantToBooking(bookingId, restaurantId, meal, date);
            }
            setOpenModal(false);
            fetchRestaurants();
        } catch (error) {
            console.error("❌ Lỗi khi gán nhà hàng:", error);
        }
    };

    const handleCancelAssign = async (restaurantBookingId) => {
        if (!confirm("Bạn có chắc chắn muốn hủy gán nhà hàng này?")) return;
        try {
            await cancelAssignRestaurant(restaurantBookingId);
            fetchRestaurants();
        } catch (error) {
            console.error("❌ Lỗi khi hủy gán nhà hàng:", error);
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải nhà hàng...</div>;

    return (
        <div className="overflow-y-auto h-full">
            {restaurants.length === 0 ? (
                <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-4">
                    <div>Chưa có nhà hàng nào.</div>
                    {selectedBookingIds.length === 1 && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md"
                        >
                            Thêm nhà hàng
                        </button>
                    )}
                </div>
            ) : (
                <table className="w-full text-sm border-t">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Tên nhà hàng</th>
                        <th className="p-2">Địa chỉ</th>
                        <th className="p-2">Loại hình</th>
                        <th className="p-2">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {restaurants.map((restaurant) => (
                        <tr key={restaurant.id} className="border-t">
                            <td className="p-2">{restaurant.Restaurant?.name_restaurant || "Không rõ"}</td>
                            <td className="p-2">{restaurant.Restaurant?.address_restaurant || "Không rõ"}</td>
                            <td className="p-2">{restaurant.Restaurant?.phone_number || "Không rõ"}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => handleCancelAssign(restaurant.id)}
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
                <ModalSelectRestaurant
                    tourId={tourId}
                    onClose={() => setOpenModal(false)}
                    onConfirm={handleAssignRestaurants}
                />
            )}
        </div>
    );
}
