import { useEffect, useState } from "react";
import { addTourToTopic, getAllTours } from "../../../services/API/topic.service";
import { getLocations } from "../../../services/API/location.service";
import { getToursByLocation } from "../../../services/API/tour.service";

export default function ModalAddTourToTopic({ topic, onClose }) {
    const [locations, setLocations] = useState([]);
    const [selectedLocationIds, setSelectedLocationIds] = useState([]);
    const [tours, setTours] = useState([]);
    const [allTours, setAllTours] = useState([]); // lưu lại full list ban đầu
    const [selectedTours, setSelectedTours] = useState([]);
    const [searchTour, setSearchTour] = useState("");
    const [searchLocation, setSearchLocation] = useState("");

    // Gọi API lấy tất cả location + tất cả tour ban đầu
    useEffect(() => {
        const fetchData = async () => {
            try {
                const locationRes = await getLocations(1, 1000);
                const tourRes = await getAllTours();

                setLocations(locationRes || []);
                setAllTours(tourRes || []);
                setTours(tourRes || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                setLocations([]);
                setAllTours([]);
                setTours([]);
            }
        };
        fetchData();
    }, []);

    const handleLocationToggle = async (locationId) => {
        let updatedSelectedIds;

        if (selectedLocationIds.includes(locationId)) {
            updatedSelectedIds = selectedLocationIds.filter(id => id !== locationId);
        } else {
            updatedSelectedIds = [...selectedLocationIds, locationId];
        }

        setSelectedLocationIds(updatedSelectedIds);

        // Nếu không chọn location nào → hiển thị lại full tour
        if (updatedSelectedIds.length === 0) {
            setTours(allTours);
            return;
        }

        // Nếu có location được chọn → load tour theo location
        try {
            const tourLists = await Promise.all(
                updatedSelectedIds.map(id => getToursByLocation(id))
            );

            const mergedTours = Array.from(
                new Map(tourLists.flat().map(t => [t.id, t])).values()
            );

            setTours(mergedTours);
        } catch (error) {
            console.error("Lỗi khi lấy tour theo location:", error);
            setTours([]);
        }
    };

    const handleTourToggle = (tourId) => {
        setSelectedTours((prev) =>
            prev.includes(tourId)
                ? prev.filter((id) => id !== tourId)
                : [...prev, tourId]
        );
    };

    const handleSubmit = async () => {
        try {
            await addTourToTopic({
                topicId: topic.id,
                tourIds: selectedTours,
            });
            alert("Thêm tour vào chủ đề thành công!");
            onClose();
        } catch (error) {
            console.error("Lỗi khi thêm tour:", error);
            alert("Thất bại khi thêm tour.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white w-3/5 h-3/4 rounded-md p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-2">Thêm Tour vào Chủ đề</h2>
                <p className="mb-4 text-gray-500">Chủ đề: <strong>{topic.name}</strong></p>

                <div className="flex gap-6">
                    {/* Left: Locations (2 cột) */}
                    <div className="w-1/3">
                        <h3 className="font-semibold mb-2">Chọn vị trí</h3>
                        <input
                            type="text"
                            placeholder="Tìm kiếm vị trí"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="w-full border rounded p-2 mb-2"
                        />
                        <div className="h-[250px] overflow-y-auto border p-2 rounded">
                            {locations
                                .filter((l) =>
                                    l.name_location.toLowerCase().includes(searchLocation.toLowerCase())
                                )
                                .map((location) => (
                                    <label key={location.id} className="flex items-center gap-2 mb-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedLocationIds.includes(location.id)}
                                            onChange={() => handleLocationToggle(location.id)}
                                            className="accent-red-700"
                                        />
                                        {location.name_location}
                                    </label>
                                ))}
                        </div>
                    </div>

                    {/* Right: Tours (4 cột) */}
                    <div className="w-2/3">
                        <h3 className="font-semibold mb-2">Danh sách Tour</h3>
                        <input
                            type="text"
                            placeholder="Tìm kiếm Tour"
                            value={searchTour}
                            onChange={(e) => setSearchTour(e.target.value)}
                            className="w-full border rounded p-2 mb-2"
                        />
                        <div className="h-[380px] overflow-y-auto border p-2 rounded">
                            {tours
                                .filter((t) =>
                                    t.name_tour.toLowerCase().includes(searchTour.toLowerCase())
                                )
                                .map((tour) => (
                                    <label key={tour.id} className="flex items-center gap-2 mb-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedTours.includes(tour.id)}
                                            onChange={() => handleTourToggle(tour.id)}
                                            className="accent-red-700"
                                        />
                                        {tour.name_tour}
                                    </label>
                                ))}
                        </div>
                    </div>
                </div>


                {/* Nút xác nhận */}
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="border border-red-700 px-4 py-2 rounded text-red-700">
                        Hủy
                    </button>
                    <button onClick={handleSubmit} className="bg-red-700 px-4 py-2 rounded text-white">
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
