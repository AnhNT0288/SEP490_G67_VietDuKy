import { useState } from "react";

export default function ModalAddVehicle({ onClose }) {
  const [vehicles, setVehicles] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState("");
  const [licensePlates, setLicensePlates] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-lg w-1/4 p-6">
        <form>
          <div className="relative pb-3">
            {/* Tiêu đề và mô tả */}
            <div>
              <h2 className="text-lg font-semibold">Thêm Phương tiện</h2>
              <p className="text-gray-500 mb-4">
                Quản trị viên thêm Phương tiện mới
              </p>
            </div>

            {/* Nút đóng ở góc trên cùng bên phải */}
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div>
            {/* Tên Phương tiện */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                Tên Phương tiện
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Nhập tên phương tiện"
                value={vehicles}
                // onChange={(e) => setLocationName(e.target.value)}
              />
            </div>

            {/* Loại phương tiện */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                Loại phương tiện
              </label>
              <select className="w-full p-2 border rounded text-gray-500">
                <option value={vehicleTypes} disabled selected>
                  Loại phương tiện
                </option>
                <option value="auto">Xe hơi</option>
                <option value="motobike">Xe máy</option>
                <option value="plane">Máy bay</option>
              </select>
            </div>

            {/* Biển số phương tiện */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                Biển số phương tiện
              </label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Nhập biển số phương tiện"
                value={licensePlates}
                // onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          {/* Button Actions */}
          <div className="flex justify-end gap-4 mt-12">
            <button
              type="button"
              className="hover:bg-gray-300 hover:text-white border border-solid border-gray-300 px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Tạo mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
