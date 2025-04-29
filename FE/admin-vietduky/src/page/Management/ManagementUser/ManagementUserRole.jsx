import { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import ModalAddUser from "../../../components/ModalManage/ModalUser/ModalAddUser.jsx";
import { getAllAccounts } from "../../../services/API/accounts.services";
import DropdownMenuUser from "../../../components/Dropdown/DropdownMenuUser.jsx";
import ModalUpdateUser from "../../../components/ModalManage/ModalUpdate/ModalUpdateUser.jsx";
import {updateUserStatus} from "../../../services/API/user.service.js";

export default function ManagementUserRole() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 12;

    const fetchUsers = async () => {
        try {
            const response = await getAllAccounts();
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = Array.isArray(users)
        ? users.filter((user) =>
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleLockAccount = async (user) => {
        try {
            await updateUserStatus(user.id);
            await fetchUsers(); // Load lại danh sách
        } catch (error) {
            console.error("Failed to update user status:", error);
        }
    };

    const toggleAddTourModal = () => {
        setIsAddTourModalOpen(!isAddTourModalOpen);
    };

    const handleEditUser = (user) => {
        console.log(`Editing user: ${user.id}`);
    };

    const handleUpdatePermissions = (user) => {
        setSelectedUser(user);
        setIsUpdateModalOpen(true);
    };

    return (
        <div title="Quản lý Tài Khoản">
            <div className="p-4 bg-white rounded-md">
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
                    <button className="bg-red-700 text-white px-4 py-2 rounded-md" onClick={toggleAddTourModal}>
                        Thêm tài khoản
                    </button>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-left text-gray-700 border-b">
                        <th className="p-2 text-center w-12">#</th>
                        <th className="p-2">Tài khoản</th>
                        <th className="p-2">Họ tên</th>
                        <th className="p-2">Quyền</th>
                        <th className="p-2">Trạng thái</th>
                        <th className="p-2 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user, index) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-2 text-center">
                                    {(currentPage - 1) * usersPerPage + index + 1}
                                </td>
                                <td className="p-2 truncate max-w-xs">{user.email || "N/A"}</td>
                                <td className="p-2">{user.displayName || "N/A"}</td>
                                <td className="p-2">
                                    {user.role_id === 1
                                        ? "Khách hàng"
                                        : user.role_id === 2
                                            ? "Nhân viên"
                                            : user.role_id === 3
                                                ? "Quản trị viên"
                                                : user.role_id === 4
                                                    ? "Hướng dẫn viên"
                                                    : "Unknown"}
                                </td>
                                <td className={`p-2 ${user.status ? "text-green-600" : "text-red-600"}`}>
                                    {user.status ? "Hoạt động" : "Chặn truy cập"}
                                </td>
                                <td className="p-2 text-right">
                                    <DropdownMenuUser
                                        user={user}
                                        isOpen={openDropdown === user.id}
                                        setOpenDropdown={setOpenDropdown}
                                        onLockAccount={handleLockAccount}
                                        onUpdatePermissions={handleUpdatePermissions}
                                        onEditUser={handleEditUser}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-2 text-center">
                                Không tìm thấy người dùng.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1
                                    ? "bg-red-700 text-white"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Modals */}
                {isAddTourModalOpen && <ModalAddUser onClose={toggleAddTourModal} />}
                {isUpdateModalOpen && (
                    <ModalUpdateUser
                        onClose={() => setIsUpdateModalOpen(false)}
                        user={selectedUser}
                        refreshUserList={fetchUsers}
                    />
                )}
            </div>
        </div>
    );
}
