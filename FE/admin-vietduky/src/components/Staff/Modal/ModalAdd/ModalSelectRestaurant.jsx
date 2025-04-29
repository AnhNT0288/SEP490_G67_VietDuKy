import { useEffect, useState } from "react";
import { getAvailableRestaurantsByTravelTourId } from "../../../../services/API/restaurant.service.js";

// eslint-disable-next-line react/prop-types
export default function ModalSelectRestaurant({ tourId, onClose, onConfirm }) {
    const [availableRestaurants, setAvailableRestaurants] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    useEffect(() => {
        async function fetchAvailableRestaurants() {
            try {
                const res = await getAvailableRestaurantsByTravelTourId(tourId);
                setAvailableRestaurants(res);
            } catch (error) {
                console.error("❌ Lỗi khi lấy danh sách nhà hàng khả dụng:", error);
            }
        }

        fetchAvailableRestaurants();
    }, [tourId]);

    const toggleSelection = (restaurantId) => {
        if (selectedData.find(item => item.restaurantId === restaurantId)) {
            setSelectedData(prev => prev.filter(item => item.restaurantId !== restaurantId));
        } else {
            setSelectedData(prev => [
                ...prev,
                { restaurantId, meal: "lunch", date: "" } // mặc định meal: lunch
            ]);
        }
    };

    const updateMeal = (restaurantId, meal) => {
        setSelectedData(prev =>
            prev.map(item =>
                item.restaurantId === restaurantId ? { ...item, meal } : item
            )
        );
    };

    const updateDate = (restaurantId, date) => {
        setSelectedData(prev =>
            prev.map(item =>
                item.restaurantId === restaurantId ? { ...item, date } : item
            )
        );
    };

    const handleConfirm = () => {
        if (selectedData.length === 0) {
            alert("Vui lòng chọn ít nhất một nhà hàng!");
            return;
        }
        const incomplete = selectedData.some(item => !item.date);
        if (incomplete) {
            alert("Vui lòng chọn ngày ăn cho tất cả nhà hàng!");
            return;
        }
        onConfirm(selectedData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-[600px] max-h-[80%] overflow-y-auto rounded-lg p-6 flex flex-col"
            >
                <h2 className="text-xl font-semibold mb-4">Chọn nhà hàng để gán</h2>

                {availableRestaurants.length === 0 ? (
                    <div className="text-gray-500 text-center">Không có nhà hàng khả dụng</div>
                ) : (
                    <ul className="space-y-5">
                        {availableRestaurants.map((restaurant) => {
                            const isSelected = selectedData.find(item => item.restaurantId === restaurant.id);
                            return (
                                <li key={restaurant.id} className="flex flex-col gap-2 border-b pb-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected !== undefined}
                                            onChange={() => toggleSelection(restaurant.id)}
                                        />
                                        <div>
                                            <div className="font-medium">{restaurant.name_restaurant}</div>
                                            <div className="text-gray-500 text-sm">{restaurant.address_restaurant}</div>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="flex items-center gap-4 pl-6">
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-500">Bữa ăn</label>
                                                <select
                                                    value={isSelected.meal}
                                                    onChange={(e) => updateMeal(restaurant.id, e.target.value)}
                                                    className="border px-2 py-1 rounded-md"
                                                >
                                                    <option value="breakfast">Sáng</option>
                                                    <option value="lunch">Trưa</option>
                                                    <option value="dinner">Tối</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-500">Ngày ăn</label>
                                                <input
                                                    type="date"
                                                    value={isSelected.date}
                                                    onChange={(e) => updateDate(restaurant.id, e.target.value)}
                                                    className="border px-2 py-1 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
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
