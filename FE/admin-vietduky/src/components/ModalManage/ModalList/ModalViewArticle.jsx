import React from "react";

export default function ModalViewArticle({ article, onClose }) {
  if (!article) return null;

  const album = article.album_post ? JSON.parse(article.album_post) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-6xl relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold">Chi tiết bài viết</h2>
        <p className="text-sm text-gray-500 mb-4">Quản trị viên xem bài viết</p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-4">
          <p className="text-sm text-zinc-800 mb-4">
            ID bài viết: {article.id}
          </p>
          <p className="text-sm text-zinc-800 mb-4">
          Ngày cập nhật: {new Date(article.article_date).toLocaleDateString("vi-VI")}
          </p>
          <p className="text-sm text-zinc-800 mb-4">
            Trạng thái: {article.true_active ? "Hoạt động" : "Không hoạt động"}
          </p>
          <p className="text-sm text-zinc-800 mb-4">
            Nổi bật: {article.true_featured ? "Có" : "Không"}
          </p>
          <p className="text-sm text-zinc-800 mb-4">
            Danh mục: {article.directory?.name_directory || "Chưa có danh mục"}
          </p>
        </div>

        {/* Tên bài viết */}
        <h3 className="text-xl font-semibold mb-2 text-red-700">
          Tên bài viết
        </h3>
        <h2 className="text-2xl font-bold mb-4">{article.article_name}</h2>

        {/* Hình ảnh album */}
        <h3 className="text-xl font-semibold mb-2 text-red-700">Album ảnh</h3>
        <div className="flex gap-2 mb-4">
          {album.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="Album"
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>

        {/* Nội dung chi tiết */}
        <h3 className="text-xl font-semibold mb-2 text-red-700">
          Tiêu đề bài viết
        </h3>
        <p className="text-lg text-gray-700 mb-4">{article.article_title}</p>
        <h3 className="text-xl font-semibold mb-2 text-red-700">
          Nội dung bài viết
        </h3>
        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: article.description }}
        ></div>
      </div>
    </div>
  );
}
