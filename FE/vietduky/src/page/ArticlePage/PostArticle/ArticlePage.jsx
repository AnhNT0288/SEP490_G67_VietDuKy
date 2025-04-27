import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";
import LayoutArticle from "@/layouts/LayoutArticle";
import { ArticleService } from "@/services/API/article.service";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ArticlePage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [highlightArticle, setHighlightArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await ArticleService.getAllArticles();
        const allArticles = response.data.data;

        // 1. Lọc bài viết active
        const activeArticles = allArticles.filter(article => article.true_active === 1);

        // 2. Lọc bài featured
        const featuredArticles = activeArticles
          .filter(article => article.true_featured === 1)
          .sort((a, b) => new Date(b.article_date) - new Date(a.article_date)); // 🎯 Mới nhất trước

        if (featuredArticles.length > 0) {
          const selectedArticle = featuredArticles[0]; // 🎯 lấy bài mới nhất
          setHighlightArticle(selectedArticle);

          // 3. Các bài còn lại (không trùng bài featured)
          const remainingArticles = activeArticles.filter(article => article.id !== selectedArticle.id);
          setArticles(remainingArticles);
        } else {
          setArticles(activeArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleIncrementViewCount = async (id) => {
    try {
      await ArticleService.incrementViews(id);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleArticleClick = (id) => {
    handleIncrementViewCount(id);
  };

  const getFirstImage = (album_post) => {
    try {
      const album = JSON.parse(album_post);
      return Array.isArray(album) && album.length > 0
        ? album[0]
        : "/images/default.jpg";
    } catch (error) {
      return "/images/default.jpg";
    }
  };

  const filteredArticles = articles.filter(article =>
    article.article_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LayoutArticle sidebar={<SidebarArticle setSearchTerm={setSearchTerm} />}>
      <div className="space-y-6">
        {/* Bài viết nổi bật */}
        {highlightArticle && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">
              <NavLink
                to={`/article/${highlightArticle?.directory?.alias}/${highlightArticle.id}`}
                className="hover:text-red-500"
              >
                {highlightArticle.article_name}
              </NavLink>
            </h2>
            <div className="flex flex-col lg:flex-row gap-4 border-b pb-6">
              <img
                onClick={() =>
                  navigate(`/article/${highlightArticle?.directory?.alias}/${highlightArticle.id}`)
                }
                src={getFirstImage(highlightArticle.album_post)}
                alt="Highlight Article"
                className="w-full h-64 lg:w-1/3 rounded object-cover cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-lg italic text-gray-700 mb-4">
                  {highlightArticle.article_title}
                </p>
                <button
                  onClick={() =>
                    navigate(`/article/${highlightArticle?.directory?.alias}/${highlightArticle.id}`)
                  }
                  className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  XEM THÊM...
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Các bài viết còn lại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="space-y-2">
              <img
                onClick={() =>
                  navigate(`/article/${article?.directory?.alias}/${article.id}`)
                }
                src={getFirstImage(article.album_post)}
                alt="Article"
                className="w-full h-64 rounded object-cover cursor-pointer"
              />
              <h3 className="font-semibold text-base">
                <NavLink
                  to={`/article/${article?.directory?.alias}/${article.id}`}
                  onClick={() => handleArticleClick(article.id)}
                  className="hover:text-blue-500"
                >
                  {article.article_name}
                </NavLink>
              </h3>
              <div className="text-xs text-gray-500">
                {new Date(article.article_date).toLocaleDateString()} &nbsp;|&nbsp; {article.views} lượt xem
              </div>
              <p className="text-sm text-gray-600">{article.article_title}</p>
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

export default ArticlePage;
