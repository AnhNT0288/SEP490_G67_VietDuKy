import { useState } from "react";
import { Eye } from "lucide-react";
import FeedbackDetailsModal from "./FeedbackDetailsModal";

const Feedback = ({ feedbacks }) => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil((feedbacks?.length || 0) / itemsPerPage);

  const paginatedFeedbacks = feedbacks?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  ) || [];

  const renderTableRows = () => {
    if (!paginatedFeedbacks || paginatedFeedbacks.length === 0) {
      return (
          <tr>
            <td colSpan={7} className="text-center text-gray-500 py-6">
              Chưa có đánh giá nào
            </td>
          </tr>
      );
    }

    return paginatedFeedbacks.map((feedback, index) => (
        <tr key={feedback.feedback_id} className="border-t">
          <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
          <td className="p-2">{feedback.tour?.name_tour || "Không rõ"}</td>
          <td className="p-2">{feedback.feedback_date}</td>
          <td className="p-2 text-ellipsis">
            {feedback.description_feedback || "(Không có nội dung)"}
          </td>
          <td className="p-2">
            <div className="flex text-yellow-500 text-lg">
              {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < feedback.rating ? "★" : "☆"}</span>
              ))}
            </div>
          </td>
          <td className="p-2">
            {feedback.description_feedback ? "Đã xử lý" : "Chưa xử lý"}
          </td>
          <td className="flex justify-center p-2">
            <Eye
                onClick={() => {
                  setSelectedFeedback(feedback);
                  setOpenDetailsModal(true);
                }}
                className="cursor-pointer"
            />
          </td>
        </tr>
    ));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
              <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border text-sm ${
                      currentPage === i + 1 ? "bg-gray-200 font-semibold" : ""
                  }`}
              >
                {i + 1}
              </button>
          ))}
        </div>
    );
  };

  return (
      <div className="bg-white p-4 rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
          <tr className="text-SmokyGray text-left">
            <th className="p-2">STT</th>
            <th className="p-2">Tên tour</th>
            <th className="p-2">Thời gian</th>
            <th className="p-2">Nội dung đánh giá</th>
            <th className="p-2">Đánh giá</th>
            <th className="p-2">Trạng thái</th>
            <th
                className="text-end p-2"
                style={{ width: "1%", whiteSpace: "nowrap" }}
            >
              Chi tiết
            </th>
          </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>

        {renderPagination()}

        {selectedFeedback && (
            <FeedbackDetailsModal
                open={openDetailsModal}
                onClose={() => {
                  setOpenDetailsModal(false);
                  setSelectedFeedback(null);
                }}
                feedback={selectedFeedback}
            />
        )}
      </div>
  );
};

export default Feedback;
