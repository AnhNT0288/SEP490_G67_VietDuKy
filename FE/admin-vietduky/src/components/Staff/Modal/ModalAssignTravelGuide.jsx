import { useEffect, useState } from "react";
import { format } from "date-fns";
import {getGuidesByTravelTourId} from "../../../services/API/guide_tour.service.js";
import ModalAssignPassenger from "./ModalAssignPassenger.jsx";
import ModalAssignGuide from "../../ModalManage/ModalAdd/ModalAssignGuide.jsx";

// eslint-disable-next-line react/prop-types
export default function ModalAssignTravelGuide({ tourId, onClose }) {
    const [tourInfo, setTourInfo] = useState(null);
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [openAssignGuideModal, setOpenAssignGuideModal] = useState(false);

    useEffect(() => {
        getGuidesByTravelTourId(tourId)
            .then((res) => {
                console.log("DATA 2:", res)
                setTourInfo(res);
                setGuides(res?.guides || []);
            })
            .catch((err) => {
                console.error("Lỗi:", err);
            })
            .finally(() => setLoading(false));
    }, [tourId]);

    const formatDate = (date) => {
        if (date && !isNaN(new Date(date))) {
            return format(new Date(date), "dd/MM/yyyy");
        }
        return "Không rõ";
    };

    const filteredGuides = guides.filter((g) =>
        g.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-10">Đang tải...</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg w-[90%] h-[85%] flex overflow-hidden shadow-xl"
            >
                {/* LEFT: Tour Info */}
                <div className="w-[30%] p-6 text-sm">
                    <h2 className="text-xl font-semibold ">Thông tin lịch khởi hành</h2>
                    <h2 className="text-red-700 mb-4">{tourInfo?.tour?.name_tour}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className=" mb-2">
                            <label className="block font-medium text-gray-700">Điểm khởi hành</label>
                            <input
                                type="text"
                                value={tourInfo?.tour?.start_location?.name_location || ''}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2 "
                            />
                        </div>
                        <div className=" mb-1">
                            <label className="block font-medium text-gray-700 ">Điểm đến</label>
                            <input
                                type="text"
                                value={tourInfo?.tour?.end_location?.name_location || ''}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2 "
                            />
                        </div>

                        <div className=" mb-1">
                            <label className="block font-medium text-gray-700">Ngày khởi hành</label>
                            <input
                                type="text"
                                value={formatDate(tourInfo?.start_day)}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2 "
                            />
                        </div>
                        <div className=" mb-1">
                            <label className="block font-medium text-gray-700">Ngày về</label>
                            <input
                                type="text"
                                value={formatDate(tourInfo?.end_day)}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2 "
                            />
                        </div>

                        <div className=" mb-1 col-span-2">
                            <label className="block font-medium text-gray-700">Tình trạng chỗ</label>
                            <input
                                type="text"
                                value={`${tourInfo?.current_people || 0}/${tourInfo?.max_people || 0}`}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2 "
                            />
                        </div>

                        <div className=" mb-1 col-span-2">
                            <label className="block font-medium text-gray-700">Giá Tour</label>
                            <input
                                type="text"
                                value={tourInfo?.price_tour?.toLocaleString("vi-VN") || ''}
                                readOnly
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2 "
                            />
                        </div>

                        <div className="col-span-2 mb-1">
                            <label className="block font-medium text-gray-700">Nội dung ghi chú</label>
                            <textarea
                                value={tourInfo?.note || 'Không có ghi chú nào'}
                                readOnly
                                rows={3}
                                className="w-full border border-gray-100 text-gray-500 rounded-md px-3 py-2  resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Danh sách HDV */}
                <div className="w-[70%] p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold">Danh sách HDV</h2>
                        <button className="bg-[#A31627] text-white px-3 py-2 rounded text-sm">
                            Phân công tự động
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Tìm kiếm bằng từ khóa"
                        className="border px-3 py-2 mb-4 rounded-md w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {filteredGuides.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center text-gray-500">
                            <table className="table-auto w-full text-sm border-t">
                                <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2">Tên hướng dẫn viên</th>
                                    <th className="p-2">Giới tính</th>
                                    <th className="p-2">Ngày sinh</th>
                                    <th className="p-2">Số điện thoại</th>
                                    <th className="p-2">Tổng khách hàng</th>
                                    <th className="p-2">Thao tác</th>
                                </tr>
                                </thead>
                            </table>
                            <div className="text-5xl mb-4"></div>
                            <p className="mb-2">Chưa có hướng dẫn viên trong lịch trình</p>
                            <p className="text-sm mb-4">Tiến hành gán Hướng dẫn viên</p>
                            <button
                                className="bg-[#A31627] text-white px-4 py-2 rounded-md"
                                onClick={() => setOpenAssignGuideModal(true)}
                            >
                                Gán hướng dẫn viên du lịch
                            </button>

                        </div>
                    ) : (
                        <table className="table-auto w-full text-sm border-t">
                            <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Tên hướng dẫn viên</th>
                                <th className="p-2">Giới tính</th>
                                <th className="p-2">Ngày sinh</th>
                                <th className="p-2">Số điện thoại</th>
                                <th className="p-2">Tổng khách hàng</th>
                                <th className="p-2">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredGuides.map((g) => (
                                <tr key={g.id} className="border-t">
                                    <td className="p-2">{g.display_name}</td>
                                    <td className="p-2">
                                        {g.gender === "male" ? "Nam" :
                                            g.gender === "female" ? "Nữ" : "Khác"}
                                    </td>
                                    <td className="p-2">{g.birth_date || "Không rõ"}</td>
                                    <td className="p-2">{g.phone || "Chưa có"}</td>
                                    <td className="p-2">{g.customer_count || 0}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => setSelectedGuide(g)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Gán KH
                                        </button>
                                        <button
                                            onClick={() => setSelectedGuide(g)}
                                            className="text-red-600 hover:underline text-sm ml-2"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                    <div className="pt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700"
                        >
                            Hủy
                        </button>
                        <button className="ml-2 bg-red-700 text-white px-4 py-2 rounded-md">
                            Cập nhật
                        </button>
                    </div>
                </div>
                {selectedGuide && (
                    <ModalAssignPassenger
                        tourId={tourId}
                        guide={selectedGuide}
                        onClose={() => setSelectedGuide(null)}
                    />
                )}
                {openAssignGuideModal && (
                    <ModalAssignGuide
                        locationId={tourInfo?.tour?.start_location?.id}
                        travel_tour_id={tourId}
                        onClose={() => setOpenAssignGuideModal(false)}
                        onAssignSuccess={() => {
                            setOpenAssignGuideModal(false);
                            getGuidesByTravelTourId(tourId)
                                .then((res) => {
                                    setTourInfo(res);
                                    setGuides(res?.guides || []);
                                });
                        }}
                    />
                )}
            </div>
        </div>
    );
}