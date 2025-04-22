import Icons from "@/components/Icons/Icon";
import { FavouriteTourService } from "@/services/API/favourite_tour.service";
import { TourService } from "@/services/API/tour.service";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { useState, useEffect } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai"; // Import heart icons
import { useNavigate } from "react-router-dom";

export default function FavouriteTourCard({ favoriteTours, setFavoriteTours }) { // Nhận props ở đây
  const [tours, setTours] = useState([]);
  const [travelTours, setTravelTours] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const maxVisibleDates = 4;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursResponse = await TourService.getTours();
        setTours(toursResponse.data.data);
      } catch (error) {
        console.error("Error fetching tours data:", error);
      }
    };

    const fetchTravelTours = async () => {
      try {
        const travelToursResponse = await TravelTourService.getTravelTours();
        setTravelTours(travelToursResponse.data.data);
      } catch (error) {
        console.error("Error fetching travel tours data:", error);
      }
    };

    fetchTours();
    fetchTravelTours();
  }, []);

  const handleToggleFavorite = async (tourId) => {
    try {
      const data = {
        user_id: user.id,
        tour_id: tourId,
      };
      
      // Gọi API để xóa tour khỏi danh sách yêu thích
      await FavouriteTourService.remove(data);

      // Cập nhật lại danh sách favoriteTours
      setFavoriteTours((prevFavorites) => 
        prevFavorites.filter(favTour => favTour.tour_id !== tourId)
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const filteredTours = tours.filter(tour => favoriteTours.some(favTour => favTour.tour_id === tour.id));

  return (
    <div>
      {filteredTours.length > 0 ? (
        filteredTours.map((tour) => {
          const tourDates = travelTours
            .filter((tt) => tt.tour_id === tour.id)
            .map((tt) => new Date(tt.start_day).toLocaleDateString("vi-VN"));

          const handlePrevClick = () => {
            if (currentDateIndex > 0) {
              setCurrentDateIndex((prev) => Math.max(prev - 1, 0));
            }
          };

          const handleNextClick = () => {
            if (currentDateIndex < tourDates.length - maxVisibleDates) {
              setCurrentDateIndex((prev) =>
                Math.min(prev + 1, tourDates.length - maxVisibleDates)
              );
            }
          };

          const handleDateClick = (date) => {
            navigate(`/tour/${tour.id}`, { state: { selectedDate: date } });
          };

          return (
            <div
              key={tour.id}
              className="flex bg-white bg-opacity-40 mb-4 shadow-lg rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Hình ảnh Tour */}
              <div className="w-1/3 relative">
                <img
                  src={
                    tour.album?.[0] ||
                    "https://dummyimage.com/300x200/ddd/000&text=No+Image"
                  }
                  alt="Tour"
                  className="w-full h-full object-cover rounded-l-lg shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-red-800 text-white text-sm font-bold px-3 py-1 rounded">
                  {tour.typeTour ? tour.typeTour.name_type : "Không rõ"}
                </span>
                {/* Heart Icon for favorites */}
                <div className="absolute top-2 right-2">
                  {favoriteTours.some(favTour => favTour.tour_id === tour.id) ? (
                    <AiFillHeart
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleToggleFavorite(tour.id)}
                    />
                  ) : (
                    <AiOutlineHeart
                      className="text-gray-600 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* Nội dung Tour */}
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <h3
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-red-600"
                  onClick={() => navigate(`/tour/${tour.id}`)}
                >
                  {tour.name_tour}
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center text-neutral-900">
                    <img src={Icons.Coupon} className="mr-2" />
                    <span>Mã tour:</span>{" "}
                    <span className="font-semibold ml-2">
                      {tour.code_tour || "Không rõ"}
                    </span>
                  </div>
                  <div className="flex items-center text-neutral-900">
                    <img src={Icons.Location1} className="mr-2" />
                    <span>Khởi hành:</span>{" "}
                    <span className="text-red-800 font-semibold ml-2">
                      {tour.startLocation?.name_location || "Không rõ"}
                    </span>
                  </div>
                  <div className="flex items-center text-neutral-900">
                    <img src={Icons.Clock} className="mr-2" />
                    <span>Thời gian:</span>{" "}
                    <span className="font-semibold ml-2">
                      {tour.day_number} ngày {tour.day_number - 1} đêm
                    </span>
                  </div>
                  <div className="flex items-center text-neutral-900">
                    <span>Dịch vụ:</span>{" "}
                    <span className="text-red-800 font-semibold ml-2">
                      {tour.services?.length > 0
                        ? tour.services
                            .map((service) => service.name_service)
                            .join(", ")
                        : "Không rõ"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center text-neutral-900">
                    <img src={Icons.CalendarPre} className="mr-2" />
                    <span>Ngày khởi hành:</span>
                  </div>
                  <div className="flex space-x-2 items-center overflow-x-auto">
                    <AiOutlineArrowLeft
                      className="w-6 h-4 text-gray-600 cursor-pointer"
                      onClick={handlePrevClick}
                    />
                    {tourDates
                      .slice(
                        currentDateIndex,
                        currentDateIndex + maxVisibleDates
                      )
                      .map((date, index) => (
                        <span
                          key={index}
                          onClick={() => handleDateClick(date)}
                          className="px-2 py-1 border border-red-600 text-red-600 rounded text-xs cursor-pointer"
                        >
                          {date}
                        </span>
                      ))}
                    <AiOutlineArrowRight
                      className="w-6 h-4 text-gray-600 cursor-pointer"
                      onClick={handleNextClick}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-900">
                    Giá từ:
                    <p className="text-2xl text-red-800 font-bold">
                      {Number(tour.price_tour).toLocaleString("vi-VN")} VNĐ
                    </p>
                  </span>
                  <button
                    className="bg-[#A80F21] text-white text-sm py-2 px-4 rounded hover:bg-red-700"
                    onClick={() => navigate(`/tour/${tour.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>Không có tour yêu thích nào.</div>
      )}
    </div>
  );
}