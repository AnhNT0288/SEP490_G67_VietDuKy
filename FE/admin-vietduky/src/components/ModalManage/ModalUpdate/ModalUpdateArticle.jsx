import { useEffect, useState } from "react";
import { updateArticle } from "../../../services/API/article.service.js";
import TextEditor from "../../../lib/TextEditor";
import { toast } from "react-toastify";
import { getAllDirectories } from "../../../services/API/directory.service.js";

export default function ModalUpdateArticle({ article, onClose }) {
  const [form, setForm] = useState({
    article_title: "",
    article_name: "",
    description: "",
    directory_id: "",
    true_featured: false,
    true_active: false,
    album_post: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [directories, setDirectories] = useState([]);

  useEffect(() => {
    if (article) {
      setForm({
        article_title: article.article_title || "",
        article_name: article.article_name || "",
        description: article.description || "",
        directory_id: article.directory_id || "",
        true_featured: article.true_featured === 1,
        true_active: article.true_active === 1,
        album_post: null,
      });

      // Load ảnh cũ từ album
      if (article.album_post) {
        const album = JSON.parse(article.album_post);
        setPreviewImage(album[0] || null);
      }
    }
  }, [article]);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const res = await getAllDirectories();
        setDirectories(res);
      } catch (error) {
        console.error("❌ Lỗi lấy danh mục:", error);
      }
    };
    fetchDirectories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (value) => {
    setForm((prev) => ({ ...prev, description: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setForm((prev) => ({ ...prev, album_post: file }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("article_title", form.article_title);
    formData.append("article_name", form.article_name);
    formData.append("description", form.description);
    formData.append("directory_id", form.directory_id);
    formData.append("true_featured", form.true_featured ? "1" : "0");
    formData.append("true_active", form.true_active ? "1" : "0");
  
    if (form.album_post) {
      formData.append("album_post", form.album_post);
    }
  
    try {
      await updateArticle(article.id, formData);
      toast.success("Cập nhật bài viết thành công!");
      onClose();
    } catch (error) {
      toast.error("Lỗi cập nhật bài viết!");
      console.error("❌ Lỗi update:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-6xl relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa bài viết</h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div>
            <label className="block mt-4 mb-2 font-medium">Tên bài viết</label>
              <input
                type="text"
                name="article_name"
                value={form.article_name}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2"
              />

              <label className="block mb-2 font-medium">Tiêu đề bài viết</label>
              <input
                type="text"
                name="article_title"
                value={form.article_title}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2"
                required
              />

              <label className="block mt-4 mb-2 font-medium">Chọn danh mục</label>
              <select
                name="directory_id"
                value={form.directory_id}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {directories.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {dir.name_directory}
                  </option>
                ))}
              </select>

              <label className="block mt-4 mb-2 font-medium">Ảnh bìa</label>
              <div
                className="w-full h-40 border-2 border-dashed rounded flex items-center justify-center text-gray-400 hover:border-red-600 hover:text-red-600 cursor-pointer transition"
                onClick={() => document.getElementById("fileInputUpdate").click()}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <span>Click để chọn ảnh</span>
                )}
              </div>
              <input
                id="fileInputUpdate"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="true_featured"
                    checked={form.true_featured}
                    onChange={handleChange}
                    className="accent-red-600"
                  />
                  Bài viết nổi bật
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="true_active"
                    checked={form.true_active}
                    onChange={handleChange}
                    className="accent-red-600"
                  />
                  Kích hoạt
                </label>
              </div>
            </div>

            {/* Right */}
            <div>
              <label className="block mb-2 font-medium">Nội dung bài viết</label>
              <div className="h-[300px] overflow-y-auto">
                <TextEditor
                  value={form.description}
                  onChange={handleEditorChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
