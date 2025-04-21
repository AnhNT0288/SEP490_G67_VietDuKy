import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import ModalAddTourGuide from "../../../components/ModalManage/ModalUser/ModalAddTourGuide.jsx";
import { getStaffList } from "../../../services/API/staff.service.js";
import DropdownMenuStaff from "../../../components/Dropdown/DropdownMenuStaff.jsx";
import ModalAssignGuideToStaff from "../../../components/ModalManage/ModalAdd/ModalAssignGuideToStaff.jsx";
import ModalViewGuidesOfStaff from "../../../components/ModalManage/ModalList/ModalViewGuidesOfStaff.jsx";
import ModalAssignLocationToStaff from "../../../components/ModalManage/ModalAdd/ModalAssignLocationToStaff.jsx";
import ModalViewLocationsOfStaff from "../../../components/ModalManage/ModalList/ModalViewLocationsOfStaff.jsx"; // ✅ thêm modal

export default function ManagementStaff() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingStaff, setViewingStaff] = useState(null);
    const [isAssignLocationOpen, setIsAssignLocationOpen] = useState(false);
    const [selectedStaffForLocation, setSelectedStaffForLocation] = useState(null);
    const [isViewLocationsModalOpen, setIsViewLocationsModalOpen] = useState(false);
    const [staffToViewLocations, setStaffToViewLocations] = useState(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await getStaffList();
                setUsers(data);
            } catch (error) {
                console.error("❌ Không thể tải danh sách staff:", error);
            }
        };

        fetchStaff();
    }, []);

    const toggleAddTourModal = () => {
        setIsAddTourModalOpen(!isAddTourModalOpen);
    };

    const filteredUsers = users.filter(user =>
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / 10);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * 10,
        currentPage * 10
    );

    const handleAddGuide = (staff) => {
        setSelectedStaff(staff);
        setIsModalAssignOpen(true);
    };

    const handleViewGuides = (staff) => {
        setViewingStaff(staff);
        setIsViewModalOpen(true);
    };

    const handleAssignLocation = (staff) => {
        setSelectedStaffForLocation(staff);
        setIsAssignLocationOpen(true);
    };
    const handleViewLocations = (staff) => {
        setStaffToViewLocations(staff);
        setIsViewLocationsModalOpen(true);
    };
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div title="Quản lý Tài Khoản">
            <div className="p-4 bg-white rounded-md">
                {/* Thanh tìm kiếm */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <LuSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bằng từ khóa"
                            className="pl-10 pr-4 py-2 border rounded-md w-full"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <button className="bg-red-700 text-white px-4 py-2 rounded-md" onClick={toggleAddTourModal}>
                        Thêm tài khoản
                    </button>
                </div>

                {/* Danh sách nhân viên */}
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
                    {paginatedUsers.map((user, index) => (
                        <tr key={user.id} className="border-t">
                            <td className="p-2">{(currentPage - 1) * 10 + index + 1}</td>
                            <td className="p-2 truncate max-w-xs">{user.email}</td>
                            <td className="p-2">{user.displayName || "—"}</td>
                            <td className="p-2">{user.gender || "—"}</td>
                            <td className="p-2">{user.dob || "—"}</td>
                            <td className="p-2">{user.phonenumber || "—"}</td>
                            <td className={`p-2 ${user.status ? "text-green-600" : "text-red-600"}`}>
                                {user.status ? "Hoạt động" : "Chặn truy cập"}
                            </td>
                            <td className="p-2 text-right">
                                <DropdownMenuStaff
                                    staff={user}
                                    isOpen={openDropdown === user.id}
                                    setOpenDropdown={setOpenDropdown}
                                    onAddGuide={handleAddGuide}
                                    onViewGuides={handleViewGuides}
                                    onAssignLocation={handleAssignLocation}
                                    onViewLocations={handleViewLocations}

                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 gap-2 text-sm">
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

                {/* Modals */}
                {isAddTourModalOpen && <ModalAddTourGuide onClose={toggleAddTourModal} />}
                {isModalAssignOpen && selectedStaff && (
                    <ModalAssignGuideToStaff
                        staff={selectedStaff}
                        onClose={() => {
                            setIsModalAssignOpen(false);
                            setSelectedStaff(null);
                        }}
                    />
                )}
                {isViewModalOpen && viewingStaff && (
                    <ModalViewGuidesOfStaff
                        staff={viewingStaff}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setViewingStaff(null);
                        }}
                    />
                )}
                {isAssignLocationOpen && selectedStaffForLocation && (
                    <ModalAssignLocationToStaff
                        staff={selectedStaffForLocation}
                        onClose={() => {
                            setIsAssignLocationOpen(false);
                            setSelectedStaffForLocation(null);
                        }}
                    />
                )}
                {isViewLocationsModalOpen && staffToViewLocations && (
                    <ModalViewLocationsOfStaff
                        staff={staffToViewLocations}
                        onClose={() => {
                            setIsViewLocationsModalOpen(false);
                            setStaffToViewLocations(null);
                        }}
                    />
                )}

            </div>
        </div>
    );
}
