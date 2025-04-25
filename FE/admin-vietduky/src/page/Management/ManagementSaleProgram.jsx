import { useEffect, useState } from "react";
import Layout from "../../layouts/LayoutManagement";
import { LuSearch } from "react-icons/lu";
import { FaEllipsisH } from "react-icons/fa";
import ModalAddSaleProgram from "../../components/ModalManage/ModalAdd/ModalAddSaleProgram.jsx";

export default function ManagementSaleProgram() {
    const [discountPrograms, setDiscountPrograms] = useState([]);
    const [isAddSaleProgramModalOpen, setIsAddSaleProgramModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch discount programs from API
    useEffect(() => {
        const fetchDiscountPrograms = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/program-discount");
                const result = await response.json();
                console.log("Dữ liệu từ API:", result);

                if (result.data && Array.isArray(result.data)) {
                    setDiscountPrograms(result.data);
                } else {
                    console.error("API không trả về dữ liệu đúng định dạng:", result);
                    setDiscountPrograms([]);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setDiscountPrograms([]);
            }
        };

        fetchDiscountPrograms();
    }, []);

    // Format date
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString("vi-VN"); // Format as DD/MM/YYYY
    };

    // Convert status (0: Hết hạn, 1: Còn hạn)
    const getStatus = (status) => {
        return status === 1 ? { text: "Còn hạn", class: "text-green-500" } : { text: "Hết hạn", class: "text-red-500" };
    };

    // Filtered discount programs based on search term
    const filteredPrograms = discountPrograms.filter((program) =>
        program.discount_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div title="Quản lý Chương trình Chiết khấu">
            <div className="p-4 bg-white rounded-md">
                {/* Search Bar & Actions */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <LuSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bằng từ khóa"
                            className="pl-10 pr-4 py-2 border rounded-md w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="border border-red-600 text-red-600 px-4 py-2 rounded-md">
                        Nhập d.sách chiết khấu
                    </button>
                    <button
                        className="bg-red-700 text-white px-4 py-2 rounded-md"
                        onClick={() => setIsAddSaleProgramModalOpen(true)}
                    >
                        Thêm chương trình chiết khấu
                    </button>
                </div>

                {/* Discount Program List Table */}
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b">
                        <th className="text-left p-2">Tên chương trình</th>
                        <th className="text-left p-2">Giá trị giảm giá</th>
                        <th className="text-left p-2">% giảm giá</th>
                        <th className="text-left p-2">Ngày bắt đầu</th>
                        <th className="text-left p-2">Ngày kết thúc</th>
                        <th className="text-left p-2">Trạng thái</th>
                        <th className="text-left p-2">Nội dung</th>
                        <th className="p-2">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPrograms.length > 0 ? (
                        filteredPrograms.map((program) => {
                            const statusInfo = getStatus(program.status);
                            return (
                                <tr key={program.id} className="border-b">
                                    <td className="p-2">{program.discount_name}</td>
                                    <td className="p-2">{program.discount_value.toLocaleString()} VNĐ</td>
                                    <td className="p-2">{program.percent_discount}%</td>
                                    <td className="p-2">{formatDate(program.start_date)}</td>
                                    <td className="p-2">{formatDate(program.end_date)}</td>
                                    <td className={`p-2 font-semibold ${statusInfo.class}`}>{statusInfo.text}</td>
                                    <td className="p-2">{program.description}</td>
                                    <td className="p-2 text-center">
                                        <FaEllipsisH className="cursor-pointer text-gray-500" />
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" className="p-4 text-center text-gray-500">
                                Không tìm thấy chương trình chiết khấu nào.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Modal */}
                {isAddSaleProgramModalOpen && <ModalAddSaleProgram onClose={() => setIsAddSaleProgramModalOpen(false)} />}
            </div>
        </div>
    );
}
