import { HiOutlineDotsHorizontal } from "react-icons/hi";
import RatedStars from "./RatedStars";
import { Eye, View } from "lucide-react";
import FeedbackDetailsModal from "./FeedbackDetailsModal";
import { useState } from "react";

const Feedback = ({ feedbacks }) => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

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
        <tbody>
          {feedbacks.map((feedback, index) => (
            <tr key={feedback.id} className="border-t">
              <td className=" p-2">{index + 1}</td>
              <td className=" p-2">{feedback.tour_name}</td>
              <td className=" p-2">{feedback.time}</td>
              <td className=" p-2 text-ellipsis">{feedback.content}</td>
              <td className=" p-2">
                <RatedStars rating={feedback.rating} />
              </td>
              <td className=" p-2">{feedback.status}</td>
              <td className="flex justify-center p-2">
                <Eye
                  onClick={() => {
                    setSelectedFeedback(feedback);
                    setOpenDetailsModal(true);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <FeedbackDetailsModal
        open={openDetailsModal}
        onClose={() => {
          setOpenDetailsModal(false);
          setSelectedFeedback(null);
        }}
        feedback={feedback_deatils}
      />
    </div>
  );
};

export default Feedback;

const feedback_deatils = {
  user: {
    name: "Nguyễn Văn A",
    avatar: "https://avatars.githubusercontent.com/u/99978378?v=4&size=64",
  },
  tour_name: "Tour du lịch Hà Nội",
  time: "2021-01-01",
  content: "Đánh giá tốt",
  rating: 5,
  status: "Đã duyệt",
  createdAt: "2021-01-01",
  status_rating: "Vui",
};
