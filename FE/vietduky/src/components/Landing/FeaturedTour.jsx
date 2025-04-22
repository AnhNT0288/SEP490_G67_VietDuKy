import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

export default function FeaturedTour() {
    const [tours, setTours] = useState([]);
    const [filteredTours, setFilteredTours] = useState([]);
    const [activeTab, setActiveTab] = useState("Tất cả");
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tourRes, locationRes] = await Promise.all([
                    fetch("http://localhost:3000/api/tour").then((res) => res.json()),
                    fetch("http://localhost:3000/api/location/").then((res) => res.json()),
                ]);

                const toursData = Array.isArray(tourRes?.data) ? tourRes.data : [];

                // ✅ Vì locationRes là mảng trực tiếp
                const locationsData = Array.isArray(locationRes) ? locationRes : [];

                setTours(toursData);
                setFilteredTours(toursData.slice(0, 6));

                const cityList = [
                    "Tất cả",
                    ...locationsData
                        .map((location) => location.name_location)
                        .filter((name) => !!name)
                ];
                setCities(cityList);

                console.log("Danh sách thành phố:", cityList);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === "Tất cả") {
            setFilteredTours(tours.slice(0, 6));
        } else {
            const filtered = tours.filter(
                (tour) =>
                    tour.endLocation?.name_location?.toLowerCase() === activeTab.toLowerCase()
            );
            setFilteredTours(filtered.slice(0, 6));
        }
    }, [activeTab, tours]);

    return (
        <div className="bg-transparent py-10 px-5">
            <div className="max-w-6xl mx-auto scrollbar-hide">
                <h2 className="text-2xl font-bold text-gray-800">Tour trong nước nổi bật</h2>

                <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex space-x-6 overflow-x-auto">
                        {cities.map((city) => (
                            <button
                                key={city}
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                                    activeTab === city
                                        ? "text-red-700 border-b-2 border-red-700"
                                        : "text-gray-500"
                                }`}
                                onClick={() => setActiveTab(city)}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
                    {filteredTours.map((tour) => (
                        <div
                            key={tour.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 cursor-pointer"
                            onClick={() => navigate(`/tour/${tour.id}`)}
                        >
                            <div className="relative">
                                <img
                                    src={tour.image || "/Image/Image [sc-fFubgz] (1).png"}
                                    alt={tour.name_tour}
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <button className="absolute top-2 left-2 bg-transparent rounded-full p-2 backdrop-blur-md">
                                    <Heart className="text-gray-600" size={18} />
                                </button>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{tour.name_tour}</h3>
                                <p className="text-sm text-gray-600">
                                    📍 {tour.endLocation?.name_location || "Chưa cập nhật"}
                                </p>
                                <p className="text-gray-400 text-xs">{tour.activity_description}</p>
                                <p className="text-red-600 font-bold text-lg">
                                    VND: {Number(tour.price_tour || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút xem thêm */}
                <div className="text-center mt-6">
                    <button
                        className="border border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
                        onClick={() => navigate("/listTour")}
                    >
                        Xem thêm Tours
                    </button>
                </div>
            </div>
        </div>
    );
}