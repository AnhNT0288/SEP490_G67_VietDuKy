import { CheckSquare, Pencil, Square, Trash, XIcon } from "lucide-react";
import SearchDebounceInput from "../common/SearchDebouceInput";
import AddCustomerInfoModal from "./AddCustomerInfoModal";
import { useEffect, useState } from "react";
import {
  getBookingById,
  updateBooking,
} from "../../services/API/booking.service";
import {
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_TEXT,
} from "../../constants/app.constant";
import ConfirmDeleteCustomer from "./ConfirmDeleteCustomer";
import { handleExcelUpload } from "../../utils/handleExcel";
import ImportExcelButton from "./ImportExcelButton";
import UpdateCustomerInfoModal from "./UpdateCustomerInfoModal";
const BookingDetailsModal = ({ booking, open, onClose, onSubmit }) => {
  const [search, setSearch] = useState("");
  const [openAddCustomerInfoModal, setOpenAddCustomerInfoModal] = useState(false);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [openDeleteCustomerModal, setOpenDeleteCustomerModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [openUpdateCustomerInfoModal, setOpenUpdateCustomerInfoModal] = useState(false);
  const [customerToUpdate, setCustomerToUpdate] = useState(null);
  const [updateInfoCustomer, setUpdateInfoCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    note: "",
  });

  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setOpenDeleteCustomerModal(true);
  };

  const handleDeleteCustomerConfirm = () => {
    setOpenDeleteCustomerModal(false);
    setBookingDetail((prev) => ({
      ...prev,
      passengers: prev.passengers.filter(
        (passenger) => passenger.id !== customerToDelete.id
      ),
    }));
  };

  const handleUpdateCustomerInfo = (customer) => {
    setBookingDetail((prev) => ({
      ...prev,
      passengers: prev.passengers.map((passenger) =>
        passenger.id === customer.id ? customer : passenger
      ),
    }));
  };

  const handleClose = () => {
    onClose();
    setBookingDetail(null);
    setOpenAddCustomerInfoModal(false);
    setSearch("");
  };

  const handleAddCustomerInfo = (passenger) => {
    setBookingDetail((prev) => ({
      ...prev,
      passengers: [...prev.passengers, passenger],
    }));
  };

  const handleExcelUploadAddCustomer = async (file) => {
    try {
      const data = await handleExcelUpload(file);
      if (data) {
        const convertedData = data.map((item) => ({
          ...item,
          gender: item.gender === "Nam" ? true : false,
          age_type:
            item.age_type === "Người lớn"
              ? "adult"
              : item.age_type === "Trẻ em"
              ? "child"
              : "Fix",
        }));
        setBookingDetail((prev) => ({
          ...prev,
          passengers: [...prev.passengers, ...convertedData],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateBooking = async () => {
    const response = await updateBooking(booking.id, {
      name: updateInfoCustomer.name,
      phone: updateInfoCustomer.phone,
      address: updateInfoCustomer.address,
      email: updateInfoCustomer.email,
      note: updateInfoCustomer.note,
      passengers: bookingDetail.passengers,
    });
    if (response.status === 200) {
      onSubmit();
      handleClose();
      alert("Cập nhật thành công");
    } else {
      alert("Cập nhật thất bại");
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      const response = await getBookingById(booking.id);
      if (response.status === 200) {
        setBookingDetail(response.data.data);
        setUpdateInfoCustomer({
          name: response.data.data?.name,
          phone: response.data.data?.phone,
          address: response.data.data?.address,
          email: response.data.data?.email,
          note: response.data.data?.note,
        });
      }
    };
    fetchBooking();
  }, [booking]);

  if (!open) return null;

  console.log("Booking detail", booking);
  

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] h-[90vh] max-w-7xl rounded-2xl p-6 overflow-hidden shadow-xl flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Thông tin chi tiết</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={handleClose}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>{" "}
        <div className="grid grid-cols-4 gap-5 mb-5">
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium">Mã đặt Tour</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              value={booking?.booking_code}
              disabled
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium">Ngày đặt</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              value={booking?.booking_date}
              disabled
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium">Tên người đặt</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              value={updateInfoCustomer.name}
              onChange={(e) =>
                setUpdateInfoCustomer({
                  ...updateInfoCustomer,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium">Số điện thoại</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              value={updateInfoCustomer.phone}
              onChange={(e) =>
                setUpdateInfoCustomer({
                  ...updateInfoCustomer,
                  phone: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1 col-span-4">
            <label className="text-md font-medium">Ghi chú</label>
            <textarea
              type="text"
              className="w-full rounded-md border border-gray-300 p-2"
              value={updateInfoCustomer.note}
              onChange={(e) =>
                setUpdateInfoCustomer({
                  ...updateInfoCustomer,
                  note: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 flex-1">
          <h2 className="text-xl font-semibold">Danh sách khách hàng</h2>
          <div className="flex flex-row justify-between items-center">
            <div>
              <SearchDebounceInput
                placeholder="Tìm kiếm khách hàng"
                onChange={(value) => {
                  setSearch(value);
                }}
              />
            </div>
            <div className="gap-1 flex justify-end items-center">
              <ImportExcelButton onFileSelect={handleExcelUploadAddCustomer} />
              <button
                className="bg-[#A80F21] text-white px-4 py-2 rounded-md whitespace-nowrap"
                onClick={() => setOpenAddCustomerInfoModal(true)}
              >
                Thêm thông tin khách hàng
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th>Họ và tên khách hàng</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Độ tuổi</th>
                  <th>Số điện thoại</th>
                  <th>CCCD/Passport</th>
                  <th className="text-center">Phòng đơn</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="h-fit">
                {bookingDetail?.passengers
                  ?.filter((customer) =>
                    customer.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((customer) => (
                    <tr key={customer.id} className="text-left">
                      <td>{customer.name}</td>
                      <td>{customer.birth_date}</td>
                      <td>{customer.gender ? "Nam" : "Nữ"}</td>
                      <td>{customer.age_type}</td>
                      <td>{customer.phone_number}</td>
                      <td>{customer.passport_number}</td>
                      <td>
                        {customer.single_room ? (
                          <CheckSquare className="text-blue-500 mx-auto" />
                        ) : (
                          <Square className="mx-auto" />
                        )}
                      </td>
                      <td className="flex gap-2 justify-center">
                        <Pencil
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setCustomerToUpdate(customer);
                            setOpenUpdateCustomerInfoModal(true);
                          }}
                        />
                        <Trash
                          className="w-4 h-4 cursor-pointer text-[#A80F21]"
                          onClick={() => handleDeleteCustomer(customer)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-xl font-semibold">
              Trạng thái:{" "}
              <span
                className={`${STATUS_BOOKING_COLOR[bookingDetail?.status]}`}
              >
                {STATUS_BOOKING_TEXT[bookingDetail?.status]}
              </span>
            </h2>
            <h2 className="text-xl font-semibold">
              Tổng tiền{" "}
              <span className="text-[#A80F21]">
                {bookingDetail?.total_cost.toLocaleString("vi-VN")} VNĐ
              </span>
            </h2>
          </div>
          <div className="flex flex-row justify-end items-center gap-2">
            <button
              className="border border-gray-300 px-4 py-2 rounded-md whitespace-nowrap"
              onClick={handleClose}
            >
              Hủy
            </button>
            <button
              className="bg-[#A80F21] text-white px-4 py-2 rounded-md whitespace-nowrap"
              onClick={handleUpdateBooking}
            >
              Lưu thao tác
            </button>
          </div>
        </div>
      </div>
      <ConfirmDeleteCustomer
        open={openDeleteCustomerModal}
        onClose={() => {
          setOpenDeleteCustomerModal(false);
          setCustomerToDelete(null);
        }}
        onDelete={handleDeleteCustomerConfirm}
        customer={customerToDelete}
      />
      <UpdateCustomerInfoModal
        open={openUpdateCustomerInfoModal}
        onClose={() => setOpenUpdateCustomerInfoModal(false)}
        onSubmit={handleUpdateCustomerInfo}
        customer={customerToUpdate}
      />
      <AddCustomerInfoModal
        open={openAddCustomerInfoModal}
        onClose={() => setOpenAddCustomerInfoModal(false)}
        onSubmit={handleAddCustomerInfo}
      />
    </div>
  );
};

export default BookingDetailsModal;
