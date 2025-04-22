import { useEffect, useState } from "react";
import {
    getAssignedTravelGuidesByStaffId,
    unassignGuideFromStaff
} from "../../../services/API/staff.service.js";
import {MdOutlineDeleteForever} from "react-icons/md";

// eslint-disable-next-line react/prop-types
export default function ModalViewGuidesOfStaff({ staff, onClose }) {
    const [guides, setGuides] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const data = await getAssignedTravelGuidesByStaffId(staff.id);
                setGuides(data);
            } catch (error) {
                console.error("Không thể lấy danh sách hướng dẫn viên đã gán:", error);
            }
        };

        if (staff?.id) fetchGuides();
    }, [staff]);

    const handleUnassign = async (guideId) => {
        console.log("Unassign request:", {
            // eslint-disable-next-line react/prop-types
            user_id: staff.id,
            travel_guide_ids: [guideId],
        });

        try {
            // eslint-disable-next-line react/prop-types
            await unassignGuideFromStaff(staff.id, [guideId]);
            setGuides((prev) => prev.filter((g) => g.id !== guideId));
            alert("🗑️ Đã xoá hướng dẫn viên khỏi nhân viên!");
        } catch (err) {
            const errorMessage =
                err?.response?.data?.message || "Xảy ra lỗi khi xoá hướng dẫn viên!";
            alert(errorMessage);
            console.error("Lỗi khi xoá hướng dẫn viên:", err?.response?.data || err);
        }
    };


    const formatDate = (isoDate) => {
        return isoDate ? new Date(isoDate).toLocaleDateString("vi-VN") : "—";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 h-6/8 overflow-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Danh sách hướng dẫn viên đã gán</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
                </div>

                {/* Thông tin staff */}
                {staff && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <input
                            className="border px-3 py-2 rounded"
                            readOnly
                            value={staff.displayName || staff.name || "—"}
                            placeholder="Họ tên nhân viên"
                        />
                        <input
                            className="border px-3 py-2 rounded"
                            readOnly
                            value={staff.email || "—"}
                            placeholder="Email"
                        />
                        <input
                            className="border px-3 py-2 rounded"
                            readOnly
                            value={staff.gender || "—"}
                            placeholder="Giới tính"
                        />
                        <input
                            className="border px-3 py-2 rounded"
                            readOnly
                            value={staff.phonenumber || "—"}
                            placeholder="Số điện thoại"
                        />
                    </div>
                )}

                {/* Danh sách hướng dẫn viên */}
                <div className="overflow-x-auto  rounded min-h-[450px]">
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-2 ">#</th>
                            <th className="p-2 ">Họ tên</th>
                            <th className="p-2 ">Email</th>
                            <th className="p-2 ">Giới tính</th>
                            <th className="p-2 ">Ngày sinh</th>
                            <th className="p-2 ">Số điện thoại</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedGuides.map((guide, index) => (
                            <tr key={guide.id} className="hover:bg-gray-50">
                                <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="p-2 ">{guide.last_name} {guide.first_name}</td>
                                <td className="p-2 ">{guide.email}</td>
                                <td className="p-2 ">{guide.gender_guide === "male" ? "Nam" : "Nữ"}</td>
                                <td className="p-2 ">{formatDate(guide.birth_date)}</td>
                                <td className="p-2 ">{guide.number_phone}</td>
                                <td className="p-2 text-center">
                                    <button
                                        onClick={() => handleUnassign(guide.id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Xoá hướng dẫn viên khỏi nhân viên"
                                    >
                                        <MdOutlineDeleteForever className="text-lg" />
                                    </button>
                                </td>
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

                {guides.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">Chưa có hướng dẫn viên nào được gán.</div>
                )}

                {/* Footer */}
                <div className="flex justify-end items-center mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
