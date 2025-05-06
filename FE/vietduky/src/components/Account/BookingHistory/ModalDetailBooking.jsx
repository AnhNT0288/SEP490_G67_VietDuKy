import { BookingService } from "@/services/API/booking.service";
import { useEffect, useState } from "react";

export default function BookingDetailModal({ open, onClose, booking }) {
  if (!open || !booking) return null;
  const [bookingDetails, setBookingDetails] = useState([]);
  const tour = bookingDetails?.TravelTour?.Tour || {};
  const travelTour = bookingDetails?.TravelTour || {};
  const guide = bookingDetails?.passengersByGroup?.[1]?.guide || {};
  const passengers = bookingDetails?.passengersByGroup?.[1]?.passengers || [];
console.log("TravelGuide", guide);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Gọi API để lấy thông tin chi tiết booking nếu cần thiết
        const response = await BookingService.getDetailBooking(booking.id);
        setBookingDetails(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    fetchBookingDetails();
  }, [booking.id]);

  console.log("Booking Details", bookingDetails);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Thông tin lịch khởi hành</h2>

        {/* Thông tin chung */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Tên Tour:</strong> {tour?.name_tour}
            </p>
            <p>
              <strong>Ngày khởi hành:</strong> {travelTour?.start_day}
            </p>
            <p>
              <strong>Ngày về:</strong> {travelTour?.end_day}
            </p>
            <p>
              <strong>Số lượng:</strong>{" "}
              {bookingDetails?.number_adult + bookingDetails?.number_toddler + bookingDetails?.number_children + bookingDetails?.number_newborn} người
            </p>
            {/* <p>
              <strong>Giá tour:</strong>{" "}
              {Number(travelTour?.price_tour).toLocaleString("vi-VN")} VND
            </p> */}
          </div>
          <div>
            <p>
              <strong>Tên hướng dẫn viên:</strong> {guide?.user?.displayName}
            </p>
            <p>
              <strong>Email:</strong> {guide?.email}
            </p>
            <p>
              <strong>SĐT:</strong> {guide?.number_phone || "Chưa cập nhật"}
            </p>
          </div>
        </div>

        {/* Danh sách khách hàng */}
        <h3 className="mt-6 font-semibold text-lg">
          Danh sách khách hàng cùng chuyến
        </h3>
        <div className="overflow-x-auto mt-2">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Tên khách</th>
                <th className="border px-2 py-1">Ngày sinh</th>
                <th className="border px-2 py-1">Giới tính</th>
                <th className="border px-2 py-1">SĐT</th>
                <th className="border px-2 py-1">Độ tuổi</th>
                <th className="border px-2 py-1">Phòng đơn</th>
              </tr>
            </thead>
            <tbody>
              {bookingDetails?.passengers?.length > 0 ? (
                bookingDetails.passengers.map((c, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border px-2 py-1">{c.name}</td>
                    <td className="border px-2 py-1">{c.birth}</td>
                    <td className="border px-2 py-1">{c.gender}</td>
                    <td className="border px-2 py-1">{c.phone}</td>
                    <td className="border px-2 py-1">{c.age}</td>
                    <td className="border px-2 py-1">
                      {c.single_room ? "Có" : "Không"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-2 text-gray-500">
                    Không có khách nào được gán.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Nút đóng + xuất Excel (giả lập) */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
