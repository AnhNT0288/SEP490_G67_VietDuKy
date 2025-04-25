import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import ModalAddService from "../../components/ModalManage/ModalAdd/ModalAddService.jsx";
import {deleteService, getService} from "../../services/API/service.service.js";
import DropdownMenuService from "../../components/Dropdown/DropdownService.jsx";
import ModalUpdateService from "../../components/ModalManage/ModalUpdate/ModalUpdateService.jsx";

export default function ManagementService() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [services, setServices] = useState([]); // Dữ liệu dịch vụ từ API
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // Mở/đóng modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Xử lý thêm dịch vụ thành công từ modal
    const handleSuccess = (newService) => {
        setServices((prev) => [...prev, newService]);
    };

    // Gọi API lấy danh sách dịch vụ
// Thêm ngoài useEffect
    const fetchServices = async () => {
        try {
            const result = await getService();
            if (result && Array.isArray(result.data)) {
                setServices(result.data);
            } else {
                console.error("Dữ liệu API không đúng định dạng:", result);
                setServices([]);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            setServices([]);
        }
    };

// useEffect chỉ gọi fetchServices 1 lần lúc load
    useEffect(() => {
        fetchServices();
    }, []);

    // Lọc danh sách dịch vụ theo tìm kiếm
    const filteredServices = services.filter((service) =>
        service.name_service.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleUpdateService = (id) => {
        console.log("Cập nhật dịch vụ id:", id);
        setSelectedServiceId(id);
        setIsEditModalOpen(true);
    };

    const handleDeleteService = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?");
        if (!confirmDelete) return;

        try {
            await deleteService(id);
            alert("Xóa dịch vụ thành công!");
            fetchServices(); // ✅ reload lại danh sách dịch vụ mới nhất
        } catch (error) {
            alert("Xóa dịch vụ thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div title="Quản lý Dịch vụ">
            <div className="p-4 bg-white rounded-md">
                {/* Thanh tìm kiếm & Nút hành động */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <LuSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ"
                            className="pl-10 pr-4 py-2 border rounded-md w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="border border-red-600 text-red-600 px-4 py-2 rounded-md">
                        Nhập d.sách dịch vụ
                    </button>
                    <button
                        className="bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
                        onClick={toggleModal}
                    >
                        Thêm dịch vụ
                    </button>
                </div>

                {/* Bảng danh sách dịch vụ */}
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-left text-gray-700 border-b">
                        <th className="p-2">Tên dịch vụ</th>
                        <th className="p-2">Mô tả</th>
                        <th className="p-2">Giá</th>
                        <th className="p-2 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                            <tr key={service.id} className="border-t">
                                <td className="p-2">{service.name_service}</td>
                                <td className="p-2">{service.description_service}</td>
                                <td className="p-2">
                                    {(service.price_service ?? 0).toLocaleString()} VNĐ
                                </td>
                                <td className="p-2 text-right">
                                    <DropdownMenuService
                                        serviceId={service.id}
                                        onEditService={handleUpdateService}
                                        onDeleteService={handleDeleteService}
                                        isOpen={openDropdownId === service.id}
                                        setOpenDropdown={setOpenDropdownId}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-4 text-center text-gray-500">
                                Không tìm thấy dịch vụ nào.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Modal thêm dịch vụ */}
                {isModalOpen && (
                    <ModalAddService onClose={toggleModal} onSuccess={handleSuccess} />
                )}
                {isEditModalOpen && selectedServiceId && (
                    <ModalUpdateService
                        serviceId={selectedServiceId}
                        onClose={() => setIsEditModalOpen(false)}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            fetchServices();  // ✅ Reload lại bảng dịch vụ ngay sau khi cập nhật xong
                        }}
                    />
                )}


            </div>
        </div>
    );
}
