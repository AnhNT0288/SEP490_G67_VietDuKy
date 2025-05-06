import { TourService } from "@/services/API/tour.service";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopicTourCard from "./TopicTourCard";
import { FavouriteTourService } from "@/services/API/favourite_tour.service";
import ModalLogin from "@/components/ModalLogin/ModalLogin";

export default function TopicTour({ topic }) {
  const [tours, setTours] = useState([]);
  const [favoriteTours, setFavoriteTours] = useState([]);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await TourService.getTourByTopicId(topic.id);
        setTours(response.data.data.tours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    const fetchFavoriteTours = async () => {
      try {
        const response = await FavouriteTourService.getFavouriteTourByUserID(userId);
        setFavoriteTours(response.data.data);
      } catch (error) {
        console.error("Error fetching favorite tours:", error);
      }
    }

    fetchFavoriteTours();
    fetchTours();
  }, [topic.id, userId]);

  console.log("topic", tours);
  // console.log("favoriteTours", favoriteTours);
  
  return (
    <div className="bg-transparent">
      <div className="py-10 md:w-full lg:w-4/5 sm:w-full mx-auto relative p-6 ">
        <div className="flex flex-col">
          <p className="text-3xl font-bold">
            {topic.name}
          </p>
          <p className="text-zinc-900 mt-2">
            {topic.description}
          </p>
          <div className="w-1/5 h-1 bg-red-800 rounded-sm mt-2" />
        </div>

        <div className="flex flex-wrap justify-between gap-12 mt-6 mx-auto topic-tour-list">
          {tours?.slice(0, 6).map((tour) => (
            <div
              key={tour.id}
              className="relative box-border"
              onClick={() => navigate(`/tour/${tour.id}`)}
            >
              <TopicTourCard {...tour} userId={userId} favoriteTours={favoriteTours} setFavoriteTours={setFavoriteTours} openLoginModal={() => setShowLoginModal(true)} />
            </div>
          ))}
        </div>
        {showLoginModal && (
          <ModalLogin />
        )}
        {/* Nút xem thêm */}
        <div className="text-center mt-6">
          <button
            className="border border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
            onClick={() => navigate("/listTour")}
          >
            Xem thêm Tours
          </button>
        </div>
      </div>
    </div>
  );
}
