import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";
import LayoutArticle from "@/layouts/LayoutArticle";
import { PostExperienceService } from "@/services/API/post_experience.service";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const PostExperiencePage = () => {
  const navigate = useNavigate();
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
        {/* Hai bài viết kế tiếp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {postExperiences.map((article) => (
            <div key={article.id} className="space-y-2">
              <img
                src={
                  article.postEx_album
                    ? JSON.parse(article.postEx_album)[0]
                    : "/images/article-1.jpg"
                }
                onClick={() => navigate(`/article/post-experience/${article.id}`)}
                alt="Article"
                className="w-full h-64 rounded object-cover cursor-pointer"
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
                {new Date(article.post_date).toLocaleDateString()} &nbsp;|&nbsp;{" "}
                {article.views} lượt xem {/* Hiển thị số lượt xem */}
              </div>
              <p
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{
                  __html:
                    article.description_post ||
                    "Bài viết này chưa có nội dung.",
                }}
              >
                {/* {article.description_post} */}
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
