import { PencilIcon, XIcon } from "lucide-react";
import { formatDate } from "../../utils/dateUtil";
import { STATUS_BOOKING_TEXT } from "../../constants/app.constant";
import BookingDetailsModal from "./BookingDetailsModal";
import { useState } from "react";

const BookingListModal = ({ bookingList, open, onClose }) => {
  const [booking, setBooking] = useState(null);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] h-[85vh] max-w-7xl rounded-2xl p-6 overflow-hidden shadow-xl flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Danh sách đặt Tour</h2>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="h-4/5 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-center border-b">
                <tr>
                  <th className="p-2 text-left">Mã đặt Tour</th>
                  <th className="p-2">Tên người đặt</th>
                  <th className="p-2">Số điện thoại</th>
                  <th className="p-2">Ngày đặt</th>
                  <th className="p-2">Số lượng người lớn</th>
                  <th className="p-2">Số lượng trẻ em</th>
                  <th className="p-2">Số lượng trẻ nhỏ</th>
                  <th className="p-2">Số lượng em bé</th>
                  <th className="p-2">Trạng thái</th>
                  <th className="p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {bookingList?.map((booking) => (
                  <tr key={booking.id} className="even:bg-gray-100 text-center">
                    <td className="p-2 text-left">{booking?.booking_code}</td>
                    <td className="p-2">{booking?.name}</td>
                    <td className="p-2">{booking?.phone}</td>
                    <td className="p-2">
                      {booking?.booking_date
                        ? formatDate(booking?.booking_date)
                        : ""}
                    </td>
                    <td className="p-2">{booking?.number_adult}</td>
                    <td className="p-2">{booking?.number_children}</td>
                    <td className="p-2">{booking?.number_toddler}</td>
                    <td className="p-2">{booking?.number_newborn}</td>
                    <td className="p-2">
                      {STATUS_BOOKING_TEXT[booking?.status]}
                    </td>
                    <td className="p-2 flex justify-center">
                      <PencilIcon
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => setBooking(booking)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BookingDetailsModal
        booking={booking}
        open={!!booking}
        onClose={() => {
          setBooking(null);
        }}
        onSubmit={() => {
          setBooking(null);
          onClose();
        }}
      />
    </div>
  );
};

export default BookingListModal;
