import { TourService } from "@/services/API/tour.service";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function TourProgram({ id }) {
  const [activities, setActivities] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    TourService.getTour(id)
      .then((response) => {
        const tourActivities = response.data.data.activities || [];
        setActivities(tourActivities);
      })
      .catch((error) => console.error("Error fetching tour data:", error));
  }, [id]);

  return (
    <div className="col-span-2 bg-white shadow-lg bg-opacity-20 p-4 rounded-lg mt-4 border border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-neutral-700 font-bold">
          Chương trình tour
        </h2>
        <button className="text-neutral-700 font-medium">Xem tất cả</button>
      </div>
      <div className="space-y-2">
        {activities.length > 0 ? (
          activities.map((item, index) => (
            <div
              key={item.id}
              className="flex bg-white-100 rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <img
                src={item.image}
                alt="Tour Image"
                className="w-40 h-24 object-cover"
              />
              <div className="flex-1 p-3 gap-2 flex flex-col">
                <p className="text-gray-500 text-sm">{item.title}</p>
                <p className="font-semibold text-gray-800">{item.description}</p>
                {openIndex === index && (
                  <p className="text-sm text-gray-600">{item.detail}</p>
                )}
              </div>
              <button
                className="p-2"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Chưa có thông tin lịch trình.</p>
        )}
      </div>
    </div>
  );
}
