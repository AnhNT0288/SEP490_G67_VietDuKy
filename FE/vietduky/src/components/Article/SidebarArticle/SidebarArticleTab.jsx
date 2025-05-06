import { formatDate } from "@/utils/dateUtil";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SidebarArticleTab = ({ popularPosts, latestPosts }) => {
  const [activeTab, setActiveTab] = useState("popular");
  const posts = activeTab === "popular" ? popularPosts : latestPosts;

  const navigate = useNavigate();

  const handleNavigate = (post) => {
    if (post.type === "article") {
      navigate(`/article/${post.directoryAlias}/${post.id}`);
    } else if (post.type === "post-experience") {
      navigate(`/article/post-experience/${post.id}`);
    }
  };

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
          <div
            key={index}
            onClick={() => handleNavigate(post)}
            className="flex gap-3 items-start cursor-pointer"
          >
            <img
              src={JSON.parse(post.album)}
              alt={post.title}
              className="w-14 h-14 object-cover rounded"
            />
            <div>
              <h4 className="text-sm font-medium leading-5 line-clamp-2">
                {post.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(post.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarArticleTab;
