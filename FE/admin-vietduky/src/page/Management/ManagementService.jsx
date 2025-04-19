import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import ModalAddService from "../../components/ModalManage/ModalAdd/ModalAddService.jsx";

export default function ManagementService() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [services, setServices] = useState([]); // Dữ liệu dịch vụ từ API

    // Mở/đóng modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Xử lý thêm dịch vụ thành công từ modal
    const handleSuccess = (newService) => {
        setServices((prev) => [...prev, newService]);
    };

    // Gọi API lấy danh sách dịch vụ
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/service/");
                const result = await response.json();
                console.log("Dữ liệu từ API:", result);

                if (result.data && Array.isArray(result.data)) {
                    setServices(result.data); // ✅ Lấy danh sách từ `data`
                } else {
                    console.error("Dữ liệu API không đúng định dạng:", result);
                    setServices([]);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setServices([]);
            }
        };

        fetchServices();
    }, []);

    // Lọc danh sách dịch vụ theo tìm kiếm
    const filteredServices = services.filter((service) =>
        service.name_service.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                <td className="p-2 text-right">...</td>
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
            </div>
        </div>
    );
}
