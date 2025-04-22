import { LuSearch } from "react-icons/lu";
import Layout from "../../layouts/LayoutManagement";
import { formatDate } from "../../utils/dateUtil";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useEffect, useState } from "react";
import ModalAddTravelTour from "../../components/ModalManage/ModalAdd/ModalAddTravelTour.jsx";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  deleteTravelTour,
  getTravelTour,
} from "../../services/API/travel_tour.service";
import {CiLock} from "react-icons/ci";

export default function ManagementTravelTour() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [travelTours, setTravelTours] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // ID của vị trí đang mở menu

  // Toggle dropdown
  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // call API
  useEffect(() => {
    const fetchTravelTours = async () => {
      try {
        const response = await getTravelTour();
        const data = response.travelTours || response;
        // console.log("Dữ liệu nhận được:", data);

        setTravelTours(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu từ API", error);
        setTravelTours([]);
      }
    };

    fetchTravelTours();
  }, []);

  const handleSuccess = (newTravelTour) => {
    setTravelTours((prev) => [...prev, newTravelTour]);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteTravelTour(id);
      alert("Xóa hành trình thành công");
      setTravelTours((prev) =>
        prev.filter((travelTour) => travelTour.id !== id)
      );
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      console.log("Lỗi khi xóa hành trình", error);
    }
  };

  return (
    <div title="Quản lý Chuyến đi">
      <div>
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-md flex gap-4 items-center">
          <div className="relative flex-1 ">
            <LuSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm bằng từ khóa"
              className="pl-10 pr-4 py-2 border rounded-md w-1/3"
            />
          </div>
          {/* Bộ lọc ngày */}
          <div className="relative">
            <input
              type="date"
              className="px-3 py-2 border rounded-md w-[150px] text-gray-700"
            />
          </div>

          {/* Bộ lọc vị trí */}
          <div>
            <select
              defaultValue=""
              className="px-3 py-2 border rounded-md text-gray-700"
            >
              <option value="" disabled>
                Tour
              </option>
              <option value="sapa">Du lịch Sapa</option>
            </select>
          </div>

          {/* Bộ lọc giá tour */}
          <div>
            <select
              defaultValue=""
              className="px-3 py-2 border rounded-md text-gray-700"
            >
              <option value="" disabled>
                Giá Travel Tour
              </option>
              <option value="low">Dưới 5 triệu</option>
              <option value="medium">5 - 10 triệu</option>
              <option value="high">Trên 10 triệu</option>
            </select>
          </div>

          {/* Nút thêm tour */}
          <button
            className="bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
            onClick={toggleModal}
          >
            Thêm Tour mới
          </button>
        </div>

        {/* Travel Tour table */}
        <div className="mt-2 bg-white p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-SmokyGray text-left">
                <th className="p-2">Tên Tour</th>
                <th className="p-2">Ngày khởi hành</th>
                <th className="p-2">Ngày về</th>
                <th className="p-2">Số lượng người</th>
                <th className="p-2">Giá Travel </th>
                <th
                  className="text-end p-2"
                  style={{ width: "1%", whiteSpace: "nowrap" }}
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {travelTours.map((travelTour) => (
                <tr key={travelTour.id} className="border-t">
                  <td className=" p-2">{travelTour.tour_id}</td>
                  <td className=" p-2">{formatDate(travelTour.start_day)}</td>
                  <td className=" p-2">{formatDate(travelTour.end_day)}</td>
                  <td className=" p-2">{travelTour.max_people}</td>
                  <td className=" p-2">{travelTour.price_tour}</td>
                  <td className="flex justify-end p-2 relative">
                    {/* Nút 3 chấm */}
                    <button
                      onClick={() => toggleDropdown(travelTour.id)}
                      className="relative"
                    >
                      <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
                    </button>

                    {/* Dropdown menu */}
                    {openDropdown === travelTour.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                        <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left">
                          <MdEdit className="mr-2 text-gray-700" />
                          Cập nhật hành trình
                        </button>
                        <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left">
                          <CiLock className="mr-2 text-gray-700" />
                          Đóng lịch khởi hành
                        </button>
                        <button
                          onClick={() => handleDelete(travelTour.id)}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                        >
                          <MdDelete className="mr-2" /> Xóa hành trình
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal thêm tour */}
        {isModalOpen && <ModalAddTravelTour onClose={toggleModal} />}
      </div>
    </div>
  );
}
