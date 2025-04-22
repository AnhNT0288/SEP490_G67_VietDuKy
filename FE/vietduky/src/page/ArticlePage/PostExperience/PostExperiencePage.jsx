import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";
import LayoutArticle from "@/layouts/LayoutArticle";
import { PostExperienceService } from "@/services/API/post_experience.service";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const PostExperiencePage = () => {
  const [postExperiences, setPostExperiences] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await PostExperienceService.getAllPostExperience();
        setPostExperiences(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleIncrementViewCount = async (id) => {
    try {
      await PostExperienceService.incrementViews(id);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleArticleClick = (id) => {
    handleIncrementViewCount(id); // Tăng lượt xem khi nhấp vào bài viết
  };

  console.log("Articles data:", postExperiences);

  return (
    <LayoutArticle sidebar={<SidebarArticle />}>
      <div className="space-y-6">
        {/* Bài viết nổi bật đầu tiên */}
        {postExperiences.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-4 border-b pb-6">
            <img
              src={postExperiences[0].postEx_album ? JSON.parse(postExperiences[0].postEx_album)[0] : "/images/article-highlight.jpg"}
              alt="Article thumbnail"
              className="w-full lg:w-1/3 rounded object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">
                Việt Du Ký &gt; Blog &gt; Muôn màu
              </p>
              <h2 className="text-xl font-semibold mb-2">
                <NavLink 
                  to={`/article/post-experience/${postExperiences[0].id}`} 
                  className="hover:text-red-500"
                  onClick={() => handleArticleClick(postExperiences[0].id)}
                >
                  {postExperiences[0].title_post}
                </NavLink>
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                {postExperiences[0].description_post}
              </p>
              <div className="text-xs text-gray-500 mb-2">
                {postExperiences[0].views} lượt xem {/* Hiển thị số lượt xem */}
              </div>
              <button className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition">
                XEM THÊM...
              </button>
            </div>
          </div>
        )}

        {/* Hai bài viết kế tiếp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {postExperiences.map((article) => (
            <div key={article.id} className="space-y-2">
              <img
                src={article.postEx_album ? JSON.parse(article.postEx_album)[0] : "/images/article-1.jpg"}
                alt="Article"
                className="w-full rounded object-cover"
              />
              <h3 className="font-semibold text-base">
                <NavLink 
                  to={`/article/post-experience/${article.id}`} 
                  className="hover:text-blue-500"
                  onClick={() => handleArticleClick(article.id)}
                >
                  {article.title_post}
                </NavLink>
              </h3>
              <div className="text-xs text-gray-500">
                {new Date(article.post_date).toLocaleDateString()} &nbsp;|&nbsp; {article.views} lượt xem {/* Hiển thị số lượt xem */}
              </div>
              <p className="text-sm text-gray-600">
                {article.description_post}
              </p>
              <button className="text-sm bg-blue-600 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700">
                Chia sẻ
              </button>
            </div>
          ))}
        </div>
      </div>
    </LayoutArticle>
  );
};

export default PostExperiencePage;