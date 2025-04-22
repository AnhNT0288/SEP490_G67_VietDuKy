import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";
import LayoutArticle from "@/layouts/LayoutArticle";
import { ArticleService } from "@/services/API/article.service";
import { PostExperienceService } from "@/services/API/post_experience.service";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await ArticleService.getAllArticles(); 
        setArticles(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  console.log("Articles data:", articles);

  return (
    <LayoutArticle sidebar={<SidebarArticle />}>
      <div className="space-y-6">
        {/* Bài viết nổi bật đầu tiên */}
        {articles.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-4 border-b pb-6">
            <img
              src={articles[0].postEx_album ? JSON.parse(articles[0].postEx_album)[0] : "/images/article-highlight.jpg"}
              alt="Article thumbnail"
              className="w-full lg:w-1/3 rounded object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">
                Việt Du Ký &gt; Blog &gt; Muôn màu
              </p>
              <h2 className="text-xl font-semibold mb-2">
                <NavLink to={`/article/${articles[0].id}`} className="hover:text-red-500">
                  {articles[0].title_post}
                </NavLink>
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                {articles[0].description_post}
              </p>
              <button className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition">
                XEM THÊM...
              </button>
            </div>
          </div>
        )}

        {/* Hai bài viết kế tiếp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.slice(1, 3).map((article) => (
            <div key={article.id} className="space-y-2">
              <img
                src={article.postEx_album ? JSON.parse(article.postEx_album)[0] : "/images/article-1.jpg"}
                alt="Article"
                className="w-full rounded object-cover"
              />
              <h3 className="font-semibold text-base">
                <NavLink to={`/article/${article.id}`} className="hover:text-blue-500">
                  {article.title_post}
                </NavLink>
              </h3>
              <div className="text-xs text-gray-500">
                {new Date(article.post_date).toLocaleDateString()} &nbsp;|&nbsp; 1944 views
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

export default ArticlePage;