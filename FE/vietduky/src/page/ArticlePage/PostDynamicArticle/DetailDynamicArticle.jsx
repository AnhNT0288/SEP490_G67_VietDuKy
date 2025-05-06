import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";
import LayoutArticle from "@/layouts/LayoutArticle";
import { ArticleService } from "@/services/API/article.service";
import { PostExperienceService } from "@/services/API/post_experience.service";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetailDynamicArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await ArticleService.getArticleById(id);
        setArticleData(response.data.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  if (!articleData) {
    return <div>Loading...</div>;
  }

  console.log("Article data:", articleData);

  return (
    <LayoutArticle sidebar={<SidebarArticle />}>
      <div className="prose max-w-none">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-2 cursor-pointer">
          <span className="hover:underline">Bài viết</span> &gt;{" "}
          <span
            className="hover:underline"
            onClick={() =>
              navigate(`/article/${articleData?.directory?.alias}`)
            }
          >
            {articleData?.directory?.name_directory}
          </span>{" "}
          &gt;{" "}
          <span className="text-gray-900 font-medium hover:underline">
            {articleData?.article_name}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {articleData.article_name}
        </h1>

        {/* Metadata */}
        <div className="text-sm text-gray-500 flex items-center gap-3 mb-2">
          <span>{new Date(articleData.article_date).toLocaleString()}</span>
          <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition">
            Chia sẻ 7.6k
          </button>
        </div>

        {/* Sub heading */}
        <p className="italic text-lg font-medium text-zinc-900">
          {articleData?.article_title}
        </p>

        {/* Tag */}
        <div className="my-4">
          <span className="font-semibold">Xem thêm:</span>{" "}
          <a href="#" className="text-blue-600 hover:underline">
            {articleData.category || "Mẹo du lịch"}
          </a>
        </div>

        {/* Nội dung bài viết */}
        <div className="space-y-4">
          <p
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{
              __html:
                articleData.description || "Bài viết này chưa có nội dung.",
            }}
          ></p>
        </div>
      </div>
    </LayoutArticle>
  );
};

export default DetailDynamicArticle;
