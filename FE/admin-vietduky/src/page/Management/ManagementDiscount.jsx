import { useEffect, useState } from "react";
import Layout from "../../layouts/LayoutManagement";
import { LuSearch } from "react-icons/lu";
import ModalAddVoucher from "../../components/ModalManage/ModalAdd/ModalAddVocher.jsx";

export default function ManagementDiscount() {
    const [vouchers, setVouchers] = useState([]);
    const [isAddVoucherModalOpen, setIsAddVoucherModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Hàm mở/đóng modal thêm voucher
    const toggleAddVoucherModal = () => {
        setIsAddVoucherModalOpen(!isAddVoucherModalOpen);
    };

    // Gọi API để lấy danh sách voucher
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/voucher/");
                const data = await response.json();
                console.log("Dữ liệu từ API:", data);

                if (Array.isArray(data)) {
                    setVouchers(data);
                } else {
                    console.error("Dữ liệu API không đúng định dạng:", data);
                    setVouchers([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu từ API", error);
                setVouchers([]);
            }
        };

        fetchVouchers();
    }, []);

    return (
        <div title="Quản lý Mã Giảm Giá">
            <div className="p-4 bg-white rounded-md">
                {/* Thanh tìm kiếm và nút hành động */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <LuSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã giảm giá"
                            className="pl-10 pr-4 py-2 border rounded-md w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="border border-red-600 text-red-600 px-4 py-2 rounded-md">
                        Nhập danh sách mã giảm giá
                    </button>
                    <button className="bg-red-700 text-white px-4 py-2 rounded-md" onClick={toggleAddVoucherModal}>
                        Thêm mã giảm giá
                    </button>
                </div>

                {/* Bảng danh sách mã giảm giá */}
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-left text-gray-700">
                        <th className="p-2">Mã giảm giá</th>
                        <th className="p-2">% giảm giá</th>
                        <th className="p-2">Số lượng</th>
                        <th className="p-2">Ngày bắt đầu</th>
                        <th className="p-2">Ngày kết thúc</th>
                        <th className="p-2">Trạng thái</th>
                        <th className="p-2 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vouchers.map((voucher) => (
                        <tr key={voucher.id} className="border-t">
                            <td className="p-2">{voucher.voucher_code}</td>
                            <td className="p-2">{voucher.discount_percentage}%</td>
                            <td className="p-2">{voucher.quantity}</td>
                            <td className="p-2">{new Date(voucher.start_date).toLocaleDateString("vi-VN")}</td>
                            <td className="p-2">{new Date(voucher.end_date).toLocaleDateString("vi-VN")}</td>
                            <td className="p-2">
                                    <span className={voucher.status === 1 ? "text-green-600" : "text-red-600"}>
                                        {voucher.status === 1 ? "Còn hạn" : "Hết hạn"}
                                    </span>
                            </td>
                            <td className="p-2 text-right">...</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {isAddVoucherModalOpen && <ModalAddVoucher onClose={toggleAddVoucherModal} />}
            </div>
        </div>
    );
}
