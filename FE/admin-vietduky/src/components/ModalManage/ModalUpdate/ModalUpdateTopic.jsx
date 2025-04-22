import { useState } from "react";
import { updateTopic } from "../../../services/API/topic.service";

export default function ModalUpdateTopic({ topic, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        name: topic.name || "",
        description: topic.description || "",
        active: topic.active || false,
    });

    const handleSubmit = async () => {
        try {
            const updatedData = {
                name: formData.name,
                description: formData.description,
                active: formData.active,
            };

            const res = await updateTopic(topic.id, updatedData);
            alert("Cập nhật thành công!");

            if (onUpdate) {
                onUpdate({ ...topic, ...updatedData });
            }

            onClose();
        } catch (error) {
            console.error("Lỗi khi cập nhật chủ đề:", error);
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg w-[400px]" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">Cập nhật chủ đề</h2>

                <input
                    className="border w-full px-3 py-2 mb-3 rounded"
                    placeholder="Tên chủ đề"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <textarea
                    className="border w-full px-3 py-2 mb-3 rounded"
                    placeholder="Mô tả"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <div className="flex items-center mb-4 gap-2">
                    <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <label>Kích hoạt</label>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-red-700 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
