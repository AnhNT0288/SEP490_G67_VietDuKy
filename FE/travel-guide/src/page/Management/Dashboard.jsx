import { useEffect, useState } from "react";
import CalendarTravelTour from "../../components/sn-travel-guide-tour/CalendarTravelTour";
import StaticSection from "../../components/sn-dashboard/StaticSection";
import LayoutManagement from "../../layouts/LayoutManagement";
import { getGuideTourByUserId } from "../../services/API/guide-tour.service";
import Feedback from "../../components/sn-dashboard/Feedback";
import {getFeedbacksByGuideId} from "../../services/API/feedback.service.js";

const Dashboard = () => {
  const [travelTours, setTravelTours] = useState([]);
  const [userId, setUserId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const extractedUserId = user?.id;
    if (!extractedUserId) return;
    setUserId(extractedUserId);

    const fetchData = async () => {
      try {
        const [toursRes, feedbackRes] = await Promise.all([
          getGuideTourByUserId(extractedUserId),
          getFeedbacksByGuideId(extractedUserId),
        ]);

        if (toursRes.data) setTravelTours(toursRes.data.items);
        if (feedbackRes.data) setFeedbacks(feedbackRes.data);
      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
      }
    };

    fetchData();

    return () => {
      setTravelTours([]);
      setFeedbacks([]);
    };
  }, []);
  return (
      <LayoutManagement>
        <div className="h-full w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
          {userId && <StaticSection guideId={userId} />}
          <div className="w-full flex flex-col gap-3">
            <h3 className="text-xl sm:text-2xl font-bold">Thống kê chi tiết</h3>
            <CalendarTravelTour travelTours={travelTours} />
          </div>
          <Feedback feedbacks={feedbacks} />
        </div>
      </LayoutManagement>
  );
};

export default Dashboard;
