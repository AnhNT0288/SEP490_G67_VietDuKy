import { useEffect, useState } from "react";
import { sendRequestTour } from "../../services/API/guide-tour.service";
import { TravelGuideService } from "../../services/API/travel_guide.service";

const ConfirmSendRequest = ({ tourId, open, onClose }) => {
  const [travelGuides, setTravelGuides] = useState([]);
  const [travelGuideId, setTravelGuideId] = useState(null); 

  useEffect(() => {
    const fetchTravelGuides = async () => {
      try {
        const response = await TravelGuideService.getAllTravelGuide();
        if (response.status === 200) {
          setTravelGuides(response.data.data);
        } else {
          console.error("Error fetching travel guides:", response.message);
        }
      } catch (error) {
        console.error("Error fetching travel guides:", error);
      }
    };
    fetchTravelGuides();
  }, []);

  // Lấy userId từ localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    // Lọc danh sách để tìm travelGuideId có userId tương ứng
    const matchedGuide = travelGuides.find(guide => guide.user_id === userId);
    if (matchedGuide) {
      setTravelGuideId(matchedGuide.id);
    }
  }, [travelGuides, userId]);

  const handleSendRequest = async (tourId) => {
    try {
      const response = await sendRequestTour({
        travel_tour_id: tourId,
        travel_guide_id: travelGuideId,
      });
      if (response.status === 201) {
        alert("Gửi yêu cầu thành công");
      } else {
        console.log(response.data);
        alert(response.message);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert(error.message);
    } finally {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg  max-w-lg">
        <h2 className="text-xl font-bold mb-2">
          Bạn có hoàn toàn chắc chắn không?
        </h2>
        <p>
          Không thể hoàn tác hành động này. Yêu cầu nhận lịch khởi hành này sẽ
          được chuyển tới Quản Trị Viên xem xét yêu cầu.
        </p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-[#D32F44] text-white px-4 py-2 rounded-md mr-2"
            onClick={() => handleSendRequest(tourId)}
          >
            Xác nhận
          </button>
          <button
            className="border border-gray-400 text-black px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSendRequest;
