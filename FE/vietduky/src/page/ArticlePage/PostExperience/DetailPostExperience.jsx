import SidebarArticle from "@/components/Article/SidebarArticle/SidebarArticle";
import LayoutArticle from "@/layouts/LayoutArticle";
import { PostExperienceService } from "@/services/API/post_experience.service";
import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";

const DetailPostExperience = () => {
  const { id } = useParams();
  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await PostExperienceService.getPostExperienceById(id);
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

  console.log("Article data:", articleData.description_post);

  return (
    <LayoutArticle sidebar={<SidebarArticle />}>
      <div className="prose max-w-none">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <NavLink to="/article" className="hover:underline">
            Bài viết
          </NavLink>{" "}
          &gt;{" "}
          <NavLink to="/article/post-experience" className="hover:underline">
            {" "}
            Bài viết chia sẻ
          </NavLink>{" "}
          &gt;{" "}
          <span className="text-gray-900 font-medium">
            {articleData.name_post}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">
          {articleData.name_post}
        </h1>

        {/* Metadata */}
        <div className="text-sm text-gray-500 flex items-center gap-3 mb-2">
          <span>{new Date(articleData.post_date).toLocaleString()}</span>
          <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition">
            Chia sẻ 7.6k
          </button>
        </div>

        {/* Sub heading */}
        <p className="italic text-lg font-medium text-zinc-900">
          {articleData.title_post}
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
          <div
            className="text-gray-800"
            dangerouslySetInnerHTML={{
              __html:
                articleData.description_post ||
                "Bài viết này chưa có nội dung.",
            }}
          ></div>
        </div>
      </div>
    </LayoutArticle>
  );
};

export default DetailPostExperience;
