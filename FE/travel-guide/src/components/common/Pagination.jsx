const Pagination = ({ pagination, onPageChange, totalPages }) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange({ ...pagination, page });
  };

  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-500">
        Trang {pagination.page} trên tổng {totalPages} trang
      </p>
      <div className="flex items-center gap-2">
        <button
          className="bg-gray-200 px-4 py-2 rounded-md"
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Trước
        </button>
        <button
          className="bg-gray-200 px-4 py-2 rounded-md"
          disabled={pagination.page === totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default Pagination;
