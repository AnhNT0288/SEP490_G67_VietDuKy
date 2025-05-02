import { TourService } from "@/services/API/tour.service";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function TourProgram({ id }) {
  const [activities, setActivities] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    TourService.getTour(id)
      .then((response) => {
        const tourActivities = response.data.data.tourActivities || [];
        setActivities(tourActivities);
      })
      .catch((error) => console.error("Error fetching tour data:", error));
  }, [id]);

  const handleToggleViewAll = () => {
    setViewAll(!viewAll);
    setOpenIndex(null);
  };

  const handleToggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="col-span-2 bg-white shadow-lg bg-opacity-20 p-4 rounded-lg mt-4 border border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-neutral-700 font-bold">
          Chương trình tour
        </h2>
        <button
          onClick={handleToggleViewAll}
          className="text-neutral-700 font-medium hover:underline"
        >
          {viewAll ? "Thu gọn" : "Xem tất cả"}
        </button>
      </div>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((item, index) => {
            const isOpen = viewAll || openIndex === index;

            return (
              <div
                key={item.id}
                onClick={() => handleToggleItem(index)}
                className="flex flex-col bg-white rounded-lg border shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300 ease-in-out"
              >
                {/* Phần trên: ảnh + title + description + nút */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Ảnh */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "w-0" : "w-32"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt="Tour"
                        className="h-24 object-cover w-full rounded-l-md"
                      />
                    </div>

                    {/* Thông tin chính */}
                    <div className="flex-1 relative">
                      <p className="absolute -top-6 text-gray-500 text-sm">
                        {item.title}
                      </p>
                      <p className="font-semibold text-gray-800">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Nút toggle */}
                  <button
                    onClick={() => handleToggleItem(index)}
                    className="p-2"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Detail chỉ hiển thị khi mở */}
                {isOpen && (
                  <div
                    className="px-4 pb-4 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: item.detail || "Chưa có mô tả.",
                    }}
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Chưa có thông tin lịch trình.</p>
        )}
      </div>
    </div>
  );
}
