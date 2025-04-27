import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";
import LayoutArticle from "@/layouts/LayoutArticle";
import { ArticleService } from "@/services/API/article.service";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ArticlePage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [highlightArticle, setHighlightArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await ArticleService.getAllArticles();
        const allArticles = response.data.data;

        if (allArticles.length > 0) {
          const randomIndex = Math.floor(Math.random() * allArticles.length);
          const selectedArticle = allArticles[randomIndex];

          setHighlightArticle(selectedArticle);

          // Bỏ bài viết đã chọn ra khỏi danh sách
          const remainingArticles = allArticles.filter(
            (article) => article.id !== selectedArticle.id
          );
          setArticles(remainingArticles);
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
    handleIncrementViewCount(id); // Tăng lượt xem khi nhấp vào bài viết
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

  console.log("Articles data:", articles);

  return (
    <LayoutArticle sidebar={<SidebarArticle />}>
      {/* <p className="text-sm text-gray-500 mb-2">
                Việt Du Ký &gt; Blog &gt; Muôn màu
              </p> */}
      <div className="space-y-6">
        {/* Bài viết nổi bật (lấy ngẫu nhiên) */}
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
                  navigate(
                    `/article/${highlightArticle?.directory?.alias}/${highlightArticle.id}`
                  )
                }
                src={getFirstImage(highlightArticle.album_post)}
                alt="Highlight Article"
                className="w-full lg:w-1/3 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-lg italic text-gray-700 mb-4">
                  {highlightArticle.article_title}
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/article/${highlightArticle?.directory?.alias}/${highlightArticle.id}`
                    )
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
          {articles.map((article) => (
            <div key={article.id} className="space-y-2">
              <img
                onClick={() =>
                  navigate(
                    `/article/${article?.directory?.alias}/${article.id}`
                  )
                }
                src={getFirstImage(article.album_post)}
                alt="Article"
                className="w-full rounded object-cover"
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
                {new Date(article.article_date).toLocaleDateString()}{" "}
                &nbsp;|&nbsp; {article.views} lượt xem{" "}
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
