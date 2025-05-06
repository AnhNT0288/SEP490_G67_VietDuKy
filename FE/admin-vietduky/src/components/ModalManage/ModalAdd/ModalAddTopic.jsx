import { useState } from "react";
import { createTopic } from "../../../services/API/topic.service";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalAddTopic({ onClose, onCreateSuccess  }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = async () => {
        try {
            const res = await createTopic({ name, description });
            toast.success("Tạo chủ đề thành công!");
            if (onCreateSuccess) {
                onCreateSuccess(res?.data || { name, description });
            }
        } catch (error) {
            toast.error("Tạo chủ đề thất bại!");
            console.error("Lỗi tạo chủ đề:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-md shadow-lg w-1/3 h-3/6 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <h2 className="text-lg font-semibold mb-2">Thêm chủ đề</h2>
                    <p className="text-gray-500 mb-4">Thêm chủ đề cho Tour</p>
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Tên chủ đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="Nhập tên chủ đề"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Mô tả chủ đề</label>
                    <textarea
                        className="w-full border rounded-md p-2 h-28"
                        placeholder="Nhập mô tả"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="border border-red-700 text-red-700 px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-red-700 text-white px-4 py-2 rounded-md"
                        onClick={handleCreate}
                    >
                        Tạo chủ đề
                    </button>
                </div>
            </div>
        </div>
    );
}
