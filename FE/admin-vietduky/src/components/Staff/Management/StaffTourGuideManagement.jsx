import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import {getAssignedTravelGuidesByStaffId} from "../../../services/API/staff.service.js";
import {getUserById} from "../../../services/API/user.service.js";

export default function StaffTourGuideManagement() {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?.id;

    const [guides, setGuides] = useState([]);
    const [staffInfo, setStaffInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const guideList = await getAssignedTravelGuidesByStaffId(id);
                setGuides(guideList);
                setCurrentPage(1);

                const staff = await getUserById(id);
                setStaffInfo({
                    displayName: staff.displayName || "Nhân viên",
                    email: staff.email || "—",
                    gender: staff.gender || "—",
                    phonenumber: staff.phonenumber || "—"
                });
            } catch (error) {
                console.error("❌ Không thể tải dữ liệu:", error);
            }
        };

        if (id) fetchData();
    }, [id]);

    const filteredGuides = guides.filter((guide) =>
        `${guide.first_name} ${guide.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);
    const paginatedGuides = filteredGuides.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatDate = (isoDate) =>
        isoDate ? new Date(isoDate).toLocaleDateString("vi-VN") : "—";

    return (
        <div className="p-4 bg-white rounded-md">
            <h1 className="text-2xl font-bold mb-4">Hướng dẫn viên bạn đang quản lý</h1>

            {/* Thanh tìm kiếm */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                    <LuSearch className="absolute left-3 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên"
                        className="pl-10 pr-4 py-2 border rounded-md w-full"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Thông tin nhân viên */}
            {staffInfo && (
                <div className="bg-white border rounded-md p-4 mb-6 grid grid-cols-4 gap-4 text-sm">
                    <div>
                        <label className="text-gray-500">Họ tên</label>
                        <input
                            readOnly
                            value={staffInfo.displayName}
                            className="w-full border px-2 py-1 rounded bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Email</label>
                        <input
                            readOnly
                            value={staffInfo.email}
                            className="w-full border px-2 py-1 rounded bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Giới tính</label>
                        <input
                            readOnly
                            value={staffInfo.gender}
                            className="w-full border px-2 py-1 rounded bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="text-gray-500">Số điện thoại</label>
                        <input
                            readOnly
                            value={staffInfo.phonenumber}
                            className="w-full border px-2 py-1 rounded bg-gray-50"
                        />
                    </div>
                </div>
            )}

            {/* Danh sách hướng dẫn viên */}
            <table className="w-full border-collapse">
                <thead>
                <tr className="text-left text-gray-700 border-b">
                    <th className="p-2">#</th>
                    <th className="p-2">Họ tên</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Giới tính</th>
                    <th className="p-2">Ngày sinh</th>
                    <th className="p-2">Số điện thoại</th>
                    <th className="p-2">Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {paginatedGuides.map((guide, index) => (
                    <tr key={guide.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-3">{guide.last_name} {guide.first_name}</td>
                        <td className="p-3">{guide.email || "—"}</td>
                        <td className="p-3">
                            {guide.gender_guide === "male"
                                ? "Nam"
                                : guide.gender_guide === "female"
                                    ? "Nữ"
                                    : "—"}
                        </td>
                        <td className="p-3">{formatDate(guide.birth_date)}</td>
                        <td className="p-3">{guide.number_phone || "—"}</td>
                        <td className="p-3">{guide.status === 1 ? "Đang hoạt động" : "Không rõ"}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2 text-sm">
                    <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-red-700 text-white" : ""}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}
