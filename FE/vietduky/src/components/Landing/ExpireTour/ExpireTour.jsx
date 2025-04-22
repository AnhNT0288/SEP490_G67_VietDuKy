import { useNavigate } from "react-router-dom";
import ExpireTourCard from "./ExpireTourCard";

const tours = [
  {
    id: 1,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    originalPrice: "9.900.000 VNĐ",
    discountPrice: "5.900.000 VNĐ",
  },
  {
    id: 2,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    originalPrice: "9.900.000 VNĐ",
    discountPrice: "5.900.000 VNĐ",
  },
  {
    id: 3,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    originalPrice: "9.900.000 VNĐ",
    discountPrice: "5.900.000 VNĐ",
  },
  {
    id: 4,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    originalPrice: "9.900.000 VNĐ",
    discountPrice: "5.900.000 VNĐ",
  },
  {
    id: 5,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    originalPrice: "9.900.000 VNĐ",
    discountPrice: "5.900.000 VNĐ",
  },
  {
    id: 6,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    originalPrice: "9.900.000 VNĐ",
    discountPrice: "5.900.000 VNĐ",
  },
];
export default function ExpireTour() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="py-10 sm:w-full md:w-full lg:w-4/5 mx-auto relative p-2 md:p-4 lg:p-6">
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-[#A80F21]">Ưu đãi phút chót</p>
          <p className="text-zinc-900 mt-2">
            Hãy nhanh tay nắm bắt cơ hội giảm giá cuối cùng.
          </p>
          <div className="w-1/5 h-1 bg-red-800 rounded-sm mt-2" />
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-center mt-6 mx-auto">
          {tours.map((tour) => (
            <div className="box-border cursor-pointer" key={tour.id}>
              <ExpireTourCard {...tour} />
            </div>
          ))}
        </div>
        <div className="text-center mt-9">
          <button onClick={() => navigate("/listTour")} className="bg-white border border-red-500 text-red-500 px-10 py-3 font-semibold rounded-md hover:bg-red-500 hover:text-white transition duration-300">
            Xem thêm Tours
          </button>
        </div>
      </div>
    </div>
  );
}
