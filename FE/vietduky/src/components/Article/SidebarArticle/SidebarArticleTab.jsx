import { useState } from "react";

const mockPopularPosts = [
  {
    title: "Du lịch Vũng Tàu: Cẩm nang từ A đến Z (Update thôn...",
    date: "12/03/2025",
    thumbnail: "/images/vungtau.jpg",
  },
  {
    title: "Du lịch đảo Nam Du: Cẩm nang từ A đến Z (Update th...",
    date: "29/11/2024",
    thumbnail: "/images/namdu.jpg",
  },
  {
    title: "Du lịch Đà Lạt - Cẩm nang từ A đến Z (Update thông...",
    date: "29/11/2024",
    thumbnail: "/images/dalat.jpg",
  },
  {
    title: "Du lịch Phú Quốc: Cẩm nang từ A đến Z (update th...",
    date: "29/11/2024",
    thumbnail: "/images/phuquoc.jpg",
  },
  {
    title: "Du lịch Phan Thiết: Cẩm nang từ A đến Z (update th...",
    date: "29/11/2024",
    thumbnail: "/images/phanthiet.jpg",
  },
];

const mockLatestPosts = [
  // Tùy bạn cập nhật thêm nếu có danh sách "Bài mới"
  ...mockPopularPosts.reverse(),
];

const SidebarArticleTab = () => {
  const [activeTab, setActiveTab] = useState("popular");
  const posts = activeTab === "popular" ? mockPopularPosts : mockLatestPosts;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-semibold text-sm ${
            activeTab === "popular"
              ? "bg-red-700 text-white"
              : "text-gray-700 hover:text-red-700"
          }`}
          onClick={() => setActiveTab("popular")}
        >
          Đọc nhiều
        </button>
        <button
          className={`px-4 py-2 font-semibold text-sm ${
            activeTab === "latest"
              ? "bg-red-700 text-white"
              : "text-gray-700 hover:text-red-700"
          }`}
          onClick={() => setActiveTab("latest")}
        >
          Bài mới
        </button>
      </div>

      {/* Post list */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={index} className="flex gap-3 items-start">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-14 h-14 object-cover rounded"
            />
            <div>
              <h4 className="text-sm font-medium leading-5 line-clamp-2">
                {post.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{post.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarArticleTab;
