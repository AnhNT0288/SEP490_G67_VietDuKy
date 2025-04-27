import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { DirectoryService } from "../../../services/API/directory.service";
import { ArticleService } from "@/services/API/article.service";
import LayoutArticle from "@/layouts/LayoutArticle";
import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";

const DynamicArticlePage = () => {
  const { alias } = useParams(); // Lấy alias từ URL
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [directory, setDirectory] = useState([]);

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const response = await DirectoryService.getAllDirectory();
        setDirectory(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thư mục:", error);
      }
    };

    fetchDirectory();
  }, []);

  // console.log("Directory data:", directory);

  useEffect(() => {
    const fetchArticle = async () => {
      const directoryItem = directory.find((item) => item.alias === alias);
      if (directoryItem) {
        try {
          const response = await ArticleService.getArticleByDirectoryId(
            directoryItem.id
          );
          if (response.data && response.data.data) {
            setArticles(response.data.data);
          } else {
            throw new Error("Không tìm thấy bài viết");
          }
        } catch (error) {
          console.error("Lỗi khi lấy bài viết:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Không tìm thấy thư mục tương ứng.");
        setLoading(false);
      }
    };

    if (directory.length > 0) {
      fetchArticle();
    }
  }, [alias, directory]);

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

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!articles) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  console.log("Articles data:", articles);

  return (
    <LayoutArticle sidebar={<SidebarArticle />}>
      <div className="space-y-6">
        {/* Hai bài viết kế tiếp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => {
            const album =
              typeof article.album_post === "string"
                ? JSON.parse(article.album_post)
                : article.album_post;
            const imageUrl = Array.isArray(album)
              ? album[0]
              : album || "/images/article-1.jpg";

            return (
              <div key={article.id} className="space-y-2">
                <img
                  src={imageUrl}
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
                  {/* Hiển thị số lượt xem */}
                </div>
                <p className="text-sm text-gray-600">
                  {article.article_title}
                </p>
                <button className="text-sm bg-blue-600 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700">
                  Chia sẻ
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </LayoutArticle>
  );
};

export default DynamicArticlePage;
