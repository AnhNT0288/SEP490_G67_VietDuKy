import { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import Layout from "../../layouts/LayoutManagement.jsx";
import { getAllArticles } from "../../services/API/article.service.js";
import DropdownMenuTopic from "../../components/Dropdown/DropdowArticle.jsx";
import ModalAddArticle from "../../components/ModalManage/ModalAdd/ModalAddArticle.jsx";

export default function ManagementPost() {
    const [searchTerm, setSearchTerm] = useState("");
    const [posts, setPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 12;
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // 🔁 Đưa fetchPosts ra ngoài để tái sử dụng
    const fetchPosts = async () => {
        try {
            const res = await getAllArticles();
            if (res?.data) {
                const mappedPosts = res.data.map((item) => ({
                    id: item.id,
                    category: item.directory?.name_directory || "Không rõ",
                    title: item.alias,
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

    const handleDeletePosts = () => {
        if (selectedPosts.length === 0) return;
        setPosts(posts.filter((post) => !selectedPosts.includes(post.id)));
        setSelectedPosts([]);
        setSelectAll(false);
    };

    return (
        <Layout title="Quản lý Bài Viết">
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
                            onClick={handleDeletePosts}
                        >
                            Xóa bài viết
                        </button>
                    )}

                    <button
                        className="bg-red-700 text-white px-4 py-2 rounded-md"
                        onClick={() => setShowModal(true)}
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
                            <td className={`p-2 ${post.status === "Hoạt động" ? "text-green-600" : "text-red-600"}`}>
                                {post.status}
                            </td>
                            <td className="p-2 text-right">
                                <DropdownMenuTopic
                                    postId={post.id}
                                    isOpen={openDropdown === post.id}
                                    setOpenDropdown={(id) => setOpenDropdown(id)}
                                    onDeleteArticle={() => console.log("Xoá bài viết:", post.id)}
                                    onEditArticle={() => console.log("Sửa bài viết:", post.id)}
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
                                    page === currentPage ? "bg-red-600 text-white" : "bg-white text-gray-700"
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}

            </div>

            {showModal && (
                <ModalAddArticle
                    onClose={() => setShowModal(false)}
                    onCreated={fetchPosts}
                />
            )}
        </Layout>
    );
}
