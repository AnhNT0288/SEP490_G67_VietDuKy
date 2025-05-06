import { useState, useRef } from "react";
import RatingStars from "../Feedback/RatingStar";
import { FeedbackService } from "@/services/API/feedback.service";
import { toast } from "react-toastify";

export default function ModalFeedbackTour({ isOpen, onClose, booking }) {
  const [rating, setRating] = useState(0);
  const [descriptionFeedback, setDescriptionFeedback] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFilesSelected = (selectedFiles) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFilesSelected(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesSelected(droppedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", booking.user_id);
    formData.append("tour_id", booking.TravelTour?.Tour?.id);
    formData.append("description_feedback", descriptionFeedback);
    formData.append("rating", rating);
    formData.append("feedback_date", new Date().toISOString().split("T")[0]);

    files.forEach((file) => {
      formData.append("feedback_album", file);
    });

    try {
      await FeedbackService.createFeedbackTour(formData);
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
      toast.error("Lỗi khi gửi đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-11/12 md:w-1/3 p-6 rounded shadow-md relative">
        {/* Nút Đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center mb-1">Đánh giá chuyến đi</h2>
        {/* Tên tour */}
        <p className="text-center text-red-600 font-medium mb-4 text-sm">
          {booking?.TravelTour?.Tour?.name_tour || "Không có tên tour"}
        </p>

        {/* Đánh giá sao */}
        <label className="block mb-1 font-medium text-gray-700">
          Chọn số sao đánh giá:
        </label>
        <RatingStars rating={rating} setRating={setRating} />

        {/* Nhập nhận xét */}
        <label className="block mt-4 mb-1 font-medium text-gray-700">
          Nhận xét chuyến đi:
        </label>
        <textarea
          value={descriptionFeedback}
          onChange={(e) => setDescriptionFeedback(e.target.value)}
          placeholder="Nhập cảm nghĩ của bạn về tour..."
          className="border rounded p-2 w-full h-28 resize-none"
        />

        {/* Kéo thả hoặc upload file */}
        <label className="block mt-4 mb-1 font-medium text-gray-700">
          Thêm ảnh hoặc video minh hoạ:
        </label>
        <div
          className="border-dashed border-2 border-gray-300 p-4 rounded text-center cursor-pointer hover:border-red-400 transition"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-sm text-gray-500">
            Kéo & thả hoặc bấm để chọn file từ máy tính (hỗ trợ ảnh, video)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Danh sách file đã chọn */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4 max-h-40 overflow-y-auto">
            {files.map((file, index) => {
              const fileURL = URL.createObjectURL(file);
              const isImage = file.type.startsWith("image/");

              return (
                <div key={index} className="relative">
                  {isImage ? (
                    <img
                      src={fileURL}
                      alt="preview"
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={fileURL}
                      controls
                      className="w-full h-24 object-cover rounded"
                    />
                  )}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
}
