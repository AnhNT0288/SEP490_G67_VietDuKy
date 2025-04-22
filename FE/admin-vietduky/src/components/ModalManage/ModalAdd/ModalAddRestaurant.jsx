import { useState } from "react";

export default function ModalAddRestaurant({ onClose }) {
  const [restaurantName, setRestaurantName] = useState("");
  const [locationRestaurant, setLocationRestaurant] = useState("");
  const [hotline, setHotline] = useState("");

  const handleWrapperClick = () => {
    onClose();
  };
  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleWrapperClick}>
      <div className="bg-white rounded-md shadow-lg w-1/4 p-6" onClick={handleModalClick}>
        <form>
          <div className="relative pb-3">
            {/* Tiêu đề và mô tả */}
            <div>
              <h2 className="text-lg font-semibold">Thêm Nhà hàng</h2>
              <p className="text-gray-500 mb-4">
                Quản trị viên thêm Nhà hàng mới
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
            {/* Tên nhà hàng */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">Tên Nhà hàng</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Nhập tên nhà hàng"
                value={restaurantName}
                // onChange={(e) => setLocationName(e.target.value)}
              />
            </div>

            {/* Địa chỉ */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">Địa chỉ</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Nhập địa chỉ của nhà hàng"
                value={locationRestaurant}
                // onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Số điện thoại */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">Số điện thoại</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Nhập số điện thoại của nhà hàng"
                value={hotline}
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
