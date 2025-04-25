import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import HeaderCard from "@/components/ListTour/HeaderCard";
import SearchBar from "@/components/ListTour/SearchBar";
import TourFilter from "@/components/ListTour/TourFilter";
import TourCard from "@/components/TourCard/TourCard";
import { FavouriteTourService } from "@/services/API/favourite_tour.service";
import { LocationService } from "@/services/API/location.service";
import { TopicService } from "@/services/API/topic.service";
import { TourService } from "@/services/API/tour.service";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { TypeTourService } from "@/services/API/type_tour.service";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function ListTour() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  const [tours, setTours] = useState([]);
  const [travelTours, setTravelTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tourTypes, setTourTypes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [favoriteTours, setFavoriteTours] = useState([]);
  const [message, setMessage] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const countTours = tours.length;

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

    const fetchLocations = async () => {
      try {
        const locationsResponse = await LocationService.getAllLocations();
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error("Error fetching locations data:", error);
      }
    };

    const fetchTourTypes = async () => {
      try {
        const tourTypesResponse = await TypeTourService.getTypeTour();
        setTourTypes(tourTypesResponse.data);
      } catch (error) {
        console.error("Error fetching tour types data:", error);
      }
    };

    const fetchTopics = async () => {
      try {
        const topicsResponse = await TopicService.getTopic();
        setTopics(topicsResponse.data.data);
      } catch (error) {
        console.error("Error fetching topics data:", error);
      }
    };

    const fetchFavoriteTours = async () => {
      if (user) {
        try {
          const response = await FavouriteTourService.getFavouriteTourByUserID(
            user.id
          );
          setFavoriteTours(response.data.data);
        } catch (error) {
          console.error("Error fetching favorite tours:", error);
        }
      }
    };

    fetchTours();
    fetchTravelTours();
    fetchLocations();
    fetchTourTypes();
    fetchTopics();
    fetchFavoriteTours();
  }, [userId]);

  const handleFilter = async (filterParams) => {
    const hasFilters = Object.values(filterParams).some(
      (param) => param !== "" && param !== "Tất cả"
    );
  
    if (!hasFilters) {
      setFilteredTours([]);
      setIsFiltering(false);
      setMessage("");
      return;
    }
  
    try {
      const res = await TourService.searchTour(filterParams);
      if (res.status === 200) {
        const toursData = res.data.data.tours;
        setFilteredTours(toursData);
        setIsFiltering(true);
        setMessage(
          toursData.length === 0
            ? "Chúng tôi không tìm thấy tour nào cho bạn !"
            : ""
        );
      }
    } catch (err) {
      console.error("Lỗi khi tìm kiếm tour:", err);
      setMessage("Chúng tôi không tìm thấy tour nào cho bạn !");
    }
  };
  

  const activeTopics = topics.filter((topic) => topic.active === true);

  const handleSearchHeader = (destination, departure, date) => {
    handleFilter({
      destination,
      departure,
      date,
      type: "Tất cả",
      topic: "Tất cả",
    });
  };

  const validTravelTours = travelTours.filter((tour) => {
    const startDate = new Date(tour.start_day);
    const now = new Date();
    
    // Chỉ lấy tour có ngày khởi hành hôm nay hoặc sau hôm nay
    return startDate >= new Date(now.setHours(0, 0, 0, 0));
  });

  console.log("filteredTours", filteredTours);
  // console.log("tours", tours);
  // console.log("travelTours", travelTours);
  // console.log("locations", locations);
  // console.log("tourTypes", tourTypes);
  // console.log("topics", topics);
  // console.log("favoriteTours", favoriteTours);

  return (
    <div className="bg-white">
      {/* Header */}
      <Header />
      {/* Header Card */}
      <div className="relative">
        <HeaderCard onSearch={handleSearchHeader} />
      </div>
      {/* Nội dung chính */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:gap-6">
          <button
            className="md:hidden text-xl text-gray-700 flex items-center gap-4 bg-white rounded-lg px-4 py-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaBars />
            <span>Bộ lọc tìm kiếm</span>
          </button>

          {/* Bộ lọc bên trái */}
          <div
            className={`${
              isFilterOpen ? "block" : "hidden"
            } md:block w-full md:w-1/4 bg-white rounded-lg p-6`}
          >
            <h2 className="text-lg font-bold bg-transparent text-gray-900 pt-2 pb-6 hidden md:block">
              Bộ lọc tìm kiếm
            </h2>
            <TourFilter
              locations={locations}
              typeTours={tourTypes}
              activeTopics={topics}
              onFilter={handleFilter}
              initialDeparture={location.state?.departure || "Tất cả"}
              initialDate={location.state?.date || ""}
              initialDestination={location.state?.destination || ""}
            />
          </div>
          {/* Danh sách Tour */}
          <div className="w-full md:w-3/4">
            {/* Ô tìm kiếm */}
            <div>
              <SearchBar
                tours={tours}
                travelTours={travelTours}
                filteredTours={filteredTours}
                isFiltering={isFiltering}
              />
            </div>
            {/* Danh sách Tour */}
            <div className="mt-4 space-y-4">
              {message && (
                <div className="text-red-500 font-semibold text-2xl">
                  {message}
                </div>
              )}{" "}
              {!message && (
                <TourCard
                  tours={filteredTours.length > 0 ? filteredTours : tours}
                  travelTours={validTravelTours}
                  favoriteTours={favoriteTours}
                  setFavoriteTours={setFavoriteTours}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
