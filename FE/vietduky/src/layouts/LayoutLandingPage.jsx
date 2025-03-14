import Header from "../components/Header/Header";
import SearchTour from "../components/SearchTour/SearchTour";
import Footer from "../components/Footer/Footer";
import PromotionalProgram from "../components/Landing/PromotionalProgram.jsx";
import FeaturedTour from "../components/Landing/FeaturedTour.jsx";
import LocationVN from "../components/Landing/LocationVN.jsx";
import ExpireTour from "../components/Landing/ExpireTour.jsx";
import TopicTour from "../components/Landing/TopicTour.jsx";
import VacationTour from "../components/Landing/VacationTour.jsx";

export default function LayoutLandingPage() {
  return (
      <div className="bg-white" style={{backgroundImage: "url('/Image/Background.png')", backgroundSize: "cover", backgroundPosition: "center", width: "100%", minHeight: "100vh",}}>

        {/* Header */}
        <Header/>

        <SearchTour />

        {/* Gói quà chào mừng cho người dùng! */}
        <div className="p-6 relative w-4/5 mx-auto">
            <img src="/Image/poster.jpeg.svg" alt="Khuyến mãi" width={1000} height={200} className="rounded-lg pointer-events-none w-full pb-8 pt-8"/>

            <div className="flex justify-between items-center ">
            <h2 className="text-xl font-bold">
            🎁 Gói quà chào mừng cho người dùng!
          </h2>
        </div>
            <div className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab">
          <img src="/Image/Qua chao mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none"/>
          <img src="/Image/Qua chao mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none"/>
          <img src="/Image/Qua chao mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none"/>
          <img src="/Image/Qua chao mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none"/>
        </div>
      </div>

        {/* Chương trình khuyến mại */}
            <PromotionalProgram/>

        {/* Chương trình khuyến mại */}
            <ExpireTour/>

        {/*Topic Tour*/}
            <TopicTour/>

        {/*Vacation Tour*/}
            <VacationTour/>

        {/* Tour trong nước nổi bật */}
            <FeaturedTour/>

        {/* Khám phá địa điểm vui chơi ở Việt Nam */}
            <LocationVN/>
        <Footer/>
    </div>
  );
}
