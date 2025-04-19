import { TourService } from "@/services/API/tour.service";
import { useEffect, useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import { FaShare } from "react-icons/fa6";

export default function ExperienceOnTour({ id }) {
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
    <div className="col-span-2 bg-white shadow-lg bg-opacity-20 p-4 rounded-lg mt-4 border border-gray-300">
      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-700">
          Trải nghiệm thú vị trong tour
        </h1>
        <div className="flex gap-2">
          {/* <button className="bg-[#1877F2] text-white px-3 py-1.5 rounded-md shadow-md flex gap-1 items-center text-sm font-medium hover:bg-[#1877F2]/80">
            <BiSolidLike /> Like
          </button>
          <button className="bg-[#1877F2] text-white px-3 py-1.5 rounded-md shadow-md flex gap-1 items-center text-sm font-medium hover:bg-[#1877F2]/80">
            <FaShare /> Share
          </button> */}
        </div>
      </div>
      <div className="space-y-3 text-gray-700">
        <div className="flex flex-col gap-4 mb-4"
          dangerouslySetInnerHTML={{
            __html: tour.activity_description || "Chưa có mô tả.",
          }}
        />
      </div>
    </div>
  );
}
