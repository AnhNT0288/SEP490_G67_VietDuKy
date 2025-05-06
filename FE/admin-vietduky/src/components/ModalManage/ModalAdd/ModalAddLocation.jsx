import { useState } from "react";
import { createLocation } from "../../../services/API/location.service.js";
import {toast} from "react-toastify";

export default function ModalAddLocation({ onClose, onSuccess }) {
  const [locationName, setLocationName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu tên bị bỏ trống
    if (!locationName.trim()) {
      setNameError(true);
      return;
    }

    setLoading(true);
    setNameError(false); // Reset lỗi nếu hợp lệ

    try {
      const formData = new FormData();
      formData.append("name_location", locationName);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await createLocation(formData);
      toast.success("Thêm vị trí thành công");
      onSuccess(response);
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Lỗi khi thêm vị trí:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWrapperClick = () => {
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
      <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleWrapperClick}
      >
        <div className="bg-white rounded-lg shadow-lg w-1/4 p-6" onClick={handleModalClick}>
          <form onSubmit={handleSubmit}>
            <div className="relative pb-3">
              <div>
                <h2 className="text-lg font-semibold">Thêm vị trí</h2>
                <p className="text-gray-500 mb-4">Quản trị viên thêm vị trí cho Tour</p>
              </div>
              <button
                  onClick={onClose}
                  className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Input Tên vị trí */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Tên vị trí</label>
              <input
                  type="text"
                  className={`w-full border rounded p-2 ${nameError ? 'border-red-500' : ''}`}
                  placeholder="Nhập tên vị trí"
                  value={locationName}
                  onChange={(e) => {
                    setLocationName(e.target.value);
                    setNameError(false);
                  }}
              />
              {nameError && (
                  <p className="text-red-500 text-sm mt-1">Vui lòng không bỏ trống</p>
              )}
            </div>

            {/* Input Ảnh */}
            {/* Drag & Drop Ảnh */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Ảnh (tùy chọn)</label>
              <div
                  className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-center bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  onClick={() => document.getElementById("locationImageInput")?.click()}
              >
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-lg"
                    />
                ) : (
                    <span>Kéo & thả ảnh vị trí tại đây (.jpg, .png)</span>
                )}
              </div>
              <input
                  type="file"
                  id="locationImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    } else {
                      setImagePreview(null);
                    }
                  }}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                  type="button"
                  className="hover:bg-gray-300 hover:text-white border border-solid border-gray-300 px-4 py-2 rounded-md"
                  onClick={onClose}
              >
                Hủy
              </button>
              <button
                  type="submit"
                  className="bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  disabled={loading}
              >
                {loading ? "Đang tạo..." : "Tạo mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
