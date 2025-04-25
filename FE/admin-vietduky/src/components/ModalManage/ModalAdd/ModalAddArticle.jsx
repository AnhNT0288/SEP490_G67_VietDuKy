import {useEffect, useState} from "react";
import { createArticle } from "../../../services/API/article.service";
import TextEditor from "../../../lib/TextEditor";
import { FaTimes } from "react-icons/fa";
import {getAllDirectories} from "../../../services/API/directory.service.js";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalAddArticle({ onClose, onCreated }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [form, setForm] = useState({
        alias: "",
        slug: "",
        directory_id: "",
        album_post: "",
        description: "",
        true_featured: false,
        true_active: false,
    });
    const [directories, setDirectories] = useState([]);
    function generateSlug(str) {
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

    useEffect(() => {
        const fetchDirectories = async () => {
            try {
                const data = await getAllDirectories();
                setDirectories(data);
            } catch (err) {
                console.error("❌ Lỗi khi lấy danh mục:", err);
            }
        };

        fetchDirectories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => {
            const updated = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };

            if (name === "alias") {
                updated.slug = generateSlug(value);
            }

            return updated;
        });

    };

    const handleEditorChange = (value) => {
        setForm((prev) => ({ ...prev, description: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
            setForm((prev) => ({
                ...prev,
                album_post: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("alias", form.alias);
        formData.append("slug", form.slug);
        formData.append("description", form.description);
        formData.append("directory_id", form.directory_id);
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).id : null;

        if (!userId) {
            toast.error("Không tìm thấy user_id trong localStorage");
            return;
        }
        formData.append("user_id", userId);

        formData.append("user_id", userId);        formData.append("true_featured", form.true_featured ? "1" : "0");
        formData.append("true_active", form.true_active ? "1" : "0");

        if (form.album_post) {
            formData.append("album_post", form.album_post);
        } else {
            toast.error("Vui lòng chọn ảnh bìa!");
            return;
        }

        try {
            await createArticle(formData);
            toast.success("Tạo bài viết thành công!");
            onCreated?.();
            onClose();
        } catch (err) {
            toast.error("Tạo bài viết thất bại");
            console.error(err);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-md w-3/4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-1">Thêm bài viết mới</h2>
                <p className="text-sm text-gray-500 mb-4">Quản trị viên tạo bài viết</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6">
                        {/* Left Column */}
                        <div className="w-2/5">
                            <label className="block font-medium mb-2"><span className="text-red-500">*</span> Tên bài viết</label>
                            <input
                                type="text"
                                name="alias"
                                value={form.alias}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-4"
                                placeholder="Nhập tên bài viết"
                                required
                            />

                            <label className="block font-medium mb-2"><span className="text-red-500">*</span> Đường dẫn </label>
                            <input
                                type="text"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-4"
                                placeholder="duong-dan"
                                required
                            />

                            <label className="block font-medium mb-2">Danh mục (ID) *</label>
                            <select
                                name="directory_id"
                                value={form.directory_id}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-4 text-gray-700"
                                required
                            >
                                <option value="" disabled>Chọn danh mục</option>
                                {directories.map((dir) => (
                                    <option key={dir.id} value={dir.id}>
                                        {dir.name_directory}
                                    </option>
                                ))}
                            </select>

                            <label className="block font-medium mb-2">Ảnh bìa (URL)</label>
                            <div
                                className="w-full h-36 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-center bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => document.getElementById("fileInput")?.click()}
                            >
                                {previewImage ? (
                                    <div className="relative">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="h-36 w-auto object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded px-1 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewImage(null);
                                                setForm((prev) => ({ ...prev, album_post: "" }));
                                            }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <span>Chọn ảnh từ máy hoặc dán URL vào</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />

                            <div className="mt-4 flex flex-col gap-4">
                                {/* Toggle Bài viết nổi bật */}
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-700 w-32">Bài viết nổi bật</span>
                                    <button
                                        type="button"
                                        className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
                                            form.true_featured ? "bg-red-500" : "bg-gray-300"
                                        }`}
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                true_featured: !prev.true_featured,
                                            }))
                                        }
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                                                form.true_featured ? "translate-x-5" : ""
                                            }`}
                                        ></div>
                                    </button>
                                </div>

                                {/* Toggle Kích hoạt */}
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-700 w-32">Kích hoạt</span>
                                    <button
                                        type="button"
                                        className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
                                            form.true_active ? "bg-red-500" : "bg-gray-300"
                                        }`}
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                true_active: !prev.true_active,
                                            }))
                                        }
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                                                form.true_active ? "translate-x-5" : ""
                                            }`}
                                        ></div>
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Right Column */}
                        <div className="w-3/5 ">
                            <label className="block font-medium mb-2">Mô tả chi tiết</label>
                            <TextEditor className="min-h-[300px]" value={form.description} onChange={handleEditorChange} />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 gap-4">
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded-md"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-red-700 text-white px-4 py-2 rounded-md"
                        >
                            Tạo bài viết
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
