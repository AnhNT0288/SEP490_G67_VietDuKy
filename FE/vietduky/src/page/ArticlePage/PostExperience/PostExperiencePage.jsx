import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";
import LayoutArticle from "@/layouts/LayoutArticle";
import { PostExperienceService } from "@/services/API/post_experience.service";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const PostExperiencePage = () => {
  const navigate = useNavigate();
  const [postExperiences, setPostExperiences] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔥 thêm biến searchTerm

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
    handleIncrementViewCount(id);
  };

  const handleShare = (article) => {
    const articleUrl = `${window.location.origin}/article/post-experience/${article.id}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
  };

  const filteredArticles = postExperiences.filter(article =>
    article.title_post.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LayoutArticle sidebar={<SidebarArticle setSearchTerm={setSearchTerm} />}>
      <div className="space-y-6">
        {/* Các bài viết trải nghiệm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
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
                {new Date(article.post_date).toLocaleDateString()} &nbsp;|&nbsp; {article.views} lượt xem
              </div>
              <p className="text-sm text-gray-600">{article.title_post}</p>
              <button
                onClick={() => handleShare(article)}
                className="text-sm bg-blue-600 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700"
              >
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
