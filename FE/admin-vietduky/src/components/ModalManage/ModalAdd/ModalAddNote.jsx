import { useState } from "react";
import { createTourNote } from "../../../services/API/note.service.js";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalAddNote({ tourId, onClose }) {
    const [tab, setTab] = useState("");
    const [description, setDescription] = useState("");

    const tabOptions = [
        "Giá bao gồm",
        "Giá không bao gồm",
        "Phụ thu",
        "Thông tin Visa",
        "Hủy đổi",
        "Lưu ý",
        "Hướng dẫn viên",
    ];

    const handleCreate = async () => {
        if (!tab || !description.trim()) {
            toast.error("Vui lòng chọn tiêu đề và nhập mô tả!");
            return;
        }

        try {
            const res = await createTourNote({ tour_id: tourId, tab, description });
            console.log("✅ Note created:", res);
            toast.success("Tạo thông tin lưu ý thành công!");
            onClose();
        } catch (error) {
            toast.error("Tạo thất bại!");
            console.error("Lỗi khi tạo note:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-2">Thêm thông tin lưu ý</h2>

                <div className="mb-4">
                    <label htmlFor="tab" className="text-sm font-medium">Tiêu đề</label>
                    <select
                        id="tab"
                        className="border px-3 py-2 rounded w-full mt-1"
                        value={tab}
                        onChange={(e) => setTab(e.target.value)}
                    >
                        <option value="" disabled>Chọn tiêu đề</option>
                        {tabOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="text-sm font-medium">Mô tả chi tiết</label>
                    <textarea
                        id="description"
                        className="border px-3 py-2 rounded w-full mt-1"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Nhập nội dung lưu ý"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded" onClick={onClose}>Hủy</button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleCreate}>
                        Tạo
                    </button>
                </div>
            </div>
        </div>
    );
}
