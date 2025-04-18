import { useState, useEffect } from "react";
import { getTravelGuideByLocation } from "../../../services/API/guide_tour.services.js"; // Đảm bảo đã import đúng hàm này
import { assignGuideToTour } from "../../../services/API/guide_tour.services.js"; // API để phân công hướng dẫn viên cho tour

export default function ModalAssignGuide({ locationId, travel_tour_id, onClose, onAssignSuccess }) {
    const [guides, setGuides] = useState([]);
    const [selectedGuides, setSelectedGuides] = useState([]);
    const [assignedGuides, setAssignedGuides] = useState([]); // Lưu danh sách hướng dẫn viên đã phân công
    const [searchQuery, setSearchQuery] = useState("");
    const [selectAll, setSelectAll] = useState(false);

    // Fetch danh sách hướng dẫn viên khi có locationId
    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await getTravelGuideByLocation(locationId); // Gọi API lấy danh sách hướng dẫn viên
                setGuides(response.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy hướng dẫn viên:", error);
            }
        };

        if (locationId) {
            fetchGuides();
        }
    }, [locationId]);

    useEffect(() => {
        const fetchAssignedGuides = async () => {
            try {
                const response = await fetch(`/api/guide-tour/${travel_tour_id}`); // API lấy danh sách hướng dẫn viên đã phân công cho tour này
                const data = await response.json();
                setAssignedGuides(data.map((guide) => guide.travel_guide_id)); // Lưu danh sách hướng dẫn viên đã phân công
            } catch (error) {
                console.error("Lỗi khi lấy hướng dẫn viên đã phân công:", error);
            }
        };

        if (travel_tour_id) {
            console.log("Travel Tour ID trong ModalAssignGuide:", travel_tour_id); // Kiểm tra xem travel_tour_id có hợp lệ không
            fetchAssignedGuides();
        }
    }, [travel_tour_id]);

    const handleGuideSelection = (guideId) => {
        setSelectedGuides((prevSelected) =>
            prevSelected.includes(guideId)
                ? prevSelected.filter((id) => id !== guideId)
                : [...prevSelected, guideId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedGuides([]);
        } else {
            setSelectedGuides(guides.map((guide) => guide.id));
        }
        setSelectAll(!selectAll);
    };

    const handleAssign = async () => {
        console.log("Đang phân công hướng dẫn viên...");
        console.log("Travel Tour ID:", travel_tour_id);
        console.log("Danh sách hướng dẫn viên đã chọn:", selectedGuides);

        if (!travel_tour_id) {
            alert("Lỗi: Travel Tour ID không hợp lệ.");
            return;
        }

        let hasSuccessfulAssignment = false; // Flag to track successful assignments

        try {
            for (const guideId of selectedGuides) {
                console.log("travel_tour_id:", travel_tour_id, typeof travel_tour_id);
                console.log("travel_guide_id:", guideId, typeof guideId);
                const data = {
                    travel_tour_id: travel_tour_id,
                    travel_guide_id: guideId,
                };
                console.log("Dữ liệu gửi đến API phân công:", data);
                const response = await assignGuideToTour(data);

                if (response.message === "Hướng dẫn viên đã được gán cho tour này!") {
                    alert(`Hướng dẫn viên ID ${guideId} đã được gán trước đó.`);
                    continue;
                }

                console.log("Phản hồi từ API phân công:", response);
                hasSuccessfulAssignment = true;
            }

            if (hasSuccessfulAssignment) {
                alert("Phân công hướng dẫn viên thành công!");
                onAssignSuccess?.();
            }
            // onClose?.();
        } catch (error) {
            console.error("Lỗi phân công:", error);
            alert("Đã xảy ra lỗi khi phân công hướng dẫn viên. Vui lòng thử lại.");
        }
    };
    const filteredGuides = guides.filter((guide) =>
        `${guide.first_name} ${guide.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div
                className="bg-white p-4 rounded-lg shadow-lg w-[80%] h-[80%] overflow-auto"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-3 mb-3">
                    <h2 className="text-lg font-semibold">Danh sách hướng dẫn viên</h2>
                    <button onClick={onClose} className="text-gray-500 text-xl font-bold">×</button>
                </div>

                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm bằng tên hướng dẫn viên"
                        className="p-2 w-full border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    {filteredGuides.length === 0 ? (
                        <p className="text-gray-600 text-lg font-medium mb-4">Không có hướng dẫn viên cho địa điểm này.</p>
                    ) : (
                        <div>
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                            className="mr-2"
                                        />
                                    </th>
                                    <th className="p-2 text-left">Tên hướng dẫn viên</th>
                                    <th className="p-2 text-center">Giới tính</th>
                                    <th className="p-2 text-center">Số điện thoại</th>
                                    <th className="p-2 text-left">Địa điểm phụ trách</th>
                                    <th className="p-2 text-left">Trạng thái phân công</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredGuides.map((guide) => (
                                    <tr key={guide.id} className="border-t">
                                        <td className="p-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedGuides.includes(guide.id)}
                                                onChange={() => handleGuideSelection(guide.id)}
                                                className="mr-2"
                                            />
                                        </td>
                                        <td className="p-2 text-left">{`${guide.first_name} ${guide.last_name}`}</td>
                                        <td className="p-2 text-center">{guide.gender_guide === "male" ? "Nam" : "Nữ"}</td>
                                        <td className="p-2 text-center">{guide.number_phone}</td>
                                        <td className="p-2 text-left">{guide.TravelGuideLocations[0]?.location.name_location || "Chưa có"}</td>
                                        <td className="p-2 text-left">
                                            {assignedGuides.includes(guide.id) ? (
                                                <span className="text-green-500">Đã phân công</span>
                                            ) : (
                                                <span className="text-red-500">Chưa phân công</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-4 mt-auto">
                    <span>Số hướng dẫn viên đã chọn: {selectedGuides.length}</span>
                    <div className="flex">
                        <button onClick={onClose} className="border border-gray-300 px-4 py-2 rounded-md text-gray-700">Hủy</button>
                        <button onClick={handleAssign} className="bg-red-700 text-white px-4 py-2 rounded-md ml-4">Phân công</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
