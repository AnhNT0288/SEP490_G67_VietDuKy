import { useState, useEffect } from "react";
import { updateLocation } from "../../../services/API/location.service.js";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalUpdateLocation({ onClose, onSuccess, initialData }) {
    const [locationName, setLocationName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setLocationName(initialData.name_location);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", locationName);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await updateLocation(initialData.id, formData);

            onSuccess(response);
            toast.success("Cập nhật vị trí thành công");

            onClose();
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
            console.error("Lỗi khi cập nhật vị trí:", error);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleWrapperClick}>
            <div className="bg-white rounded-lg shadow-lg w-1/4 p-6" onClick={handleModalClick}>
                <form onSubmit={handleSubmit}>
                    <div className="relative pb-3">
                        <div>
                            <h2 className="text-lg font-semibold">Cập nhật vị trí</h2>
                            <p className="text-gray-500 mb-4">
                                Chỉnh sửa thông tin vị trí
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl leading-none"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Tên vị trí</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="Nhập tên vị trí"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Ảnh hiện tại</label>
                        {initialData?.image ? (
                            <img
                                src={initialData.image}
                                alt="Ảnh vị trí hiện tại"
                                className="max-w-full max-h-40 object-contain rounded border"
                            />
                        ) : (
                            <div className="text-red-500 italic">Không tồn tại ảnh</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Ảnh mới (tùy chọn)</label>
                        <div
                            className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-center bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 transition"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) {
                                    setImageFile(file);
                                }
                            }}
                            onClick={() => document.getElementById("updateImageInput")?.click()}
                        >
                            {imageFile ? (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Ảnh mới"
                                    className="h-full w-full object-cover rounded-lg"
                                />
                            ) : (
                                <span>Kéo & thả ảnh mới tại đây hoặc click để chọn</span>
                            )}
                        </div>
                        <input
                            type="file"
                            id="updateImageInput"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImageFile(file);
                            }}
                        />
                    </div>

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
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}