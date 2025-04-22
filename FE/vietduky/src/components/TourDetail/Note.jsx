import { useState, useRef, useEffect } from "react";
import { TourInfoService } from "@/services/API/tour_info.service";

export default function Note({ id }) {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [contentMap, setContentMap] = useState({});
  const contactRef = useRef(null);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const res = await TourInfoService.getTourInfo(id);
        const data = res.data.data;

        // Tạo object chứa mô tả nội dung cho từng tab (nếu có nội dung)
        const newContentMap = {};
        const validTabs = [];

        data.forEach((item) => {
          const label = item.tab;
          const description = item.description?.trim(); // loại bỏ khoảng trắng đầu/cuối

          if (description) {
            newContentMap[label] = description;
            validTabs.push(label);
          }
        });

        setTabs(validTabs);
        setActiveTab(validTabs[0] || null);
        setContentMap(newContentMap);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin tab:", err);
      }
    };

    fetchTabs();
  }, [id]);

  return (
    <div className="relative mt-4 mx-auto bg-white rounded-lg shadow-lg p-4 text-sm border border-gray-300">
      <h2 className="text-2xl text-neutral-700 font-bold mb-4">
        Thông tin cần lưu ý
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-t-sm text-sm border border-b-0 ${
              activeTab === tab
                ? "bg-red-500 text-white border-red-500"
                : "text-neutral-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      {activeTab && (
        <div className="space-y-3 mt-2 p-2 text-gray-700 leading-relaxed whitespace-pre-line">
          {contentMap[activeTab]}
        </div>
      )}
    </div>
  );
}
