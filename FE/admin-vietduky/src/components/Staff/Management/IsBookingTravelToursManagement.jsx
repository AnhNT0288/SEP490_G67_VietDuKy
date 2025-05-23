import { useEffect, useState } from "react";
import { format, isAfter, isBefore, isSameDay } from "date-fns";
import DropdownTourIsBooking from "../Dropdown/DropdownTourIsBooking.jsx";
import {getTravelToursByStaffAndEndLocation, updateTravelTour} from "../../../services/API/travel_tour.service.js";
import {getAssignedLocationsByStaffId} from "../../../services/API/staff.service.js";
import ModalAssignTravelGuide from "../Modal/ModalAssignTravelGuide.jsx";
import ModalListGuidesAndPassengersIsAssigned from "../Modal/ModalListGuidesAndPassengersIsAssigned.jsx";
import ModalAddServiceForTravelTourIsBooking from "../Modal/ModalAddServiceForTravelTourIsBooking.jsx";
import {toast} from "react-toastify";
import ModalListBooking from "../Modal/ModalListBooking.jsx";
import {getBookingsByTravelTourId} from "../../../services/API/booking.service.js";

// eslint-disable-next-line react/prop-types
export default function IsBookingTravelToursManagement({ staffId }) {
    const [travelTours, setTravelTours] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openViewGuidesModal, setOpenViewGuidesModal] = useState(false);
    const [selectedTravelTourId, setSelectedTravelTourId] = useState(null);
    // Filters
    const [search, setSearch] = useState("");
    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [tab, setTab] = useState("all");
    const [assignedLocations, setAssignedLocations] = useState([]);
    const [selectedTour, setSelectedTour] = useState(null);
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [openAssignServiceModal, setOpenAssignServiceModal] = useState(false);
    const [selectedTourForService, setSelectedTourForService] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [openBookingListModal, setOpenBookingListModal] = useState(false);
    const [selectedBookingList, setSelectedBookingList] = useState([]);

    const resolvedStaffId = staffId || JSON.parse(localStorage.getItem("user"))?.id;

    useEffect(() => {
        if (!resolvedStaffId) return;

        // Gọi API lấy tour
        getTravelToursByStaffAndEndLocation(resolvedStaffId)
            .then((tours) => {
                console.log("Tours retrieved:", tours);
                setTravelTours(tours);
            })
            .catch((error) => {
                console.error("Error fetching tours:", error);
            });
        // Gọi API lấy location gán
        getAssignedLocationsByStaffId(resolvedStaffId)
            .then((data) => {
                setAssignedLocations(data || []);
            })
            .catch((err) => console.error("Lỗi API location:", err));
    }, [resolvedStaffId]);

    const filteredTours = travelTours.filter((tour) => {
        const tourName = tour.name || "";
        const startLoc = tour.start_location?.id?.toString() || "";
        const endLoc = tour.end_location?.id?.toString() || "";
        const startDay = new Date(tour.start_day);
        const endDay = new Date(tour.end_day);
        const today = new Date();

        const matchSearch = tourName.toLowerCase().includes(search.toLowerCase());
        const matchStartLoc = !startLocation || startLoc === startLocation;
        const matchEndLoc = !endLocation || endLoc === endLocation;
        const matchStartDate = !startDate || isAfter(startDay, new Date(startDate)) || isSameDay(startDay, new Date(startDate));

        let matchTab = true;
        if (tab === "upcoming") matchTab = isAfter(startDay, today);
        if (tab === "ongoing") matchTab = isBefore(startDay, today) && isAfter(endDay, today);
        if (tab === "completed") matchTab = isBefore(endDay, today);
        if (tab === "cancelled") matchTab = tour.status === 3;

        return matchSearch && matchStartLoc && matchEndLoc && matchStartDate && matchTab;
    });

    const paginated = filteredTours.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredTours.length / itemsPerPage);

    const handleOpenAssignModal = (tour) => {
        setSelectedTour(tour);
        setOpenAssignModal(true);
    };

    const fetchTravelTours = () => {
        getTravelToursByStaffAndEndLocation(resolvedStaffId)
            .then((tours) => setTravelTours(tours))
            .catch((error) => console.error("Error fetching tours:", error));
    };

    const handleMarkAssigned = async (tour) => {
        try {
            const newStatus = tour.status === 1 ? 0 : 1;
            const updatedTour = { ...tour, status: newStatus };
            await updateTravelTour(tour.id, updatedTour);

            setTravelTours((prev) =>
                prev.map((t) => (t.id === tour.id ? { ...t, status: newStatus } : t))
            );

            toast.success(`Trạng thái đã chuyển thành: ${newStatus === 1 ? "Đã phân công" : "Chưa phân công"}`);
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật trạng thái:", error);
            toast.error("Cập nhật trạng thái thất bại");
        }
    };

    const handleOpenViewGuidesModal = (tour) => {
        setSelectedTravelTourId(tour.id);
        setOpenViewGuidesModal(true);
    };

    const handleOpenAssignServiceModal = (tour) => {
        setSelectedTourForService(tour);
        setOpenAssignServiceModal(true);
    };

    const handleImportPassenger = async (tour) => {
        try {
            const data = await getBookingsByTravelTourId(tour.id);
            setSelectedBookingList(data || []);
            setOpenBookingListModal(true);
        } catch (error) {
            toast.error("Không thể tải danh sách khách hàng");
            console.error("Lỗi khi lấy booking:", error);
        }
    };

    return (
        <div className="bg-white p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Danh sách Travel Tour</h2>

            {/* Tabs */}
            <div className="grid grid-cols-5 text-center mb-6">
                {[
                    { label: "Tất cả", value: "all" },
                    { label: "Lịch trình sắp khởi hành", value: "upcoming" },
                    { label: "Lịch trình đang khởi hành", value: "ongoing" },
                    { label: "Lịch trình đã hoàn thành", value: "completed" },
                    { label: "Lịch trình đã huỷ", value: "cancelled" },
                ].map((item) => (
                    <div key={item.value} className="flex justify-center">
                        <button
                            className={`relative pb-2 text-base md:text-lg font-semibold transition-all ${
                                tab === item.value
                                    ? "text-red-600 after:content-[''] after:absolute after:h-[2px] after:w-full after:bg-red-600 after:bottom-0 after:left-0"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setTab(item.value)}
                        >
                            {item.label}
                        </button>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm tour"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-md w-1/3"
                />
                <select
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="border px-3 py-2 rounded-md w-1/7 text-center text-gray-700"
                >
                    <option value="">Điểm đi</option>
                    {assignedLocations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                            {loc.name_location}
                        </option>
                    ))}
                </select>

                <select
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    className="border px-3 py-2 rounded-md w-1/7 text-center text-gray-700"
                >
                    <option value="">Điểm đến</option>
                    {assignedLocations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                            {loc.name_location}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-3 py-2 rounded-md text-gray-700"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-left text-gray-600 border-b">
                        <th className="p-2">Tên Tour</th>
                        <th className="p-2">Điểm đi</th>
                        <th className="p-2">Điểm đến</th>
                        <th className="p-2">Ngày khởi hành</th>
                        <th className="p-2">Ngày về</th>
                        <th className="p-2 text-center">Đã đặt</th>
                        <th className="p-2 text-left">Trạng thái</th>
                        <th className="p-2 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginated.map((tour) => (
                        <tr key={tour.id} className="border-t hover:bg-gray-50 text-md">
                            <td className="p-2">{tour.name}</td>
                            <td className="p-2">{tour.start_location?.name_location}</td>
                            <td className="p-2">{tour.end_location?.name_location}</td>
                            <td className="p-2">{format(new Date(tour.start_day), "dd/MM/yyyy")}</td>
                            <td className="p-2">{format(new Date(tour.end_day), "dd/MM/yyyy")}</td>
                            <td className="p-2 text-center">
                                {tour.current_people}/{tour.max_people}
                            </td>
                            <td
                                className={`p-2 font-medium ${
                                    tour.status === 1 ? "text-green-600" : 
                                    tour.status === 2 ? "text-blue-600" :
                                    tour.status === 3 ? "text-red-600" : 
                                    "text-orange-600"
                                }`}
                            >
                                {tour.status === 0 ? "Chưa phân công" :
                                 tour.status === 1 ? "Đã phân công" :
                                 tour.status === 2 ? "Đã hoàn thành" :
                                 "Đã hủy"}
                            </td>
                            <td className="p-2 text-right relative">
                                <DropdownTourIsBooking
                                    travelTour={tour}
                                    isOpen={openDropdown === tour.id}
                                    setOpenDropdown={setOpenDropdown}
                                    onAssignGuide={(t) => handleOpenAssignModal(t)}
                                    onViewGuides={(t) => handleOpenViewGuidesModal(t)}
                                    onAssignService={(t) => handleOpenAssignServiceModal(t)}
                                    onMarkAssigned={handleMarkAssigned}
                                    onImportPassengers={(t) => handleImportPassenger(t)}
                                    onCanceled={fetchTravelTours}
                                />
                            </td>
                        </tr>
                    ))}
                    {paginated.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                Không có lịch trình phù hợp.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            {/* Modal Gán hướng dẫn viên */}
            {openAssignModal && selectedTour && (
                <ModalAssignTravelGuide
                    tour={selectedTour}
                    onClose={() => {
                        setOpenAssignModal(false);
                        fetchTravelTours();
                    }}
                    staffId={resolvedStaffId}
                />
            )}
            {openViewGuidesModal && selectedTravelTourId && (
                <ModalListGuidesAndPassengersIsAssigned
                    travelTourId={selectedTravelTourId}
                    onClose={() => setOpenViewGuidesModal(false)}
                />
            )}
            {openAssignServiceModal && selectedTourForService && (
                <ModalAddServiceForTravelTourIsBooking
                    tour={selectedTourForService}
                    onClose={() => setOpenAssignServiceModal(false)}
                />
            )}
            {openBookingListModal && (
                <ModalListBooking
                    bookingList={selectedBookingList}
                    open={openBookingListModal}
                    onClose={() => setOpenBookingListModal(false)}
                />
            )}
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`px-4 py-2 rounded-md text-sm transition ${
                                currentPage === i + 1
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
