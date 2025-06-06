import { PostExperienceService } from "@/services/API/post_experience.service";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import TextEditor from "@/lib/TextEditor";

export default function ModalEditSharePost({ isOpen, onClose, post, onUpdateSuccess }) {
  const [form, setForm] = useState({
    title_post: "",
    name_post: "",
    description_post: "",
    post_date: new Date().toISOString(),
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (isOpen && post) {
      setForm({
        title_post: post.title_post,
        name_post: post.name_post,
        description_post: post.description_post,
        post_date: post.post_date,
      });

      // Nếu có album ảnh trong post
      if (post.postEx_album) {
        try {
          const parsedAlbum = JSON.parse(post.postEx_album);
          setPreviewImages(parsedAlbum || []);
        } catch (error) {
          console.error("Error parsing album:", error);
          setPreviewImages([]);
        }
      } else {
        setPreviewImages([]);
      }

      setSelectedFiles([]);
    }
  }, [isOpen, post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewURLs);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title_post", form.title_post);
      formData.append("name_post", form.name_post);
      formData.append("description_post", form.description_post);
      formData.append("post_date", form.post_date);
  
      previewImages.forEach((url) => {
        formData.append("old_album[]", url);
      });
      selectedFiles.forEach((file) => {
        formData.append("new_album", file);
      });
  
      const res = await PostExperienceService.updatePostExperience(post.id, formData);
  
      // gọi callback sau khi update thành công
      if (onUpdateSuccess) {
        onUpdateSuccess(res.data.data); // hoặc res.data nếu API trả đúng updated post
      }
  
      toast.success("Bài viết đã được cập nhật thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật bài viết!");
      console.error("Lỗi khi cập nhật bài viết:", error);
    } finally {
      setPreviewImages([]);
      setSelectedFiles([]);
    }
  };
  

  const handleRemoveImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg max-w-5xl w-full p-6 relative text-zinc-900">
        <button
          className="absolute top-3 right-4 text-xl text-zinc-900 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-2">Sửa bài viết chia sẻ</h2>
        <p className="text-sm text-gray-500 mb-6">
          Cập nhật thông tin bài viết chia sẻ của bạn.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-zinc-900">
          <div className="space-y-4 col-span-2">
            <div>
              <label className="text-sm font-medium">* Tên bài viết</label>
              <input
                type="text"
                name="name_post"
                value={form.name_post}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Nhập tên bài viết"
              />
            </div>

            <div>
              <label className="text-sm font-medium">* Tiêu đề bài viết</label>
              <input
                type="text"
                name="title_post"
                value={form.title_post}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">
                Tập tin đính kèm
              </label>
              <div
                className="w-full h-40 border-2 border-dashed rounded flex items-center justify-center text-gray-400 hover:border-red-600 hover:text-red-600 cursor-pointer transition"
                onClick={() =>
                  document.getElementById("hiddenFileInput").click()
                }
              >
                {previewImages.length === 0 ? (
                  <span>Click để chọn ảnh</span>
                ) : (
                  <div className="flex overflow-x-auto space-x-2 p-2">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-24 h-24 object-cover border rounded shadow"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                id="hiddenFileInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex flex-col h-full col-span-3">
            <label className="text-sm font-medium mb-2">Bài viết</label>
            <div className="flex-1 flex flex-col overflow-hidden">
              <TextEditor
                value={form.description_post}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, description_post: value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
