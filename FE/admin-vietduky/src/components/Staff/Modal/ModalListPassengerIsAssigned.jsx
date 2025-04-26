import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getPassengersByTravelGuideId, removePassengerFromGroup } from "../../../services/API/passenger.service.js";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalListPassengerIsAssigned({ guide, travelTourId, onClose }) {
    const [passengers, setPassengers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (guide?.id && travelTourId) {
            getPassengersByTravelGuideId(guide.id, travelTourId)
                .then((data) => {
                    setPassengers(data);
                })
                .catch((err) => {
                    console.error("Lỗi khi lấy danh sách khách hàng:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [guide, travelTourId]);

    const handleDeletePassenger = async (passengerId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá khách hàng này?")) return;

        try {
            await removePassengerFromGroup(passengerId);
            setPassengers((prev) => prev.filter((p) => p.id !== passengerId));
            toast.success("Xóa khách hàng thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa khách hàng:", error);
            toast.error("Xóa khách hàng thất bại!");
        }
    };

    const filteredPassengers = passengers.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!guide) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-2/3 h-2/3 rounded-lg flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-center">Danh sách khách hàng đã gán</h2>
                </div>

                {/* Body - nội dung scroll */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Thông tin HDV */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Họ tên HDV</label>
                            <input
                                type="text"
                                value={guide.display_name || ""}
                                readOnly
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Giới tính</label>
                            <input
                                type="text"
                                value={guide.gender === "male" ? "Nam" : guide.gender === "female" ? "Nữ" : "Khác"}
                                readOnly
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Ngày sinh</label>
                            <input
                                type="text"
                                value={guide.birth_date && !isNaN(new Date(guide.birth_date))
                                    ? format(new Date(guide.birth_date), "dd/MM/yyyy")
                                    : ""}
                                readOnly
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                value={guide.phone || ""}
                                readOnly
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full mb-4"
                    />

                    {/* Danh sách khách */}
                    {loading ? (
                        <p className="text-center">Đang tải danh sách khách hàng...</p>
                    ) : filteredPassengers.length === 0 ? (
                        <p className="text-center text-gray-500">Không tìm thấy khách hàng nào.</p>
                    ) : (
                        <table className="table-auto w-full text-sm">
                            <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Tên khách hàng</th>
                                <th className="p-2">Số điện thoại</th>
                                <th className="p-2">Ngày sinh</th>
                                <th className="p-2">Giới tính</th>
                                <th className="p-2 text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPassengers.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-2">{p.name || "-"}</td>
                                    <td className="p-2">{p.phone_number || "-"}</td>
                                    <td className="p-2">
                                        {(p.birth_date && !isNaN(new Date(p.birth_date)))
                                            ? format(new Date(p.birth_date), "dd/MM/yyyy")
                                            : "-"
                                        }
                                    </td>
                                    <td className="p-2">{p.gender === "true" ? "Nam" : "Nữ"}</td>
                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => handleDeletePassenger(p.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer cố định */}
                <div className="border-t p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
