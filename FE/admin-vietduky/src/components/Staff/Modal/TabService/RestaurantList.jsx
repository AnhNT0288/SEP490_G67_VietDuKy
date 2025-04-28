import { useEffect, useState } from "react";
import {getRestaurantsByBookingId, getRestaurantsByTravelTourId} from "../../../../services/API/restaurant.service.js";

// eslint-disable-next-line react/prop-types
export default function RestaurantList({ tourId,selectedBookingIds }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                setLoading(true);

                if (selectedBookingIds.length === 0) {
                    const restaurants = await getRestaurantsByTravelTourId(tourId);
                    setRestaurants(restaurants);
                } else {
                    let allRestaurants = [];
                    for (const bookingId of selectedBookingIds) {
                        const restaurantsByBooking = await getRestaurantsByBookingId(bookingId);
                        allRestaurants = allRestaurants.concat(restaurantsByBooking);
                    }
                    setRestaurants(allRestaurants);
                }
            } catch (error) {
                console.error("❌ Lỗi khi load khách sạn:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRestaurants();
    }, [tourId, selectedBookingIds]);

    if (loading) return <div className="text-center py-10">Đang tải nhà hàng...</div>;

    if (restaurants.length === 0) return <div className="text-center py-10 text-gray-400">Chưa có nhà hàng nào.</div>;

    return (
        <div className="overflow-y-auto h-full">
            <table className="w-full text-sm border-t">
                <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2">Tên nhà hàng</th>
                    <th className="p-2">Địa chỉ</th>
                    <th className="p-2">Loại hình</th>
                </tr>
                </thead>
                <tbody>
                {restaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="border-t">
                        <td className="p-2">{restaurant.Restaurant?.name_restaurant || "Không rõ"}</td>
                        <td className="p-2">{restaurant.Restaurant?.address_restaurant || "Không rõ"}</td>
                        <td className="p-2">{restaurant.Restaurant?.phone_number || "Không rõ"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
