import { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import Layout from "../../layouts/LayoutManagement.jsx";
import {deleteDirectory, getAllDirectories} from "../../services/API/directory.service.js";
import ModalAddDirectory from "../../components/ModalManage/ModalAdd/ModalAddDirectory.jsx";
import DropdownMenuDirectory from "../../components/Dropdown/DropdownDirectory.jsx";
import {toast} from "react-toastify";

export default function ManagementDirectory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [directories, setDirectories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const totalPages = Math.ceil(directories.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentDirectories = directories.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        fetchDirectories();
    }, []);

    const fetchDirectories = async () => {
        try {
            const data = await getAllDirectories();
            setDirectories(data);
        } catch (err) {
            console.error("❌ Lỗi khi lấy danh mục:", err);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(directories.map((item) => item.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectItem = (id) => {
        const updated = selectedItems.includes(id)
            ? selectedItems.filter((item) => item !== id)
            : [...selectedItems, id];

        setSelectedItems(updated);
        setSelectAll(updated.length === directories.length);
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) return;
        setDirectories((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        setSelectAll(false);
    };

    const handleDeleteDirectory = async (id) => {
        if (!confirm("Bạn có chắc chắn muốn xoá danh mục này không?")) return;
        try {
            await deleteDirectory(id);
            toast.success("Xoá danh mục thành công!");
            await fetchDirectories();
        } catch (error) {
            console.error("❌ Lỗi khi xoá danh mục:", error);
            toast.error("Xoá danh mục thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div title="Quản lý Danh Mục">
            <div className="p-4 bg-white rounded-md">
                {/* Search + Actions */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <LuSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục"
                            className="pl-10 pr-4 py-2 border rounded-md w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {selectedItems.length > 0 && (
                        <button
                            className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
                            onClick={handleDeleteSelected}
                        >
                            Xóa danh mục
                        </button>
                    )}

                    <button
                        className="bg-red-700 text-white px-4 py-2 rounded-md"
                        onClick={() => setShowModal(true)}
                    >
                        Thêm danh mục
                    </button>
                </div>

                {/* Table */}
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-left text-gray-700 border-b">
                        <th className="p-2">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="accent-red-700"
                            />
                        </th>
                        <th className="p-2">STT</th>
                        <th className="p-2">Tên danh mục</th>
                        <th className="p-2">Alias</th>
                        <th className="p-2 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentDirectories.map((item, index) => (
                        <tr key={item.id} className="border-t">
                            <td className="p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelectItem(item.id)}
                                    className="accent-red-700"
                                />
                            </td>
                            <td className="p-2">{indexOfFirstItem + index + 1}</td>
                            <td className="p-2">{item.name_directory}</td>
                            <td className="p-2">{item.alias}</td>
                            <td className="p-2 text-right">
                                <DropdownMenuDirectory
                                    directoryId={item.id}
                                    isOpen={openDropdown === item.id}
                                    setOpenDropdown={(id) => setOpenDropdown(id)}
                                    onEdit={() => console.log("Sửa:", item.id)}
                                    onDelete={() => handleDeleteDirectory(item.id)}
                                />

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`px-3 py-1 border rounded ${
                                    page === currentPage ? "bg-red-600 text-white" : "bg-white text-gray-700"
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <ModalAddDirectory
                    onClose={() => setShowModal(false)}
                    onCreated={fetchDirectories}
                />
            )}
        </div>
    );
}
