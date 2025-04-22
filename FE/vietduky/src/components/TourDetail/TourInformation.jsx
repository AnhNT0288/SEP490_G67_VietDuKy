import Icons from "../Icons/Icon";
import { ServiceService } from "@/services/API/service.service";
import { TourService } from "@/services/API/tour.service";
import { useEffect, useState } from "react";

export default function TourInformation({ id }) {
  const [tour, setTour] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    TourService.getTour(id)
      .then((response) => {
        const tourData = response.data.data;
        setTour(tourData);

        // Lấy danh sách dịch vụ
        if (tourData?.services) {
          setServices(tourData.services);
        }
      })
      .catch((error) => console.error("Error fetching tour data:", error));
  }, [id]);

  if (!tour) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="col-span-2 bg-white shadow-lg bg-opacity-20 p-4 rounded-lg mt-4 border border-gray-300">
      <div className="flex justify-between text-gray-700">
        <div className="flex items-center gap-2">
          <img src={Icons.LocationThin} alt="Địa điểm" />
          <span>Khởi hành từ:</span>{" "}
          <span className="text-[#A80F21] text-xl font-bold">
            {tour?.startLocation?.name_location || "Không xác định"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Mã Tour:</span>{" "}
          <span className="text-[#A80F21] font-bold text-xl">
            {tour?.code_tour || "Chưa có mã"}
          </span>
        </div>
      </div>
      <h2 className="text-neutral-700 text-2xl font-bold my-6">
        Tour Trọn Gói bao gồm:{" "}
      </h2>
      <div className="text-gray-700 grid grid-cols-3 gap-4 mb-4">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <img src={Icons.IconChecklistRed} />
                {service.name_service}
              </div>
            </div>
          ))
        ) : (
          <li>Không có dịch vụ</li>
        )}
      </div>
    </div>
  );
}
