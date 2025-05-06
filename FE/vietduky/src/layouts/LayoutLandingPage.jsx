import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import ExpireTour from "../components/Landing/ExpireTour/ExpireTour.jsx";
import FeaturedTour from "../components/Landing/FeaturedTour.jsx";
import LocationVN from "../components/Landing/LocationVN.jsx";
import TopicTour from "../components/Landing/TopicTour/TopicTour.jsx";
import VacationTour from "../components/Landing/VacationTour.jsx";
import SearchTour from "../components/SearchTour/SearchTour";
import FavouriteTour from "@/components/Landing/FavouriteTour/FavouriteTour";
import PreferentialTour from "@/components/Landing/PreferentialTour/PreferentialTour";
import PromotionSection from "@/components/Landing/PromotionSection";
import TopTours from "@/components/Landing/TopTour/TopTour";
import { TopicService } from "@/services/API/topic.service";
import { TourService } from "@/services/API/tour.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; // Import the slider component
import "slick-carousel/slick/slick.css"; // Import slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import slick theme CSS
import { FaArrowAltCircleUp } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoMdArrowDropup } from "react-icons/io";
import ChatBot from "@/components/ChatBot/ChatBot";

export default function LayoutLandingPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await TopicService.getTopic();
        setTopics(response.data.data);
      } catch (error) {
        console.error("Error fetching topic:", error);
      }
    };
    fetchTopic();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <Header />

      <div className="relative">
        <SearchTour />
      </div>

      {/* Image Slider */}
      <div className="p-6 relative sm:w-full md:w-full lg:w-4/5 mx-auto h-[400px]  slider-wrapper">
        <Slider {...settings}>
          <div>
            <img
              src="/Image/bn1.jpg"
              alt="Khuyến mãi 1"
              className="rounded-lg pointer-events-none w-full h-[350px]"
            />
          </div>
          <div>
            <img
              src="/Image/bn2.png"
              alt="Khuyến mãi 2"
              className="rounded-lg pointer-events-none w-full h-[350px]"
            />
          </div>
          <div>
            <img
              src="/Image/bn3.jpg"
              alt="Khuyến mãi 3"
              className="rounded-lg pointer-events-none w-full h-[350px]"
            />
          </div>
        </Slider>
      </div>

      {/* Tour nổi bật */}
      {/* <TopTours /> */}

      {/* Chương trình khuyến mại */}
      {/* <PromotionSection /> */}

      {/* Tour ưu đãi đặc biệt */}
      {/* <PreferentialTour /> */}

      {/* Chương trình khuyến mại */}
      <ExpireTour />

      {/* Tour du lịch được yêu thích nhất */}
      {/* <FavouriteTour /> */}

      {/* Topic Tour */}
      {topics.map(
        (topic, index) =>
          topic.active && (
            <div
              key={topic.id}
              className={`${index % 2 === 0 ? "bg-[#FEEEC759]" : "bg-white"}`}
            >
              <TopicTour topic={topic} />
            </div>
          )
      )}

      {/* Khám phá địa điểm vui chơi ở Việt Nam */}
      <LocationVN />

      {/* Footer */}
      <Footer />
      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-all duration-300 z-50"
        >
          <IoMdArrowDropup className="w-9 h-9 text-white hover:text-red-800" />
        </button>
      )}
      {/* <ChatBot /> */}
    </div>
  );
}
