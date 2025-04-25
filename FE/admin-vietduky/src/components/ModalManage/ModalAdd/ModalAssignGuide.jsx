import { useState, useEffect } from "react";
import { assignGroupGuideToTour, getGuidesByTravelTourId, getTravelGuideByLocation } from "../../../services/API/guide_tour.service.js";
import {toast} from "react-toastify"; // Đảm bảo đã import đúng hàm này

// eslint-disable-next-line react/prop-types
export default function ModalAssignGuide({ locationId, travel_tour_id, onClose, onAssignSuccess }) {
    const [guides, setGuides] = useState([]);
    const [selectedGuides, setSelectedGuides] = useState([]);
    const [assignedGuides, setAssignedGuides] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const generateGroupName = () => {
        const groupNumber = selectedGuides.length;
        const charIndex = selectedGuides.length % 26;
        const sequentialChar = String.fromCharCode(65 + charIndex);
        return `Nhóm tour ${travel_tour_id}-${groupNumber}-${sequentialChar}`;
    };

    // Fetch danh sách hướng dẫn viên khi có locationId
    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await getTravelGuideByLocation(locationId);
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
                const response = await getGuidesByTravelTourId(travel_tour_id);
                const data = await response;
                console.log("Assigned Guides Data:", response);
                
                setAssignedGuides(data.map((guide) => guide.id));
            } catch (error) {
                console.error("Lỗi khi lấy hướng dẫn viên đã phân công:", error);
            }
        };

        if (travel_tour_id) {
            console.log("Travel Tour ID trong ModalAssignGuide:", travel_tour_id);
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

    const formatSelectedGuides = () => {
        return selectedGuides.map((guideId, index) => {
            return {
                travel_guide_id: guideId,
                isLeader: index === 0
            };
        });
    };

    // console.log("Selected Guides:", selectedGuides);
    // console.log("Formatted Selected Guides:", formatSelectedGuides());
    console.log("Assigned Guides:", assignedGuides);
    

    const handleAssign = async () => {
        if (!travel_tour_id) {
            toast.error("Lỗi: Travel Tour ID không hợp lệ.");
            return;
        }

        if (selectedGuides.length === 0) {
            toast.error("Vui lòng chọn ít nhất một hướng dẫn viên để phân công.");
            return;
        }
    
        try {
            const data = {
                travel_tour_id,
                group_name: generateGroupName(),
                guides: formatSelectedGuides(),
            };
            console.log("Dữ liệu gửi đến API phân công:", data);
    
            const response = await assignGroupGuideToTour(data);
            console.log("Phản hồi từ API phân công:", response);
    
            if (response.message === "Hướng dẫn viên đã được gán cho tour này!") {
                toast.error("Một số hướng dẫn viên đã được gán trước đó.");
            } else {
                toast.success("Phân công hướng dẫn viên thành công!");
                onAssignSuccess?.();
            }
    
        } catch (error) {
            console.error("Lỗi phân công:", error);
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi phân công hướng dẫn viên. Vui lòng thử lại.");
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
                        className="p-2 w-1/3 border rounded-md"
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
