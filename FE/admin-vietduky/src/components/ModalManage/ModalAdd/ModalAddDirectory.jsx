import { useState } from "react";
import { createDirectory } from "../../../services/API/directory.service";

export default function ModalAddDirectory({ onClose, onCreateSuccess }) {
    const [name_directory, setNameDirectory] = useState("");
    const [alias, setAlias] = useState("");

    const handleCreate = async () => {
        try {
            const res = await createDirectory({ name_directory, alias });
            alert("✅ Tạo danh mục thành công!");
            if (onCreateSuccess) {
                onCreateSuccess(res?.data || { name_directory, alias });
            }
            onClose();
        } catch (error) {
            alert("❌ Tạo danh mục thất bại!");
            console.error("Lỗi tạo danh mục:", error);
        }
    };

    function generateAlias(str) {
        return str
            .toLowerCase()
            .replace(/đ/g, "d")
            .replace(/ă|ắ|ằ|ẵ|ẳ|ặ/g, "a")
            .replace(/â|ấ|ầ|ẫ|ẩ|ậ/g, "a")
            .replace(/á|à|ả|ã|ạ/g, "a")
            .replace(/ê|ế|ề|ễ|ể|ệ/g, "e")
            .replace(/é|è|ẻ|ẽ|ẹ/g, "e")
            .replace(/ô|ố|ồ|ỗ|ổ|ộ/g, "o")
            .replace(/ơ|ớ|ờ|ỡ|ở|ợ/g, "o")
            .replace(/ó|ò|ỏ|õ|ọ/g, "o")
            .replace(/ư|ứ|ừ|ữ|ử|ự/g, "u")
            .replace(/ú|ù|ủ|ũ|ụ/g, "u")
            .replace(/í|ì|ỉ|ĩ|ị/g, "i")
            .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-md shadow-lg w-1/3 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <h2 className="text-lg font-semibold mb-2">Thêm danh mục</h2>
                    <p className="text-gray-500 mb-4">Tạo danh mục cho bài viết</p>
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Tên danh mục <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="Nhập tên danh mục"
                        value={name_directory}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNameDirectory(value);
                            setAlias(generateAlias(value));
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Alias</label>
                    <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="Alias không dấu"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
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
                        Tạo danh mục
                    </button>
                </div>
            </div>
        </div>
    );
}
