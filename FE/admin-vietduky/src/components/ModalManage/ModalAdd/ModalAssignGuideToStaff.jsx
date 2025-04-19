import { useEffect, useState } from "react";
import { getAllTravelGuides} from "../../../services/API/guide_tour.services";
import {assignTravelGuidesToStaff} from "../../../services/API/staff.service.js";

// eslint-disable-next-line react/prop-types
export default function ModalAssignGuideToStaff({ staff, onClose }) {
    const [guides, setGuides] = useState([]);
    const [selectedGuideIds, setSelectedGuideIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        console.log("👤 Nhân viên truyền vào modal:", staff);

        const fetchGuides = async () => {
            try {
                const data = await getAllTravelGuides();
                setGuides(data);
            } catch (error) {
                console.error("❌ Không thể load hướng dẫn viên:", error);
            }
        };
        fetchGuides();
    }, []);

    const handleCheck = (guideId) => {
        setSelectedGuideIds((prev) =>
            prev.includes(guideId)
                ? prev.filter((id) => id !== guideId)
                : [...prev, guideId]
        );
    };

    const handleAssign = async () => {
        if (!selectedGuideIds.length) {
            alert("Vui lòng chọn ít nhất một hướng dẫn viên!");
            return;
        }

        try {
            await assignTravelGuidesToStaff({
                // eslint-disable-next-line react/prop-types
                user_id: staff.id,
                travel_guide_ids: selectedGuideIds
            });
            alert("Phân công thành công!");
            onClose();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert("Phân công thất bại!");
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "—";
        const date = new Date(isoDate);
        return date.toLocaleDateString("vi-VN");
    };

    const totalPages = Math.ceil(guides.length / itemsPerPage);

    const paginatedGuides = guides.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const isAllSelectedOnPage = paginatedGuides.every(guide => selectedGuideIds.includes(guide.id));

    const handleSelectAllChange = () => {
        if (isAllSelectedOnPage) {
            // Bỏ chọn tất cả trên trang hiện tại
            setSelectedGuideIds((prev) => prev.filter(id => !paginatedGuides.some(g => g.id === id)));
        } else {
            // Chọn tất cả trên trang hiện tại
            const newIds = paginatedGuides.map(g => g.id);
            setSelectedGuideIds((prev) => [...new Set([...prev, ...newIds])]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 h-6/8 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Gán hướng dẫn viên cho nhân viên</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
                </div>

                {/* Thông tin staff */}
                {staff && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <input className="border px-3 py-2 rounded" readOnly value={staff.displayName || "—"} placeholder="Họ tên nhân viên" />
                        <input className="border px-3 py-2 rounded" readOnly value={staff.gender || "—"} placeholder="Giới tính" />
                        <input className="border px-3 py-2 rounded" readOnly value={staff.dob || "—"} placeholder="Ngày sinh" />
                        <input className="border px-3 py-2 rounded" readOnly value={staff.phonenumber || "—"} placeholder="Số điện thoại" />
                    </div>
                )}

                {/* Bảng danh sách hướng dẫn viên */}
                <div className="overflow-x-auto  rounded min-h-[450px]">
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelectedOnPage}
                                    onChange={handleSelectAllChange}
                                />
                            </th>
                            <th className="p-2">Họ tên</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Giới tính</th>
                            <th className="p-2">Ngày sinh</th>
                            <th className="p-2">Số điện thoại</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedGuides.map((guide) => (
                            <tr key={guide.id} className="hover:bg-gray-50">
                                <td className="p-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedGuideIds.includes(guide.id)}
                                        onChange={() => handleCheck(guide.id)}
                                    />
                                </td>
                                <td className="p-2">{guide.last_name} {guide.first_name}</td>
                                <td className="p-2">{guide.email}</td>
                                <td className="p-2">{guide.gender_guide === "male" ? "Nam" : "Nữ"}</td>
                                <td className="p-2">{formatDate(guide.birth_date)}</td>
                                <td className="p-2">{guide.number_phone}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2 text-sm">
                        <button
                            className="px-2 py-1 border rounded"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 border rounded ${
                                    currentPage === i + 1 ? "bg-red-700 text-white" : ""
                                }`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="px-2 py-1 border rounded"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-500 text-sm">
                        Đã chọn {selectedGuideIds.length} hướng dẫn viên
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleAssign}
                            className="bg-red-700 text-white px-4 py-2 rounded-md"
                        >
                            Phân công
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
