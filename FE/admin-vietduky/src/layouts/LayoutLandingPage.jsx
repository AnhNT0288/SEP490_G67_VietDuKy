import Header from "../components/Header/Header";
import SearchTour from "../components/SearchTour/SearchTour";
import Footer from "../components/Footer/Footer";
import PromotionalProgram from "../components/Landing/Promotional Program.jsx";
import FeaturedTour from "../components/Landing/FeaturedTour.jsx";
import LocationVN from "../components/Landing/LocationVN.jsx";

export default function LayoutLandingPage() {
  return (
      <div className="bg-white" style={{backgroundImage: "url('/Image/Background.png')", backgroundSize: "cover", backgroundPosition: "center", width: "100%", minHeight: "100vh",}}>

        {/* Header */}
        <Header/>

        <SearchTour />

        {/* Gói quà chào mừng cho người dùng! */}
        <div className="p-6 relative w-4/5 mx-auto">
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

        {/* Tour trong nước nổi bật */}
        <FeaturedTour/>

        {/* Khám phá địa điểm vui chơi ở Việt Nam */}
        <LocationVN/>
        <Footer/>
    </div>
  );
}
