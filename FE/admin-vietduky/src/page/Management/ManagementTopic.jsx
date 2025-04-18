import { useEffect, useState } from "react";
import Layout from "../../layouts/LayoutManagement";
import { LuSearch } from "react-icons/lu";
import ModalAddTopic from "../../components/ModalManage/ModalAdd/ModalAddTopic.jsx";
import { getTopics, updateTopic, deleteTopic } from "../../services/API/topic.service.js";
import DropdownMenuTopic from "../../components/Dropdown/DropdowMenuTopic.jsx";
import ModalUpdateTopic from "../../components/ModalManage/ModalUpdate/ModalUpdateTopic.jsx";
import ModalAddTourToTopic from "../../components/ModalManage/ModalAdd/ModalAddTourToTopic.jsx";
import {getToursByTopic} from "../../services/API/tour.service.js";
import ModalViewToursOfTopic from "../../components/ModalManage/ModalList/ModalManageTourbyTopic.jsx";

export default function ManagementTour() {
    const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [topics, setTopics] = useState([]);
    const [toursOfTopic, setToursOfTopic] = useState([]);
    const [showTourListModal, setShowTourListModal] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showModalAddTourToTopic, setShowModalAddTourToTopic] = useState(false);

    useEffect(() => {
        const fetchTopics = async () => {
            const data = await getTopics();
            setTopics(
                data.map((item) => ({
                    ...item,
                    checked: item.active,
                }))
            );
        };
        fetchTopics();
    }, []);

    const toggleAddTourModal = () => {
        setIsAddTourModalOpen(!isAddTourModalOpen);
    };

    const handleToggleActive = async (topic) => {
        const updatedData = {
            name: topic.name,
            description: topic.description,
            active: !topic.active,
        };

        try {
            await updateTopic(topic.id, updatedData);
            setTopics((prev) =>
                prev.map((t) =>
                    t.id === topic.id ? { ...t, active: !t.active, checked: !t.active } : t
                )
            );
        } catch (error) {
            alert("Cập nhật trạng thái thất bại.");
            console.error(error);
        }
    };

    const handleDeleteTopic = async (id) => {
        try {
            await deleteTopic(id);
            setTopics((prev) => prev.filter((t) => t.id !== id));
            alert("Xóa chủ đề thành công!");
        } catch (error) {
            alert("Xóa thất bại!");
            console.error(error);
        }
    };

    const handleEditTopic = (topic) => {
        setEditingTopic(topic);
        setShowEditModal(true);
    };

    const handleViewToursOfTopic = async (topic) => {
        try {
            const tours = await getToursByTopic(topic.id);
            setToursOfTopic(tours);
            setShowTourListModal(true);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tour của chủ đề:", error);
        }
    };
    return (
        <Layout title="Quản lý Tour">
            <div className="bg-white p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="relative flex-1 max-w-xs">
                        <LuSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bằng từ khóa"
                            className="pl-10 pr-4 py-2 border rounded-md w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button className="border border-red-700 text-red-700 px-4 py-2 rounded-md">
                            Nhập danh sách chủ đề
                        </button>
                        <button
                            className="bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
                            onClick={toggleAddTourModal}
                        >
                            Thêm chủ đề mới
                        </button>
                    </div>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b text-gray-700">
                        <th className="p-2 text-left">Tên chủ đề</th>
                        <th className="p-2 text-left">Trạng thái</th>
                        <th className="p-2 text-left">Mô tả chủ đề</th>
                        <th className="p-2 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {topics
                        .filter(
                            (topic) =>
                                topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                topic.description.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((topic) => (
                            <tr key={topic.id} className="border-t text-gray-900">
                                <td className="p-2">{topic.name}</td>
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={topic.active}
                                        onChange={() => handleToggleActive(topic)}
                                        className="accent-red-700 cursor-pointer"
                                    />
                                </td>
                                <td className="p-2">{topic.description}</td>
                                <td className="p-2 text-right">
                                    <div className="text-gray-600">
                                        <DropdownMenuTopic
                                            topic={topic}
                                            isOpen={openDropdown === topic.id}
                                            setOpenDropdown={setOpenDropdown}
                                            onAddTourToTopic={(t) => {
                                                setEditingTopic(t);
                                                setShowModalAddTourToTopic(true);
                                            }}
                                            onViewTours={handleViewToursOfTopic}
                                            onDeleteTopic={(id) => handleDeleteTopic(id)}
                                            onEditTopic={(t) => handleEditTopic(t)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isAddTourModalOpen && (
                    <ModalAddTopic
                        onClose={toggleAddTourModal}
                        onCreateSuccess={(newTopic) => {
                            setTopics((prev) => [...prev, newTopic]);
                            toggleAddTourModal();
                        }}
                    />
                )}
                {/* Modal chỉnh sửa chủ đề */}
                {showEditModal && editingTopic && (
                    <ModalUpdateTopic
                        topic={editingTopic}
                        onClose={() => setShowEditModal(false)}
                        onUpdate={(updatedTopic) => {
                            setTopics(prev =>
                                prev.map(t => (t.id === updatedTopic.id ? updatedTopic : t))
                            );
                        }}
                    />
                )}

                {/* Modal thêm tour vào chủ đề */}
                {showModalAddTourToTopic && editingTopic && (
                    <ModalAddTourToTopic
                        topic={editingTopic}
                        onClose={() => setShowModalAddTourToTopic(false)}
                    />
                )}
                {showTourListModal && (
                    <ModalViewToursOfTopic
                        tours={toursOfTopic}
                        onClose={() => setShowTourListModal(false)}
                    />
                )}
            </div>
        </Layout>
    );
}
