import { XIcon } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line react/prop-types
const AddCustomerInfoModal = ({ open, onClose, onSubmit }) => {
  const [singleRoom, setSingleRoom] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    gender: "true",
    birth_date: "",
    age_type: "adult",
    phone_number: "",
    passport_number: "",
  });

  const [error, setError] = useState({
    name: "",
    gender: "",
    birth_date: "",
    age_type: "",
    phone_number: "",
    passport_number: "",
  });

  const validate = () => {
    let isValid = true;
    let error = {};
    if (!customerInfo.name) {
      error.name = "Họ và tên không được để trống";
      isValid = false;
    }
    if (!customerInfo.gender) {
      error.gender = "Giới tính không được để trống";
      isValid = false;
    }
    if (!customerInfo.birth_date) {
      error.birth_date = "Ngày sinh không được để trống";
      isValid = false;
    }
    if (!customerInfo.age_type) {
      error.age_type = "Độ tuổi không được để trống";
      isValid = false;
    }
    setError(error);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleClose = () => {
    setCustomerInfo({
      name: "",
      gender: "true",
      birth_date: "",
      age_type: "adult",
      phone_number: "",
      passport_number: "",
    });
    setError({
      name: "",
      gender: "",
      birth_date: "",
      age_type: "",
      phone_number: "",
      passport_number: "",
    });
    onClose();
  };

  const handleSubmit = (type) => {
    const isValid = validate();
    if (isValid) {
      if (type === "save") {
        onSubmit({
          ...customerInfo,
          id: uuidv4(),
          single_room: singleRoom,
        });
        handleClose();
      } else if (type === "save_and_continue") {
        onSubmit({
          ...customerInfo,
          id: uuidv4(),
          single_room: singleRoom,
        });
        setCustomerInfo({
          name: "",
          gender: "true",
          birth_date: "",
          age_type: "adult",
          phone_number: "",
          passport_number: "",
        });
        setError({
          name: "",
          gender: "",
          birth_date: "",
          age_type: "",
          phone_number: "",
          passport_number: "",
        });
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 overflow-hidden shadow-xl flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Thêm thông tin khách hàng</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={handleClose}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 flex flex-col gap-1">
            <label className="text-md font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2"
              value={customerInfo.name}
              onChange={handleChange}
              name="name"
            />
            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
          </div>
          <div className="col-span-4 flex flex-col gap-1">
            <label className="text-md font-medium">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              className="border border-gray-300 rounded-md p-2"
              value={customerInfo.gender}
              onChange={handleChange}
              name="gender"
            >
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
            {error.gender && (
              <p className="text-red-500 text-sm">{error.gender}</p>
            )}
          </div>
          <div className="col-span-6 flex flex-col gap-1">
            <label className="text-md font-medium">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded-md p-2"
              value={customerInfo.birth_date}
              onChange={handleChange}
              name="birth_date"
            />
            {error.birth_date && (
              <p className="text-red-500 text-sm">{error.birth_date}</p>
            )}
          </div>
          <div className="col-span-6 flex flex-col gap-1">
            <label className="text-md font-medium">
              Độ tuổi <span className="text-red-500">*</span>
            </label>
            <select
              className="border border-gray-300 rounded-md p-2"
              value={customerInfo.age_type}
              onChange={handleChange}
              name="age_type"
            >
              <option value="adult">Người lớn</option>
              <option value="child">Trẻ em</option>
              <option value="infant">Em bé</option>
            </select>
            {error.age_type && (
              <p className="text-red-500 text-sm">{error.age_type}</p>
            )}
          </div>
          <div className="col-span-12 flex flex-col gap-1">
            <label className="text-md font-medium">Số điện thoại</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2"
              value={customerInfo.phone_number}
              onChange={handleChange}
              name="phone_number"
            />
            {error.phone_number && (
              <p className="text-red-500 text-sm">{error.phone_number}</p>
            )}
          </div>
          <div className="col-span-12 flex flex-col gap-1">
            <label className="text-md font-medium">CCCD/ Passport</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2"
              value={customerInfo.passport_number}
              onChange={handleChange}
              name="passport_number"
            />
            {error.passport_number && (
              <p className="text-red-500 text-sm">{error.passport_number}</p>
            )}
          </div>
          <div className="col-span-12 flex flex-row gap-2">
            <button
              onClick={() => setSingleRoom(!singleRoom)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                singleRoom ? "bg-[#A80F21]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  singleRoom ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <label className="text-md">Phòng đơn</label>
          </div>
          <div className="col-span-12 flex flex-row gap-2 justify-end">
            <button
              className="border border-gray-300 px-4 py-2 rounded-md"
              onClick={handleClose}
            >
              Hủy
            </button>
            <button
              className="border border-[#A80F21] text-[#A80F21] px-4 py-2 rounded-md"
              onClick={() => handleSubmit("save")}
            >
              Lưu
            </button>
            <button
              className="bg-[#A80F21] text-white px-4 py-2 rounded-md"
              onClick={() => handleSubmit("save_and_continue")}
            >
              Lưu và tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerInfoModal;
