import { HiOutlineDotsHorizontal, HiOutlineInbox } from "react-icons/hi";
import { formatDayDMY } from "../../../utils/dateUtil.jsx";
import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import ModalAddTravelTour from "../ModalAdd/ModalAddTravelTour.jsx";
import {
  closeTravelTour,
  deleteTravelTour,
  getTravelTourByTourId,
} from "../../../services/API/travel_tour.service.js";
import { FiCalendar, FiList } from "react-icons/fi";
import CalendarTravelTour from "../ModalCalendar/CalendarTravelTour.jsx";
import DropdownMenuTravelTour from "../../Dropdown/DropdowMenuTravelTour.jsx";
import ModalManageGuideForTravelTour from "./ModalManageGuideForTravelTour.jsx";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalManageTravelTour({ tourId, onClose, tours = [] }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [travelTours, setTravelTours] = useState([]);
  const [isAddTravelTourModalOpen, setIsAddTravelTourModalOpen] = useState(false);
  const [locationId, setLocationId] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const dropdownRef = useRef(null);
  const [selectedTravelTourId, setSelectedTravelTourId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isListGuideModalOpen, setIsListGuideModalOpen] = useState(false);

  const handleAddTravelTour = () => {
    setIsAddTravelTourModalOpen(true);
  };

  const handleAddTravelTourSuccess = async () => {
    setIsAddTravelTourModalOpen(false);
    try {
      const response = await getTravelTourByTourId(tourId);
      const data = response.data || [];
      setTravelTours(data);
    } catch (error) {
      console.error("Lỗi khi reload danh sách:", error);
    }
  };

  useEffect(() => {
    const fetchTravelTours = async () => {
      try {
        const response = await getTravelTourByTourId(tourId);
        const data = response.data || [];
        console.log("📦 Danh sách travelTours:", data);
        setTravelTours(data);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu từ API", error);
        setTravelTours([]);
      }
    };

    fetchTravelTours();
  }, [tourId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteTravelTour = async (index) => {
    const id = travelTours[index].id;
    try {
      await deleteTravelTour(id);
      setTravelTours((prev) => prev.filter((_, i) => i !== index));
      toast.success("Xóa hành trình thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.log("Lỗi khi xóa hành trình", error);
    }
  };

  const handleAssignGuide = (tour) => {
    if (tour && tour.Tour && tour.Tour.endLocation) {
      setOpenDropdown(null);
      setLocationId(tour.Tour.endLocation.id);
      setSelectedTravelTourId(tour.id);
      setIsListGuideModalOpen(true);
      console.log("Mở danh sách hướng dẫn viên của travel_tour:", tour.id);
    } else {
      console.error("Không tìm thấy thông tin endLocation trong tour", tour);
    }
  };

  const handleCloseTravelTour = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn đóng lịch khởi hành này?")) return;

    try {
      await closeTravelTour(id);
      toast.success("✅ Đã đóng lịch khởi hành thành công.");
      const response = await getTravelTourByTourId(tourId);
      setTravelTours(response.data || []);
    } catch (error) {
      toast.error("❌ Đóng lịch khởi hành thất bại.", error);
    }
  };

  const getStatusOfTour = (tour) => {
    const today = new Date();
    const start = new Date(tour.start_day);
    const end = new Date(tour.end_day);

    if (today < start) return "upcoming";
    if (today >= start && today <= end) return "ongoing";
    if (today > end) return "completed";

    return "unknown";
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleWrapperClick = () => {
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
      <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleWrapperClick}
      >
        <div
            className="bg-white p-4 rounded-lg shadow-lg w-[80%] h-[80%] overflow-auto "
            onClick={handleModalClick}
        >
          <div className="flex justify-between items-center pb-3 mb-3">
            <h2 className="text-lg font-semibold">Lịch khởi hành Tour</h2>
            <button onClick={onClose} className="text-gray-500 text-xl font-bold">
              ×
            </button>
          </div>

          <div className="mb-4">
            <div className="flex space-x-6 mb-4">
              <button
                  className={`pb-2 border-b-2 ${filterStatus === "all" ? "border-red-700 text-red-700 font-semibold" : "text-gray-500"}`}
                  onClick={() => setFilterStatus("all")}
              >
                Tất cả
              </button>
              <button
                  className={`pb-2 border-b-2 ${filterStatus === "upcoming" ? "border-red-700 text-red-700 font-semibold" : "text-gray-500"}`}
                  onClick={() => setFilterStatus("upcoming")}
              >
                Lịch trình sắp khởi hành
              </button>
              <button
                  className={`pb-2 border-b-2 ${filterStatus === "ongoing" ? "border-red-700 text-red-700 font-semibold" : "text-gray-500"}`}
                  onClick={() => setFilterStatus("ongoing")}
              >
                Lịch trình đang diễn ra
              </button>
              <button
                  className={`pb-2 border-b-2 ${filterStatus === "completed" ? "border-red-700 text-red-700 font-semibold" : "text-gray-500"}`}
                  onClick={() => setFilterStatus("completed")}
              >
                Lịch trình đã hoàn thành
              </button>
            </div>


            <div className="flex justify-between items-center mb-4">
              <div className="relative w-1/3">
                <LuSearch className="absolute left-3 top-2.5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Tìm kiếm bằng từ khóa"
                    className="pl-10 pr-4 py-2 border rounded-md w-full"
                />
              </div>
              <div className="flex gap-4">
                <button className="border px-4 py-2 rounded-md">
                  Nhập danh sách lịch khởi hành
                </button>
                <button
                    onClick={handleAddTravelTour}
                    className="bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Thêm lịch khởi hành
                </button>
                {isAddTravelTourModalOpen && (
                    <ModalAddTravelTour
                        tourId={tourId}
                        onClose={() => setIsAddTravelTourModalOpen(false)}
                        onAddSuccess={handleAddTravelTourSuccess}
                    />
                )}
                <button
                    onClick={() =>
                        setViewMode(viewMode === "list" ? "calendar" : "list")
                    }
                    className="flex items-center gap-1 border px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  {viewMode === "list" ? (
                      <FiList className="text-lg" />
                  ) : (
                      <FiCalendar className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            {viewMode === "list" ? (
                travelTours.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20">
                      <div className="p-4 bg-gray-100 rounded-full mb-2">
                        <HiOutlineInbox className="text-4xl text-gray-500" />
                      </div>
                      <p className="text-gray-600 text-lg font-medium mb-4">
                        Chưa có lịch khởi hành nào
                      </p>
                      <button
                          onClick={handleAddTravelTour}
                          className="bg-red-700 text-white px-4 py-2 rounded-md"
                      >
                        Thêm lịch khởi hành
                      </button>
                    </div>
                ) : (
                    <div className="relative overflow-visible">
                      <table className="w-full rounded-lg shadow-md bg-white">
                        <thead>
                        <tr className="text-SmokyGray">
                          <th className="p-2 text-left">Ngày khởi hành</th>
                          <th className="p-2">Ngày về</th>
                          <th className="p-2">Giờ đi</th>
                          <th className="p-2">Giờ về</th>
                          <th className="p-2">Giá người lớn</th>
                          <th className="p-2">Số lượng</th>
                          <th className="p-2">Trạng thái</th>
                          <th className="p-2"></th>
                        </tr>
                        </thead>

                        <tbody>
                        {travelTours
                            .filter((tour) => {
                              if (filterStatus === "all") return true;
                              return getStatusOfTour(tour) === filterStatus;
                            })
                            .map((travelTour, index) => {
                              if (!travelTour || !travelTour.start_day || !travelTour.end_day) return null;

                              return (
                                  <tr
                                      key={index}
                                      className={`border-t text-center ${
                                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                      }`}
                                  >
                                    <td className="p-2 text-left">
                                      {formatDayDMY(travelTour.start_day)}
                                    </td>
                                    <td className="p-2">
                                      {formatDayDMY(travelTour.end_day)}
                                    </td>
                                    <td className="p-2">
                                      {travelTour.start_time_depart} - {travelTour.end_time_depart}
                                    </td>
                                    <td className="p-2">
                                      {travelTour.start_time_close} - {travelTour.end_time_close}
                                    </td>
                                    <td className="p-2 text-RedPrice">
                                      {travelTour.price_tour?.toLocaleString("vi-VN")} VNĐ
                                    </td>
                                    <td className="p-2">
                                      {`${travelTour.current_people ?? 0}/${travelTour.max_people}`}
                                    </td>
                                    <td className="p-2 font-semibold">
                                     <span className={travelTour.active ? "text-green-600" : "text-red-600"}>
                                        {travelTour.active ? "Đang mở" : "Đã đóng"}
                                     </span>
                                    </td>
                                    <td className="flex justify-end p-2 relative">
                                      <button
                                          onClick={() => toggleDropdown(index)}
                                          className="relative"
                                      >
                                        <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
                                      </button>
                                      {openDropdown === index && (
                                          <div ref={dropdownRef}>
                                            <DropdownMenuTravelTour
                                                onEdit={() => {}}
                                                onLock={() => handleCloseTravelTour(travelTour.id)}
                                                onDelete={() => handleDeleteTravelTour(index)}
                                                onAssignGuide={() => handleAssignGuide(travelTour)}
                                            />
                                          </div>
                                      )}
                                    </td>
                                  </tr>
                              );
                            })}
                        </tbody>
                      </table>

                      {isListGuideModalOpen && (
                          <ModalManageGuideForTravelTour
                              travel_tour_id={selectedTravelTourId}
                              locationId={locationId}
                              onClose={() => setIsListGuideModalOpen(false)}
                          />
                      )}
                    </div>
                )
            ) : (
                <CalendarTravelTour
                    travelTours={travelTours}
                    tourId={tourId}
                    tours={tours}
                />
            )}
          </div>
        </div>
      </div>
  );
}
