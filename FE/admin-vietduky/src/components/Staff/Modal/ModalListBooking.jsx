import { PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { STATUS_BOOKING_TEXT } from "../../../constants/app.constant.jsx";
import ModalBookingDetail from "./ModalBookingDetail.jsx";

const ModalListBooking = ({ bookingList, open, onClose }) => {
    const [booking, setBooking] = useState(null);
    const [searchBookingCode, setSearchBookingCode] = useState("");
    if (!open) return null;

    const safeFormatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            return format(new Date(dateStr), "dd/MM/yyyy");
        } catch (err) {
            console.error("Lỗi khi format ngày:", dateStr);
            return "";
        }
    };

    return (
        <div className="fixed inset-0 z-[1050] bg-black/40 flex items-center justify-center pointer-events-auto">
            <div className="bg-white w-[90%] h-[85vh] max-w-7xl rounded-2xl p-6 overflow-hidden shadow-xl flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">Danh sách đặt Tour</h2>
                    <button className="text-gray-500 hover:text-black" onClick={onClose}>
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col h-full">
                <div className="mb-4 w-1/3">
  <input
    type="text"
    placeholder="Tìm kiếm theo mã đặt Tour..."
    value={searchBookingCode}
    onChange={(e) => setSearchBookingCode(e.target.value)}
    className="w-full border border-gray-300 px-3 py-2 rounded-md"
  />
</div>
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
                            <tbody>
{bookingList
  ?.filter((booking) =>
    booking.booking_code
      ?.toLowerCase()
      .includes(searchBookingCode.toLowerCase())
  )
  .map((booking) => (                                <tr key={booking.id} className="even:bg-gray-100 text-center">
                                    <td className="p-2 text-left">{booking?.booking_code}</td>
                                    <td className="p-2">{booking?.name}</td>
                                    <td className="p-2">{booking?.phone}</td>
                                    <td className="p-2">{safeFormatDate(booking?.booking_date)}</td>
                                    <td className="p-2">{booking?.number_adult}</td>
                                    <td className="p-2">{booking?.number_children}</td>
                                    <td className="p-2">{booking?.number_toddler}</td>
                                    <td className="p-2">{booking?.number_newborn}</td>
                                    <td className="p-2">{STATUS_BOOKING_TEXT[booking?.status]}</td>
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
            <ModalBookingDetail
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

export default ModalListBooking;
