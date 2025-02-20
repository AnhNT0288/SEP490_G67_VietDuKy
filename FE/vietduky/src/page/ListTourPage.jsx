import Header from "../../src/components/Header/Header";
import Footer from "../../src/components/Footer/Footer";
import RatingSection from "../../src/components/RatingSection/RatingSection";
import SearchTour from "../../src/components/SearchTour/SearchTour";
import TourCard from "../../src/components/TourCard/TourCard";
import SearchButton from "../components/SearchButton/SearchButton";

export default function ListTour() {
  return (
      <div className="bg-white" style={{backgroundImage: "url('/Image/Background.png')", backgroundSize: "cover", backgroundPosition: "center", width: "100%", minHeight: "100vh",}}>

        {/* Header */}
        <Header/>

        {/* Thanh tìm kiếm */}
        <SearchTour />
        <SearchButton />

        {/* Nội dung chính */}
        <div className="container mx-auto px-4 py-6">
        {/* Đánh giá + mô tả */}
        <RatingSection />

        {/* Bộ lọc tìm kiếm */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Bộ lọc bên trái */}
          <div className="bg-red-500 text-white p-4 rounded-lg w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-3">
              Bạn muốn khởi hành từ đâu?
            </h3>
            <div className="space-y-2">
              <button className="w-full bg-white text-red-600 p-2 rounded-lg">
                ...Hồ Chí Minh
              </button>
              <button className="w-full bg-white text-red-600 p-2 rounded-lg">
                ...Hà Nội
              </button>
              <button className="w-full bg-white text-red-600 p-2 rounded-lg">
                ...Cần Thơ
              </button>
            </div>
          </div>

          {/* Danh sách Tour */}
          <div className="w-full md:w-3/4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Du lịch Hà Nội - Danh sách Tour du lịch Hà Nội - Tour Hà Nội
            </h2>

            {/* Tabs */}
            <div className="flex space-x-3 border-b pb-2 text-sm text-gray-700">
              <button className="text-red-500 border-b-2 border-red-500 pb-2">
                Sắp xếp: Ngày Khởi Hành
              </button>
              <button className="hover:text-red-500">Theo Giá</button>
              <button className="hover:text-red-500">Theo Thời Gian</button>
              <button className="hover:text-red-500">Theo Sao</button>
              <button className="hover:text-red-500">Tour Phổ Biến</button>
            </div>

            {/* Danh sách Tour */}
            <div className="mt-4 space-y-4">
              <TourCard />
              <TourCard />
            </div>

            {/* Nút Xem thêm */}
            <div className="text-center mt-6">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
                XEM NHIỀU HƠN
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Footer */}
        <Footer/>
    </div>
  );
}
