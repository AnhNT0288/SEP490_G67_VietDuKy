import { useEffect, useState } from "react";
import { format } from "date-fns";
import {deleteAssignedGuide, getGuidesByTravelTourId} from "../../../services/API/guide_tour.service.js";
import ModalAssignPassenger from "./ModalAssignPassenger.jsx";
import ModalAssignGuide from "../../ModalManage/ModalAdd/ModalAssignGuide.jsx";
import {toast} from "react-toastify";
import {autoAssignPassengersToGuides} from "../../../services/API/passenger.service.js";
import DropdownGuideActions from "../Dropdown/DropdownGuideActions.jsx";
import ModalListPassengerIsAssigned from "./ModalListPassengerIsAssigned.jsx";

// eslint-disable-next-line react/prop-types
export default function ModalAssignTravelGuide({staffId, tour, onClose }) {
    const [tourInfo, setTourInfo] = useState(null);
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [openAssignGuideModal, setOpenAssignGuideModal] = useState(false);
    const [openAutoAssignModal, setOpenAutoAssignModal] = useState(false);
    const [numberPassenger, setNumberPassenger] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [viewingGuide, setViewingGuide] = useState(null);

    const tourId = tour.id; // tourId
    const travelTourId = tour.id;
// Khi ấn "Xem KH đã gán"
    const handleViewAssignedPassengers = (guide) => {
        setViewingGuide(guide);
    };

// Khi ấn "Xóa"
    const handleDeleteGuide = async (travel_guide_id, travel_tour_id) => {

        try {
            await deleteAssignedGuide(travel_guide_id, travel_tour_id);
            toast.success("Xóa hướng dẫn viên thành công!");
            setLoading(true);
            getGuidesByTravelTourId(tourId)
                .then((res) => {
                    setTourInfo(res);
                    setGuides(res?.guides || []);
                })
                .finally(() => setLoading(false));
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa hướng dẫn viên!");
            console.error("Lỗi khi xóa hướng dẫn viên:", error);
        }
    };

    const handleAutoAssign = async () => {
        if (!numberPassenger || Number(numberPassenger) <= 0) {
            toast.error("Vui lòng nhập số lượng hợp lệ!");
            return;
        }

        try {
            const data = await autoAssignPassengersToGuides(tourId, Number(numberPassenger));
            console.log("Response auto assign:", data);

            toast.success("Phân công tự động thành công!");
            setOpenAutoAssignModal(false);
            setLoading(true);
            getGuidesByTravelTourId(tourId)
                .then((res) => {
                    setTourInfo(res);
                    setGuides(res?.guides || []);
                })
                .finally(() => setLoading(false));
        } catch (error) {
            console.error("Lỗi phân công tự động:", error);
            toast.error("Có lỗi xảy ra!");
        }
    };

    useEffect(() => {
        getGuidesByTravelTourId(tourId)
            .then((res) => {
                console.log("DATA2:", res)
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
                        <div>
                            <button
                                className="bg-[#A31627] text-white px-3 py-2 rounded-md text-sm m-2"
                                onClick={() => setOpenAssignGuideModal(true)}
                            >
                                Thêm HDV
                            </button>
                            <button
                                className="bg-[#A31627] text-white px-3 py-2 rounded text-sm"
                                onClick={() => setOpenAutoAssignModal(true)}
                            >
                                Phân công tự động
                            </button>
                        </div>

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
                                <th className="p-2 text-right">Thao tác</th>
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
                                        <DropdownGuideActions
                                            guide={g}
                                            tourId={travelTourId}
                                            isOpen={openDropdown === g.id}
                                            setOpenDropdown={setOpenDropdown}
                                            onAssignPassenger={(guide) => setSelectedGuide(guide)}
                                            onViewPassengers={(guide) => handleViewAssignedPassengers(guide)}
                                            onDeleteGuide={({ travel_guide_id, travel_tour_id }) => handleDeleteGuide(travel_guide_id, travel_tour_id)}
                                        />
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
                        staffId={staffId}
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
                {viewingGuide && (
                    <ModalListPassengerIsAssigned
                        guide={viewingGuide}
                        travelTourId={tour.id}
                        onClose={() => setViewingGuide(null)}
                    />
                )}

                {openAutoAssignModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setOpenAutoAssignModal(false)}>
                        <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-lg w-[400px] flex flex-col items-center">
                            <h2 className="text-lg font-semibold mb-4">Phân công tự động</h2>
                            <input
                                type="number"
                                value={numberPassenger}
                                onChange={(e) => setNumberPassenger(e.target.value)}
                                placeholder="Số lượng khách/HDV"
                                className="border rounded-md px-3 py-2 w-full mb-4"
                            />
                            <div className="flex gap-4">
                                <button
                                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                                    onClick={() => setOpenAutoAssignModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="bg-red-700 text-white px-4 py-2 rounded-md"
                                    onClick={handleAutoAssign}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}