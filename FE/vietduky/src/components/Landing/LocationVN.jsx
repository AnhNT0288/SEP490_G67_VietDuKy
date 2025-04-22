import { LocationService } from "@/services/API/location.service";
import { useState, useEffect } from "react";

export default function LocationVN() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await LocationService.getAllLocations();
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Hàm để trộn mảng
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Lấy ngẫu nhiên 5 địa điểm
  const randomLocations = shuffleArray([...locations]).slice(0, 5);

  return (
    <div className="bg-[rgba(254,238,199,0.35)]">
      <div className="py-10 md:w-full lg:w-4/5 sm:w-full mx-auto relative p-6 ">
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-neutral-700">
            Các điểm du lịch phổ biến
          </p>
          <p className="text-gray-500 text-base mt-2">
            Bao La Thế Giới Bốn Bể Là Nhà
          </p>
          <div className="w-1/5 h-1 bg-[#A80F21] rounded-sm mt-2" />
        </div>

        <div className="grid grid-cols-2 sm:grid-rows-2 sm:grid-cols-3 md:grid-rows-2 md:grid-cols-3 lg:grid-cols-3 md:gap-6 gap-2 mt-6">
        {randomLocations.map((place, index) => {
            // Tạo số lượng hành trình ngẫu nhiên cho mỗi địa điểm
            const randomTrips = Math.floor(Math.random() * 50) + 1;

            return (
              <div
                key={index}
                className={`relative group overflow-hidden cursor-pointer ${
                  index === 0 ? "row-span-2" : ""
                }`}
              >
                <img
                  src={place.image}
                  alt={place.name_location}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4">
                  <h3 className="text-white text-3xl font-semibold">
                    {place.name_location}
                  </h3>
                  {/* <p className="text-white text-base">{randomTrips} Hành Trình</p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
