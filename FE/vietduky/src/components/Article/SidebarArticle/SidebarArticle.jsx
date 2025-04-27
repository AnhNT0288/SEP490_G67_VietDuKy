import { useEffect, useState } from "react";
import SidebarArticleTab from "./SidebarArticleTab";
import { ArticleService } from "@/services/API/article.service";
import { PostExperienceService } from "@/services/API/post_experience.service";

const SidebarArticle = ({ setSearchTerm }) => {
  const [mockPopularPosts, setMockPopularPosts] = useState([]);
  const [mockLatestPosts, setMockLatestPosts] = useState([]);

  useEffect(() => {
    const fetchArticlesAndPosts = async () => {
      try {
        const [articlesResponse, postExperiencesResponse] = await Promise.all([
          ArticleService.getAllArticles(),
          PostExperienceService.getAllPostExperience()
        ]);

        const articles = articlesResponse.data.data.map(item => ({
          id: item.id,
          title: item.article_name,
          date: item.article_date,
          views: item.views,
          album: item.album_post,
          type: "article",
          alias: item.alias,
          directoryAlias: item.directory?.alias || "blog",
        }));

        const postExperiences = postExperiencesResponse.data.data.map(item => ({
          id: item.id,
          title: item.title_post,
          date: item.post_date,
          views: item.views,
          album: item.postEx_album,
          type: "post-experience",
          alias: item.alias || "post-experience",
          directoryAlias: "post-experience",
        }));

        const combinedPosts = [...articles, ...postExperiences];

        // Top bài view cao nhất
        const popular = [...combinedPosts]
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // Top bài mới nhất
        const latest = [...combinedPosts]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setMockPopularPosts(popular);
        setMockLatestPosts(latest);

      } catch (error) {
        console.error("Error fetching articles and posts:", error);
      }
    };

    fetchArticlesAndPosts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Tìm kiếm */}
      <div>
        <h3 className="font-semibold mb-2">Tìm bài viết</h3>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Bài viết nổi bật */}
      <div>
        <SidebarArticleTab 
          popularPosts={mockPopularPosts} 
          latestPosts={mockLatestPosts} 
        />
      </div>
    </div>
  );
};

export default SidebarArticle;
