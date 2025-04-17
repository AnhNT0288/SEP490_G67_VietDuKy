import { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import Layout from "../../../layouts/LayoutManagement";
import ModalAddUser from "../../../components/ModalManage/ModalUser/ModalAddUser.jsx";
import { getAllAccounts } from "../../../services/API/accounts.services";
import DropdownMenuUser from "../../../components/Dropdown/DropdownMenuUser.jsx";
import ModalUpdateGuide from "../../../components/ModalManage/ModalUpdate/ModalUpdateGuide.jsx";

export default function ManagementUserRole() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllAccounts();
                setUsers(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = Array.isArray(users)
        ? users.filter((user) =>
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    const toggleAddTourModal = () => {
        setIsAddTourModalOpen(!isAddTourModalOpen);
    };

    const handleLockAccount = (userId) => {
        console.log(`Locking account for user: ${userId}`);
    };

    const handleEditUser = (user) => {
        console.log(`Editing user: ${user.id}`);
    };

    const handleUpdatePermissions = (user) => {
        setSelectedUser(user); // Set the selected user
        setIsUpdateModalOpen(true); // Open the modal
    };
    return (
        <Layout title="Quản lý Tài Khoản">
            <div className="p-4 bg-white rounded-md">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <LuSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bằng từ khóa"
                            className="pl-10 pr-4 py-2 border rounded-md w-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-red-700 text-white px-4 py-2 rounded-md" onClick={toggleAddTourModal}>
                        Thêm tài khoản
                    </button>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-gray-700 border-b">
                            <th className="p-2">Tài khoản</th>
                            <th className="p-2">Họ tên</th>
                            <th className="p-2">Quyền</th>
                            <th className="p-2">Trạng thái</th>
                            <th className="p-2 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="p-2 truncate max-w-xs">{user.email || "N/A"}</td>
                                    <td className="p-2">{user.displayName || "N/A"}</td>
                                    <td className="p-2">
                                        {user.role_id === 1
                                            ? "Customer"
                                            : user.role_id === 2
                                            ? "Staff"
                                            : user.role_id === 3
                                            ? "Admin"
                                            : user.role_id === 4
                                            ? "Tour Guide"
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
                                <td colSpan="5" className="p-2 text-center">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {isAddTourModalOpen && <ModalAddUser onClose={toggleAddTourModal} />}
                {isUpdateModalOpen && (
                    <ModalUpdateGuide
                        onClose={() => setIsUpdateModalOpen(false)}
                        user={selectedUser}
                    />
                )}
            </div>
        </Layout>
    );
}