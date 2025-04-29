import Modal from "react-modal";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ModalEditProfile({
  isOpen,
  onClose,
  field,
  initialValue,
  onSave,
}) {
  const [form, setForm] = useState({
    displayName: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  });

  useEffect(() => {
    if (initialValue) setForm(initialValue);
  }, [initialValue]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded shadow-lg w-[500px] mx-auto mt-40"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start"
    >
      <h2 className="text-xl font-bold mb-4">Cập nhật thông tin cá nhân</h2>

      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Họ tên</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={form.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ngày sinh</label>
          <DatePicker
            selected={form.date_of_birth ? new Date(form.date_of_birth) : null}
            onChange={(date) =>
              handleChange("date_of_birth", date?.toISOString().split("T")[0])
            }
            dateFormat="dd/MM/yyyy"
            className="border w-full p-2 rounded"
            placeholderText="Chọn ngày sinh"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giới tính</label>
          <select
            className="border w-full p-2 rounded"
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={onClose}>
          Huỷ
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={handleSubmit}
        >
          Lưu
        </button>
      </div>
    </Modal>
  );
}
