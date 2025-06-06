import {
  ArrowLeft,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Square,
  Trash,
  XIcon,
} from "lucide-react";
import SearchDebounceInput from "../common/SearchDebouceInput";
import AddCustomerInfoModal from "../Modal/ModalAdd/AddCustomerInfoModal.jsx";
import { useEffect, useState } from "react";
import { handleExcelUpload } from "../../../utils/handleExcel.js";
import {
  getBookingById,
  updateBooking,
} from "../../../services/API/booking.service.js";
import ImportExcelButton from "../Confirm/ImportExcelButton.jsx";
import {
  STATUS_BOOKING_COLOR,
  STATUS_BOOKING_TEXT,
} from "../../../constants/app.constant.jsx";
import ConfirmDeleteCustomer from "../Confirm/ConfirmDeleteCustomer.jsx";
import UpdateCustomerInfoModal from "../Confirm/UpdateCustomerInfoModal.jsx";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { Pagination } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
const ModalBookingDetail = ({ booking, open, onClose, onSubmit }) => {
  const [search, setSearch] = useState("");
  const [openAddCustomerInfoModal, setOpenAddCustomerInfoModal] =
    useState(false);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [openDeleteCustomerModal, setOpenDeleteCustomerModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [openUpdateCustomerInfoModal, setOpenUpdateCustomerInfoModal] =
    useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [customerToUpdate, setCustomerToUpdate] = useState(null);
  const [updateInfoCustomer, setUpdateInfoCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    note: "",
  });
  const totalPage = Math.ceil(
    bookingDetail?.passengers.length / pagination.limit
  );

  const handlePagination = (type) => {
    if (type === "prev") {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    } else {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const validatePassenger = (passengers, newPassenger) => {
    const countByType = (type) =>
      passengers.filter((p) => p.age_type === type).length +
      (newPassenger?.age_type === type ? 1 : 0);

    const totalCount = passengers.length + (newPassenger ? 1 : 0);

    const validAdult =
      countByType("adult") <= (bookingDetail?.number_adult || 0);
    const validChild =
      countByType("child") <= (bookingDetail?.number_children || 0);
    const validToddler =
      countByType("toddler") <= (bookingDetail?.number_toddler || 0);
    const validNewborn =
      countByType("newborn") <= (bookingDetail?.number_newborn || 0);

    const validTotal =
      totalCount <=
      (bookingDetail?.number_adult || 0) +
        (bookingDetail?.number_children || 0) +
        (bookingDetail?.number_toddler || 0) +
        (bookingDetail?.number_newborn || 0);

    const messageError = () => {
      if (!validAdult) return "Số lượng người lớn không hợp lệ";
      if (!validChild) return "Số lượng trẻ em không hợp lệ";
      if (!validToddler) return "Số lượng trẻ nhỏ không hợp lệ";
      if (!validNewborn) return "Số lượng em bé không hợp lệ";
      if (!validTotal) return "Tổng số khách hàng không hợp lệ";
    };

    return {
      isValid:
        validAdult && validChild && validToddler && validNewborn && validTotal,
      messageError,
    };
  };

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
          age_type: item.birth_date ? getAgeType(item.birth_date) : "",
          single_room: item.single_room === "Có" ? true : false,
          id: uuidv4(),
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
    try {
      const validate = validatePassenger(bookingDetail.passengers);
      if (!validate.isValid) {
        toast.error(validate.messageError());
        return;
      }
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
        toast.success("Cập nhật thành công");
      } else {
        toast.error(response.data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Cập nhật thất bại");
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      const response = await getBookingById(booking?.id);
      if (response.status === 200) {
        const passengers = response.data.data.passengers.map((passenger) => ({
          ...passenger,
          age_type: passenger.birth_date
            ? getAgeType(passenger.birth_date)
            : "",
        }));
        setBookingDetail({ ...response.data.data, passengers });
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
  }, [booking?.id]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] h-[90vh] max-w-7xl rounded-2xl p-6 overflow-auto shadow-xl flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">Thông tin chi tiết</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={handleClose}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>{" "}
        <div className="grid grid-cols-4 gap-5 mb-3">
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
          <div>
            <div className="flex-1 overflow-y-auto min-h-[280px]">
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
                    .slice(
                      (pagination.page - 1) * pagination.limit,
                      pagination.page * pagination.limit
                    )
                    .map((customer) => (
                      <tr key={customer.id} className="text-left">
                        <td>{customer.name}</td>
                        <td>{customer.birth_date}</td>
                        <td>{customer.gender ? "Nam" : "Nữ"}</td>
                        <td>{getAgeTypeLabel(customer.age_type)}</td>
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

            <div className="flex justify-end items-center">
              <button
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePagination("prev")}
                disabled={pagination.page === 1}
              >
                <ChevronLeft />
              </button>
              <button
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  pagination.page === totalPage
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handlePagination("next")}
                disabled={pagination.page === totalPage}
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center space-x-4">
            <p className="text-md font-medium">
              Người lớn:{" "}
              {
                bookingDetail?.passengers.filter(
                  (passenger) => passenger.age_type === "adult"
                ).length
              }
            </p>
            <p className="text-md font-medium">
              Trẻ em:{" "}
              {
                bookingDetail?.passengers.filter(
                  (passenger) => passenger.age_type === "child"
                ).length
              }
            </p>
            <p className="text-md font-medium">
              Trẻ nhỏ:{" "}
              {
                bookingDetail?.passengers.filter(
                  (passenger) => passenger.age_type === "toddler"
                ).length
              }
            </p>
            <p className="text-md font-medium">
              Em bé:{" "}
              {
                bookingDetail?.passengers.filter(
                  (passenger) => passenger.age_type === "newborn"
                ).length
              }
            </p>
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

export default ModalBookingDetail;

function getAgeType(birthDateStr) {
  const birthDate = new Date(birthDateStr);
  const now = new Date();

  // Tính tuổi chính xác theo năm, tháng, ngày
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  const dayDiff = now.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age < 2) return "newborn";
  if (age >= 2 && age < 5) return "toddler";
  if (age >= 5 && age < 11) return "child";
  return "adult";
}

function getAgeTypeLabel(ageType) {
  switch (ageType) {
    case "adult":
      return "Người lớn";
    case "child":
      return "Trẻ em";
    case "toddler":
      return "Trẻ nhỏ";
    case "newborn":
      return "Em bé";
    default:
      return "";
  }
}
