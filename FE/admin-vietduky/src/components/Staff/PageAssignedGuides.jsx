import { useEffect, useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import { getTravelGuidesByStaffId } from "../../services/API/staff.service.js";
import {getUserById} from "../../services/API/user.service.js";

export default function PageAssignedGuides() {
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
                const guideList = await getTravelGuidesByStaffId(id);
                setGuides(guideList);
                setCurrentPage(1);

                const staff = await getUserById(id);

                setStaffInfo({
                    displayName: staff.displayName || "Nhân viên",
                    email: staff.email || "—",
                    gender: staff.gender || "—",           // nếu có
                    phonenumber: staff.phonenumber || "—"  // nếu có
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

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const formatDate = (isoDate) => {
        return isoDate ? new Date(isoDate).toLocaleDateString("vi-VN") : "—";
    };

    return (
        <div className="p-4 bg-white rounded-md">
            <h1 className="text-2xl font-bold mb-4">Danh sách hướng dẫn viên đã gán</h1>

            {/* Thanh tìm kiếm */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                    <LuSearch className="absolute left-3 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bằng từ khóa"
                        className="pl-10 pr-4 py-2 border rounded-md w-lg"
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
                        <input readOnly value={staffInfo.displayName} className="w-full border px-2 py-1 rounded bg-gray-50" />
                    </div>
                    <div>
                        <label className="text-gray-500">Email</label>
                        <input readOnly value={staffInfo.email} className="w-full border px-2 py-1 rounded bg-gray-50" />
                    </div>
                    <div>
                        <label className="text-gray-500">Giới tính</label>
                        <input readOnly value={staffInfo.gender} className="w-full border px-2 py-1 rounded bg-gray-50" />
                    </div>
                    <div>
                        <label className="text-gray-500">Số điện thoại</label>
                        <input readOnly value={staffInfo.phonenumber} className="w-full border px-2 py-1 rounded bg-gray-50" />
                    </div>
                </div>
            )}

            {/* Bảng danh sách hướng dẫn viên */}
            <table className="w-full border-collapse">
                <thead>
                <tr className="text-left text-gray-700 border-b">
                    <th className="p-2">#</th>
                    <th className="p-2">Tài khoản</th>
                    <th className="p-2">Họ tên</th>
                    <th className="p-2">Giới tính</th>
                    <th className="p-2">Ngày sinh</th>
                    <th className="p-2">Số điện thoại</th>
                    <th className="p-2">Trạng thái</th>
                    <th className="p-2 text-right">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {paginatedGuides.map((guide, index) => (
                    <tr key={guide.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="p-3">{guide.last_name} {guide.first_name}</td>
                        <td className="p-3">{guide.email}</td>
                        <td className="p-3">{guide.gender_guide === "male" ? "Nam" : "Nữ"}</td>
                        <td className="p-3">{formatDate(guide.birth_date)}</td>
                        <td className="p-3">{guide.number_phone}</td>
                        <td className="p-3">Trạng thái</td>
                        <td className="p-3 text-right">
                            <MdOutlineDeleteForever className="text-red-500 text-lg cursor-pointer hover:text-red-900" />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2 text-sm">
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
                            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-red-700 text-white" : ""}`}
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
        </div>
    );
}
