import { TourService } from "@/services/API/tour.service.js";
import Footer from "../components/Footer/Footer.jsx";
import Header from "../components/Header/Header.jsx";
import DepartureSchedule from "../components/TourDetail/DepartureSchedule.jsx";
import ExperienceOnTour from "../components/TourDetail/ExperienceOnTour.jsx";
import Feedback from "../components/TourDetail/Feedback.jsx";
import Note from "../components/TourDetail/Note.jsx";
import RelatedTours from "../components/TourDetail/RelatedTour/RelatedTours.jsx";
import TourDescription from "../components/TourDetail/TourDescription.jsx";
import TourImage from "../components/TourDetail/TourImage.jsx";
import TourInformation from "../components/TourDetail/TourInformation.jsx";
import TourProgram from "../components/TourDetail/TourProgram.jsx";
import Calendar from "@/components/Calendar/Calendar.jsx";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function DetailTourPage() {
  const { id } = useParams();
  const location = useLocation();
  const discountList = location.state?.discountList || [];
  const initialSelectedDate = location.state?.selectedDate;
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await TourService.getTour(id);
        setTours(response.data.data);
      } catch (error) {
        console.error("Error fetching tours data:", error);
      }
    };

    fetchTours();
  }, [id]);

  // console.log("Tours", tours);
  console.log("Initial Selected Date", initialSelectedDate);
  

  return (
    <div className="bg-white">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <TourDescription id={id} />
        {/* Thông tin Tour */}
        <div className="grid grid-cols-11 gap-6 mt-6">
          <div className=" col-span-7">
            {/*Ảnh Tour*/}
            <TourImage id={id} />

            {/*Thông tin dịch vụ trong Tour*/}
            <TourInformation id={id} />

            {/*Trải nghiệm trong Tour*/}
            <ExperienceOnTour id={id} />

            {/*Chương trình Tour*/}
            <TourProgram id={id} />

            {/* lịch khởi hành và giá */}
            <DepartureSchedule
              id={id}
              initialSelectedDate={initialSelectedDate}
            />

            {/*Những thông tin cần lưu ý*/}
            <Note id={id} />
          </div>

          {/* Bảng giá và Lịch trình */}
          <div className="col-span-4">
            <Calendar id={id} initialSelectedDate={initialSelectedDate} discountList={discountList} />
          </div>
        </div>

        {/*Feedback*/}
        <Feedback id={id} />
        {/*Tour liên quan */}
        <RelatedTours relatedTours={tours.related_tours} id={id} />
      </div>
      <Footer />
    </div>
  );
}
