import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowRight } from "react-icons/fa";
import { createTravelTour } from "@/services/API/travel_tour.service.js";
import {toast} from "react-toastify";
import { addDays } from 'date-fns';

// eslint-disable-next-line react/prop-types
export default function ModalAddTravelTour({ tourId, onClose, onAddSuccess }) {
  const [loading, setLoading] = useState(false);
  const [travelTourData, setTravelTourData] = useState({
    tour_id: tourId,
    start_day: new Date(),
    end_day: new Date(),
    max_people: "",
    price_tour: "",
    start_time_depart: "",
    end_time_depart: "",
    start_time_close: "",
    end_time_close: "",
    children_price: "",
    toddler_price: "",
  });
  const minStartDate = addDays(new Date(), 1);

  const formatNumber = (value) => {
    if (!value) return "";
    // Bỏ hết ký tự không phải số
    const numberValue = value.toString().replace(/\D/g, "");
    return Number(numberValue).toLocaleString("en-US");
  };

  const parseNumber = (formattedValue) => {
    if (!formattedValue) return 0;
    return parseInt(formattedValue.toString().replace(/,/g, ""), 10);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["max_people", "price_tour", "children_price", "toddler_price"].includes(name)) {
      setTravelTourData((prev) => ({
        ...prev,
        [name]: formatNumber(value),
      }));
    } else {
      setTravelTourData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date, field) => {
    setTravelTourData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (travelTourData.end_day < travelTourData.start_day) {
      toast.error("Ngày về không được trước ngày khởi hành.");
      setLoading(false);
      return;
    }

    const startTime = new Date(`1970-01-01T${travelTourData.start_time_depart}:00Z`);
    const endTime = new Date(`1970-01-01T${travelTourData.end_time_close}:00Z`);
    if (endTime < startTime) {
      toast.error("Giờ về không được nhỏ hơn giờ khởi hành.");
      setLoading(false);
      return;
    }

    const formattedData = {
      ...travelTourData,
      start_day: travelTourData.start_day.toISOString().split("T")[0],
      end_day: travelTourData.end_day.toISOString().split("T")[0],
      max_people: parseNumber(travelTourData.max_people),
      price_tour: parseNumber(travelTourData.price_tour),
      children_price: travelTourData.children_price ? parseNumber(travelTourData.children_price) : 0,
      toddler_price: travelTourData.toddler_price ? parseNumber(travelTourData.toddler_price) : 0,
    };

    try {
      const response = await createTravelTour(formattedData);
      toast.success("Thêm Travel Tour thành công!");
      onClose();
      if (onAddSuccess) onAddSuccess(response.data);
    } catch (error) {
      // Kiểm tra nếu API trả về thông báo lỗi
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);  // Hiển thị thông báo lỗi từ API
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");  // Thông báo mặc định nếu không có message từ API
      }
      console.error("Lỗi khi thêm Travel Tour", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWrapperClick = () => onClose();
  const handleModalClick = (event) => event.stopPropagation();

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[9999]"
          onClick={handleWrapperClick}
      >
        <div
            className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-auto relative"
            onClick={handleModalClick}
        >
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold">Thêm lịch khởi hành</h2>
            <h6 className="text-sm mb-4">Quản trị viên thêm lịch khởi hành vào Tour</h6>

            {/* Ngày khởi hành và ngày về */}
            <div className="flex items-center gap-4 mt-4">
              <div>
                <label className="block mb-2 font-medium">
                  Ngày khởi hành <span className="text-red-500">*</span>
                </label>
                <DatePicker
                    selected={travelTourData.start_day}
                    onChange={(date) => handleDateChange(date, "start_day")}
                    selectsStart
                    startDate={travelTourData.start_day}
                    endDate={travelTourData.end_day}
                    minDate={minStartDate}
                    dateFormat="yyyy-MM-dd"
                    className="w-[200px] p-2 border rounded text-gray-500"
                />
              </div>

              <FaArrowRight className="text-gray-400 text-lg" />

              <div>
                <label className="block mb-2 font-medium">
                  Ngày về <span className="text-red-500">*</span>
                </label>
                <DatePicker
                    selected={travelTourData.end_day}
                    onChange={(date) => handleDateChange(date, "end_day")}
                    selectsEnd
                    startDate={travelTourData.start_day}
                    endDate={travelTourData.end_day}
                    minDate={travelTourData.start_day}
                    dateFormat="yyyy-MM-dd"
                    className="w-[200px] p-2 border rounded text-gray-500"
                />
              </div>
            </div>

            {/* Các trường thời gian */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2 font-medium">Giờ khởi hành</label>
                <input
                    type="time"
                    name="start_time_depart"
                    value={travelTourData.start_time_depart}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Giờ kết thúc khởi hành</label>
                <input
                    type="time"
                    name="end_time_depart"
                    value={travelTourData.end_time_depart}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Giờ bắt đầu về </label>
                <input
                    type="time"
                    name="start_time_close"
                    value={travelTourData.start_time_close}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Giờ kết thúc về</label>
                <input
                    type="time"
                    name="end_time_close"
                    value={travelTourData.end_time_close}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
              </div>
            </div>

            {/* Giá & số lượng */}
            <label className="block mt-4 mb-2 font-medium">
              Số lượng người <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                name="max_people"
                value={travelTourData.max_people}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập số lượng người"
                required
            />

            <label className="block mt-4 mb-2 font-medium">
              Giá Travel Tour <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                name="price_tour"
                value={travelTourData.price_tour}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập giá Travel Tour"
                required
            />

            {/* Giá cho trẻ em và trẻ nhỏ */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2 font-medium">Giá trẻ em</label>
                <input
                    type="text"
                    name="children_price"
                    value={travelTourData.children_price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Nhập giá trẻ em"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Giá trẻ nhỏ</label>
                <input
                    type="text"
                    name="toddler_price"
                    value={travelTourData.toddler_price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Nhập giá trẻ nhỏ"
                />
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={onClose}
              >
                Hủy
              </button>
              <button
                  type="submit"
                  className="bg-red-700 text-white px-4 py-2 rounded"
                  disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Tạo"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
