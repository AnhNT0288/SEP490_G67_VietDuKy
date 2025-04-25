import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { format } from "date-fns";
import vi from "date-fns/locale/vi";
import {getUnapprovedDiscountServices} from "../../services/API/lastminutedeals.service.js";
import ModalApproveDiscount from "../../components/ModalManage/ModalAdd/ModalApproveDiscount.jsx";

export default function ManagementLastMinuteDeals() {
    const [discountServices, setDiscountServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const result = await getUnapprovedDiscountServices();
            setDiscountServices(result.data || []);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (value) => {
        return value?.toLocaleString("vi-VN") ;
    };

    const formatDate = (iso) => {
        const date = new Date(iso);
        return format(date, "EEE, dd/MM/yyyy", { locale: vi });
    };

    const handleCloseModal = (shouldReload) => {
        setIsModalOpen(false);
        setSelectedService(null);

        if (shouldReload) {
            // ✅ reload lại danh sách sau khi cập nhật
            fetchData();
        }
    };
    return (
        <div className="p-4 bg-white rounded-md">
            <h2 className="text-xl font-semibold mb-4">Danh sách lịch trình phút chót</h2>

            {/* Bộ lọc và tìm kiếm */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                    <LuSearch className="absolute left-3 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bằng từ khóa"
                        className="pl-10 pr-4 py-2 border rounded-md w-2/5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <table className="w-full text-sm">
                <thead className="text-gray-500 border-b">
                <tr>
                    <th className="text-left p-2">Tên Tour</th>
                    <th className="text-left p-2">Điểm khởi hành</th>
                    <th className="text-left p-2">Điểm đến</th>
                    <th className="text-left p-2">Ngày khởi hành</th>
                    <th className="text-left p-2">Ngày về</th>
                    <th className="text-left p-2">Giá gốc</th>
                    <th className="text-left p-2">Giá sau giảm giá</th>
                    <th className="text-left p-2 ">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {discountServices.length > 0 ? (
                    discountServices.map((item) => {
                        const tour = item.travelTour?.Tour || {};
                        return (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{tour.name_tour}</td>
                                <td className="p-2">{
                                    tour.start_location === 1 ? "Hà Nội" : tour.start_location === 2 ? "Hải Phòng" : "Khác"
                                }</td>
                                <td className="p-2">{
                                    tour.end_location === 3 ? "Nha Trang" : "Khác"
                                }</td>
                                <td className="p-2">{formatDate(item.travelTour?.start_day)}</td>
                                <td className="p-2">{formatDate(item.travelTour?.end_day)}</td>
                                <td className="p-2 text-red-600 font-semibold">{formatCurrency(item.travelTour?.price_tour)}</td>
                                <td className="p-2 text-red-600 font-semibold">{formatCurrency(item.price_discount || "Chưa cập nhật")}</td>
                                <td className="p-2 ">
                                    <td className="p-2 text-center">
                                        <FaRegEdit
                                            className="text-gray-500 cursor-pointer"
                                            onClick={() => {
                                                setSelectedService(item);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    </td>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center text-gray-500 p-4">
                            Không có lịch trình giảm giá chưa duyệt.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {isModalOpen && selectedService && (
                <ModalApproveDiscount
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    discountService={selectedService}
                />
            )}
        </div>
    );
}
