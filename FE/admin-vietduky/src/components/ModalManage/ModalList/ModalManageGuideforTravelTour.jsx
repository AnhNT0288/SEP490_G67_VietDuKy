import { useEffect, useState } from "react";
import ModalAssignGuide from "../ModalAdd/ModalAssignGuide.jsx";
import { getGuidesByTravelTourId } from "../../../services/API/guide_tour.services";

// eslint-disable-next-line react/prop-types
export default function ModalManageGuideforTravelTour({ travel_tour_id, locationId, onClose }) {
    const [guides, setGuides] = useState([]);
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [filterGender, setFilterGender] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const data = await getGuidesByTravelTourId(travel_tour_id);
                setGuides(data);
            } catch (error) {
                console.error("Không thể load danh sách hướng dẫn viên đã gán:", error);
            }
        };

        if (travel_tour_id) {
            fetchGuides();
        }
    }, [travel_tour_id]);

    // Lọc theo giới tính
    const filteredGuides = guides.filter((guide) => {
        if (filterGender === "all") return true;
        return guide.gender === filterGender;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentGuides = filteredGuides.slice(startIndex, startIndex + itemsPerPage);

    const handleGenderChange = (e) => {
        setFilterGender(e.target.value);
        setCurrentPage(1); // reset về trang đầu
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-[80%] h-[70%] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-3 mb-3">
                    <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-xl font-semibold">Hướng dẫn viên đã phân công</h2>
                        <select
                            value={filterGender}
                            onChange={handleGenderChange}
                            className="border border-gray-300 rounded-md px-2 py-1"
                        >
                            <option value="all">Tất cả</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setOpenAssignModal(true)}
                        className="bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                        Thêm hướng dẫn viên
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    {currentGuides.length === 0 ? (
                        <p className="text-gray-600">Không có hướng dẫn viên phù hợp.</p>
                    ) : (
                        <table className="w-full table-auto border-collapse">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left w-12">STT</th>
                                <th className="p-2 text-left">Tên</th>
                                <th className="p-2 text-left">Giới tính</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-left">SĐT</th>
                                <th className="p-2 text-left">Ảnh đại diện</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentGuides.map((guide, index) => (
                                <tr key={guide.id} className="border-t">
                                    <td className="p-2">{startIndex + index + 1}</td>
                                    <td className="p-2">{guide.display_name}</td>
                                    <td className="p-2">
                                        {guide.gender === "male"
                                            ? "Nam"
                                            : guide.gender === "female"
                                                ? "Nữ"
                                                : "Khác"}
                                    </td>
                                    <td className="p-2">{guide.email || "Chưa có"}</td>
                                    <td className="p-2">{guide.phone || "Chưa có"}</td>
                                    <td className="p-2">
                                        {guide.avatar ? (
                                            <img
                                                src={guide.avatar}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span>Không có ảnh</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 rounded-md border ${
                                    currentPage === i + 1
                                        ? "bg-red-600 text-white"
                                        : "bg-white text-gray-700"
                                }`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="pt-4 flex justify-end border-t border-gray-200 mt-4">
                    <button
                        onClick={onClose}
                        className="border border-gray-300 px-4 py-2 rounded-md text-gray-700"
                    >
                        Hủy
                    </button>
                </div>

                {openAssignModal && (
                    <ModalAssignGuide
                        travel_tour_id={travel_tour_id}
                        locationId={locationId}
                        onClose={() => setOpenAssignModal(false)}
                        onAssignSuccess={() => {
                            setOpenAssignModal(false);
                            setTimeout(() => {
                                getGuidesByTravelTourId(travel_tour_id).then(setGuides);
                            }, 300);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
