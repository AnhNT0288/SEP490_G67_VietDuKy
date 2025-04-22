import { useEffect, useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";
import {getPassengersByGuideId, getTravelTourDetailForGuide} from "../../services/API/guide-tour.service";
import { formatDate } from "../../utils/dateUtil";
import BookingListModal from "./BookingListModal";
import BookingDetailsModal from "./BookingDetailsModal";

const TravelTourDetailsModal = ({ tourSelected, onClose, open, guideId  }) => {
  const [travelTourDetail, setTravelTourDetail] = useState(null);
  const [booking, setBooking] = useState(null);
  const [openBookingListModal, setOpenBookingListModal] = useState(false);
  const [passengerBookings, setPassengerBookings] = useState([]);

  const handleClose = () => {
    onClose();
    setTravelTourDetail(null);
  };
  useEffect(() => {
    const fetchPassengers = async () => {
      if (!guideId) return;
      try {
        const res = await getPassengersByGuideId(guideId);
        if (res?.data) {
          setPassengerBookings(res.data); // res.data là array như bạn đã gửi
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách hành khách:", err);
      }
    };

    fetchPassengers();
  }, [guideId]);

  useEffect(() => {
    const fetchTravelTourDetail = async () => {
      if (tourSelected) {
        const response = await getTravelTourDetailForGuide(
          tourSelected.travel_tour_id
        );
        if (response.status === 200) {
          setTravelTourDetail(response.data.data);
        }
      }
    };
    fetchTravelTourDetail();
  }, [tourSelected]);

  // console.log("TravelTourDetail", travelTourDetail);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-10 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] h-[85vh] max-w-6xl rounded-2xl p-6 overflow-hidden shadow-xl flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Danh sách lịch trình</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={handleClose}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          {/* Left column */}
          <div className="space-y-4 col-span-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1 font-medium">
                Thông tin lịch khởi hành
              </h3>
              <p className="font-semibold">
                {travelTourDetail?.tour?.name_tour}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Điểm khởi hành
                </label>
                <input
                  className="input w-full border rounded-md p-1"
                  disabled
                  value={travelTourDetail?.tour?.start_location?.name_location}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Điểm đến</label>
                <input
                  className="input w-full border rounded-md p-1"
                  disabled
                  value={travelTourDetail?.tour?.end_location?.name_location}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Ngày khởi hành
                </label>
                <input
                  className="input w-full border rounded-md p-1"
                  value={
                    travelTourDetail?.start_day
                      ? formatDate(travelTourDetail?.start_day)
                      : ""
                  }
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ngày về</label>
                <input
                  className="input w-full border rounded-md p-1"
                  value={
                    travelTourDetail?.end_day
                      ? formatDate(travelTourDetail?.end_day)
                      : ""
                  }
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Tình trạng chỗ
                </label>
                <input
                  className="input w-full border rounded-md p-1"
                  value={
                    travelTourDetail?.current_people ||
                    0 + "/" + travelTourDetail?.max_people ||
                    0
                  }
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Giá Tour</label>
                <input
                  className="input w-full border rounded-md p-1"
                  value={tourSelected?.travelTour?.price_tour?.toLocaleString(
                    "vi-VN"
                  )}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Nội dung ghi chú
              </label>
              <textarea
                className="input w-full h-20 resize-none rounded-md border p-1"
                disabled
                value={travelTourDetail?.note}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col h-full col-span-8">
            <div className="mb-4 h-2/5 overflow-y-auto">
              <h3 className="font-semibold">Danh sách hướng dẫn viên Tour</h3>
              <p className="text-sm text-gray-500">
                Danh sách hướng dẫn viên Tour du lịch có trong lịch
              </p>

              <table className="w-full mt-2 text-sm border">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2">Tên hướng dẫn viên</th>
                    <th className="p-2">Giới tính</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Số điện thoại</th>
                  </tr>
                </thead>
                <tbody>
                  {travelTourDetail?.guides?.map((guide) => (
                    <tr key={guide.id}>
                      <td className="p-2">
                        {guide.last_name} {guide.first_name}
                      </td>
                      <td className="p-2">
                        {guide.gender === "male" ? "Nam" : "Nữ"}
                      </td>
                      <td className="p-2">{guide.email}</td>
                      <td className="p-2">{guide.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-3/5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Danh sách khách hàng được gán</h3>
                <a
                    href="#"
                    className="text-red-600 text-sm"
                    onClick={() => setOpenBookingListModal(true)}
                >
                  Xem tất cả danh sách &gt;
                </a>
              </div>

              <div className="h-full">
                <table className="w-full text-sm border mt-2">
                  <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2">Tên khách</th>
                    <th className="p-2">Ngày sinh</th>
                    <th className="p-2">Giới tính</th>
                    <th className="p-2">Số điện thoại</th>
                    <th className="p-2">Độ tuổi</th>
                    <th className="p-2">Phòng đơn</th>
                  </tr>
                  </thead>
                  <tbody>
                  {passengerBookings?.flatMap((booking) =>
                      booking.passengers?.map((p) => (
                          <tr key={p.id} className="border-t">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2">{p.birth_date}</td>
                            <td className="p-2">{p.gender ? "Nam" : "Nữ"}</td>
                            <td className="p-2">{p.phone_number}</td>
                            <td></td>
                            <td className="p-2">{p.single_room ? "Có" : "Không"}</td>
                          </tr>
                      ))
                  )}
                  </tbody>
                </table>
              </div>
            </div>

            {/*<div className="h-2/5">*/}
            {/*  <div className="flex items-center justify-between mb-2">*/}
            {/*    <h3 className="font-semibold">Danh sách đặt lịch</h3>*/}
            {/*    <a*/}
            {/*      href="#"*/}
            {/*      className="text-red-600 text-sm"*/}
            {/*      onClick={() => setOpenBookingListModal(true)}*/}
            {/*    >*/}
            {/*      Xem tất cả danh sách &gt;*/}
            {/*    </a>*/}
            {/*  </div>*/}

            {/*  <div className="h-full">*/}
            {/*    <table className="w-full text-sm border">*/}
            {/*      <thead className="bg-gray-100 text-left">*/}
            {/*        <tr>*/}
            {/*          <th className="p-2">Mã đặt Tour</th>*/}
            {/*          <th className="p-2">Tên người đặt</th>*/}
            {/*          <th className="p-2">Số điện thoại</th>*/}
            {/*          <th className="p-2 text-center">Thao tác</th>*/}
            {/*        </tr>*/}
            {/*      </thead>*/}
            {/*      <tbody className="overflow-y-auto">*/}
            {/*        {travelTourDetail?.bookings?.slice(0, 4)?.map((booking) => (*/}
            {/*          <tr className="border-t" key={booking.id}>*/}
            {/*            <td className="p-2">{booking.booking_code}</td>*/}
            {/*            <td className="p-2">{booking.name}</td>*/}
            {/*            <td className="p-2">{booking.phone}</td>*/}
            {/*            <td className="p-2 flex justify-center">*/}
            {/*              <PencilIcon*/}
            {/*                className="w-4 h-4 cursor-pointer"*/}
            {/*                onClick={() => setBooking(booking)}*/}
            {/*              />*/}
            {/*            </td>*/}
            {/*          </tr>*/}
            {/*        ))}*/}
            {/*      </tbody>*/}
            {/*    </table>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            className="btn border rounded-md px-4 py-2 text-sm"
            onClick={handleClose}
          >
            Hủy
          </button>
          {/* <button className="btn bg-red-600 text-white rounded-md px-4 py-2 text-sm">
            Cập nhật
          </button> */}
        </div>
      </div>
      <BookingDetailsModal
        booking={booking}
        open={!!booking}
        onClose={() => setBooking(null)}
        onSubmit={() => {
          setBooking(null);
          handleClose();
        }}
      />
      <BookingListModal
        bookingList={travelTourDetail?.bookings}
        open={openBookingListModal}
        onClose={() => setOpenBookingListModal(false)}
      />
    </div>
  );
};

export default TravelTourDetailsModal;
