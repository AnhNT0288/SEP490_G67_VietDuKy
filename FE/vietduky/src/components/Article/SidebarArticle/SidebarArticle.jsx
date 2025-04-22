import SidebarArticleTab from "./SidebarArticleTab";

const SidebarArticle = () => {
  return (
    <div className="space-y-6">
      {/* Tìm kiếm */}
      <div>
        <h3 className="font-semibold mb-2">Tìm bài viết</h3>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Bài viết nổi bật */}
      <div>
        <SidebarArticleTab />
      </div>
    </div>
  );
};

export default SidebarArticle;
