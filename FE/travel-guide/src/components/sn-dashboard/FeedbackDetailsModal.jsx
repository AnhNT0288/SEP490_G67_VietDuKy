import { X } from "lucide-react";
import RatedStars from "./RatedStars";

const FeedbackDetailsModal = ({ open, onClose, feedback }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-2xl p-6 rounded-lg shadow-xl relative overflow-x-auto overflow-y-hidden gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold mb-2 text-[#A80F21]">
            {feedback.tour_name}
          </h2>
          <button onClick={onClose} className="absolute top-5 right-5">
            <X className="w-6 h-6 text-gray-600" onClick={onClose} />
          </button>
          <div className="flex flex-row gap-4">
            <img
              src={feedback.user.avatar}
              alt={feedback.user.name}
              width={48}
              height={48}
              className="rounded-full w-12 h-12"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-md font-semibold">{feedback.user.name}</h3>
              <p className="text-sm text-gray-600">{feedback.createdAt}</p>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <RatedStars rating={feedback.rating} />
            <p className="text-sm text-gray-600">{feedback.status_rating}</p>
          </div>
          <p className="text-md">{feedback.content}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailsModal;
