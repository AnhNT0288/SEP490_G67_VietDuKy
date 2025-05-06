import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import {
  deleteArticle,
  getAllArticles,
  getArticleById,
} from "../../services/API/article.service.js";
import ModalAddArticle from "../../components/ModalManage/ModalAdd/ModalAddArticle.jsx";
import DropdowArticle from "../../components/Dropdown/DropdowArticle.jsx";
import { toast } from "react-toastify";
import ModalViewArticle from "../../components/ModalManage/ModalList/ModalViewArticle.jsx";
import ModalUpdateArticle from "../../components/ModalManage/ModalUpdate/ModalUpdateArticle.jsx";

export default function ManagementArticle() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 12;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const fetchPosts = async () => {
    try {
      const res = await getAllArticles();
      if (res?.data) {
        const mappedPosts = res.data.map((item) => ({
          id: item.id,
          fullData: item, // lưu cả object luôn để view
          category: item.directory?.name_directory || "Không rõ",
          title: item.article_name,
          slug: item.alias,
          featured: item.true_featured === 1,
          status: item.true_active === 1 ? "Hoạt động" : "Khóa",
        }));
        setPosts(mappedPosts);
      }
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách bài viết:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((post) => post.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectPost = (postId) => {
    const updatedSelectedPosts = selectedPosts.includes(postId)
      ? selectedPosts.filter((id) => id !== postId)
      : [...selectedPosts, postId];

    setSelectedPosts(updatedSelectedPosts);
    setSelectAll(updatedSelectedPosts.length === posts.length);
  };

  const handleDeleteArticle = async (postId) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await deleteArticle(postId);
        await fetchPosts();
        setOpenDropdown(null);
        toast.success("Đã xoá bài viết thành công!");
      } catch (error) {
        console.error("❌ Lỗi xoá bài viết:", error);
        toast.error("Xoá bài viết thất bại!");
      }
    }
  };

  const handleDeleteMultipleArticles = async () => {
    if (selectedPosts.length === 0) return;

    if (
      confirm(`Bạn có chắc chắn muốn xóa ${selectedPosts.length} bài viết?`)
    ) {
      try {
        // Xoá lần lượt từng bài
        for (const postId of selectedPosts) {
          await deleteArticle(postId);
        }

        await fetchPosts(); // reload lại danh sách
        setSelectedPosts([]); // reset chọn
        setSelectAll(false);
        setOpenDropdown(null);
        toast.success(`Đã xoá ${selectedPosts.length} bài viết thành công!`);
      } catch (error) {
        console.error("❌ Lỗi xoá nhiều bài viết:", error);
        toast.error("Xoá bài viết thất bại!");
      }
    }
  };

  const handleViewArticle = async (postId) => {
    try {
      const res = await getArticleById(postId);
      setSelectedArticle(res.data); // res.data là 1 bài viết
      setShowModalView(true);
    } catch (error) {
      console.error("❌ Lỗi xem bài viết:", error);
    }
  };

  const handleEditArticle = async (postId) => {
    try {
      const res = await getArticleById(postId);
      setSelectedArticle(res.data);
      setShowModalEdit(true);
    } catch (error) {
      console.error("❌ Lỗi lấy bài viết để sửa:", error);
    }
  };

  return (
    <div title="Quản lý Bài Viết">
      <div className="p-4 bg-white rounded-md">
        {/* Search & Action Buttons */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm bằng từ khóa"
              className="pl-10 pr-4 py-2 border rounded-md w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {selectedPosts.length > 0 && (
            <button
              className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
              onClick={handleDeleteMultipleArticles}
            >
              Xóa bài viết
            </button>
          )}

          <button
            className="bg-red-700 text-white px-4 py-2 rounded-md"
            onClick={() => setShowModalAdd(true)}
          >
            Thêm bài viết
          </button>
        </div>

        {/* Posts Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-700 border-b">
              <th className="p-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="accent-red-700"
                />
              </th>
              <th className="p-2">STT</th>
              <th className="p-2">Danh mục</th>
              <th className="p-2">Tên bài viết</th>
              <th className="p-2">Đường dẫn</th>
              <th className="p-2">Bài nổi bật</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post, index) => (
              <tr key={post.id} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="accent-red-700"
                  />
                </td>
                <td className="p-2">{indexOfFirstPost + index + 1}</td>
                <td className="p-2">{post.category}</td>
                <td className="p-2">{post.title}</td>
                <td className="p-2 truncate max-w-xs">{post.slug}</td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={post.featured}
                    readOnly
                    className="accent-red-700"
                  />
                </td>
                <td
                  className={`p-2 ${
                    post.status === "Hoạt động"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {post.status}
                </td>
                <td className="p-2 text-right">
                  <DropdowArticle
                    postId={post.id}
                    isOpen={openDropdown === post.id}
                    setOpenDropdown={(id) => setOpenDropdown(id)}
                    onViewArticle={() => handleViewArticle(post.id)}
                    onEditArticle={() => handleEditArticle(post.id)}
                    onDeleteArticle={() => handleDeleteArticle(post.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 border rounded ${
                  page === currentPage
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {showModalAdd && (
        <ModalAddArticle
          onClose={() => setShowModalAdd(false)}
          onCreated={fetchPosts}
        />
      )}
      {showModalView && selectedArticle && (
        <ModalViewArticle
          article={selectedArticle}
          onClose={() => setShowModalView(false)}
        />
      )}
      {showModalEdit && selectedArticle && (
        <ModalUpdateArticle
          article={selectedArticle}
          onClose={() => {
            setShowModalEdit(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}
