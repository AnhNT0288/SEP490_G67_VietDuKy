import { TourService } from "../../services/API/tour.service";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TourDescription({ id }) {
  const [tour, setTour] = useState(null);

  useEffect(() => {
    TourService.getTour(id)
      .then((response) => {
        setTour(response.data.data);
      })
      .catch((error) => console.error("Error fetching tour data:", error));
  }, [id]);

  if (!tour) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-lg text-gray-500 mb-4">
        Việt Du Ký / Du lịch Việt Du Ký /{" "}
        <span className="text-red-600 font-bold ">
          {tour.name_tour || "Không có tên tour"}{" "}
        </span>
      </nav>

      {/* Tiêu đề Tour */}
      <h1 className="text-4xl font-bold text-red-600 ">
        {tour.name_tour || "Không có tên tour"}{" "}
      </h1>
    </div>
  );
}
