import { FeedbackService } from "@/services/API/feedback.service";
import { LikeService } from "@/services/API/like.service";
import { useEffect, useState, useMemo } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Feedback({ id }) {
  const userId = useMemo(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser?.id || null;
  }, []);
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  const [feedbacks, setFeedbacks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const filters = ["Tất cả", "Chỉ có hình ảnh", "4.0", "3.0", "2.0", "1.0"];
  const [likePosts, setLikePosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await FeedbackService.getFeedbackByTourId(id);
        const feedbackData = response.data.data;
        if (Array.isArray(feedbackData)) {
          // Thiết lập số lượt thích mặc định cho mỗi feedback (có thể gọi API ở đây nếu cần)
          const updatedFeedbacks = await Promise.all(
            feedbackData.map(async (fb) => {
              const likeResponse = await LikeService.totalLikeFeedback(
                fb.feedback_id
              );
              return {
                ...fb,
                totalLikes: likeResponse.data.count,
                likes: likeResponse.data.userIds || [],
              }; // Cập nhật số lượt thích
            })
          );
          setFeedbacks(updatedFeedbacks);
        } else {
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [id]);

  // const filteredFeedbacks = useMemo(() => {
  //   switch (selectedFilter) {
  //     case "Chỉ có hình ảnh":
  //       return feedbacks.filter(
  //         (fb) =>
  //           fb.feedback_album.length > 0 &&
  //           (!fb.description_feedback || fb.description_feedback.trim() === "")
  //       );
  //     case "4.0+":
  //       return feedbacks.filter((fb) => fb.rating === 4);
  //     case "3.0+":
  //       return feedbacks.filter((fb) => fb.rating === 3);
  //     case "2.0+":
  //       return feedbacks.filter((fb) => fb.rating === 2);
  //     case "1.0+":
  //       return feedbacks.filter((fb) => fb.rating === 1);
  //     default:
  //       return feedbacks;
  //   }
  // }, [feedbacks, selectedFilter]);

  const filteredFeedbacks = useMemo(() => {
    if (selectedFilter === "Tất cả") {
      return feedbacks;
    }

    if (selectedFilter === "Chỉ có hình ảnh") {
      return feedbacks.filter(
        (fb) =>
          fb.feedback_album.length > 0 &&
          (!fb.description_feedback || fb.description_feedback.trim() === "")
      );
    }

    // Nếu filter là rating (1.0, 2.0, v.v)
    const ratingFilter = parseFloat(selectedFilter);
    if (!isNaN(ratingFilter)) {
      return feedbacks.filter((fb) => fb.rating === ratingFilter);
    }

    return feedbacks;
  }, [feedbacks, selectedFilter]);

  const visibleFeedbacks = filteredFeedbacks.slice(0, visibleCount);

  // const totalRating = filteredFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
  // const averageRating =
  //   filteredFeedbacks.length > 0
  //     ? (totalRating / filteredFeedbacks.length).toFixed(1)
  //     : 0;

  const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
  const averageRating =
    feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : 0;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const getRecommendationText = (rating) => {
    switch (rating) {
      case 5:
        return "Rất khuyến khích";
      case 4:
        return "Khuyến khích";
      case 3:
        return "Trung bình";
      case 2:
        return "Không khuyến khích";
      case 1:
        return "Rất không khuyến khích";
      default:
        return "";
    }
  };

  //   const ratingColors = {
  //     5: "text-green-600",
  //     4: "text-blue-500",
  //     3: "text-yellow-500",
  //     2: "text-orange-500",
  //     1: "text-red-500",
  //   };

  const getRelativeDateText = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays || 1} ngày trước`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} tuần trước`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  const handleToggleLike = async (feedbackId) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    if (!userId) return toast.error("Bạn cần đăng nhập để thích");

    try {
      // Toggle like status
      await LikeService.toggleLikePost({
        user_id: userId,
        target_id: feedbackId,
        target_type: "feedback",
      });

      // Gọi hàm để lấy số lượt like
      const response = await LikeService.totalLikeFeedback(feedbackId);
      const totalLikes = response.data.count; // Giả sử API trả về { data: { count: số lượt like } }

      // Cập nhật trạng thái liked posts
      setLikePosts((prev) =>
        prev.includes(feedbackId)
          ? prev.filter((id) => id !== feedbackId)
          : [...prev, feedbackId]
      );

      // Cập nhật số lượt thích cho feedback trong hàm fetchFeedbacks
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((fb) =>
          fb.feedback_id === feedbackId
            ? {
                ...fb,
                totalLikes,
                likes: fb.likes?.includes(userId)
                  ? fb.likes.filter((uid) => uid !== userId)
                  : [...(fb.likes || []), userId],
              }
            : fb
        )
      );
    } catch (error) {
      console.error("Lỗi khi like bài viết:", error);
    }
  };

  return (
    <div className="mx-auto mt-8 p-4 border rounded-lg bg-transparent">
      {/* Header đánh giá */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-2xl font-bold">{averageRating}</span>
        <span className="text-yellow-400 text-xl">
          {"★".repeat(Math.round(averageRating)).padEnd(5, "☆")}
        </span>
        <span className="text-gray-600 text-sm">
          Dựa trên {feedbacks.length} đánh giá
        </span>
        <a
          href="/article/post-experience"
          className="text-blue-600 text-sm ml-auto"
        >
          Đọc Blog Trải nghiệm
        </a>
      </div>

      {/* Bộ lọc */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setSelectedFilter(filter);
              setVisibleCount(10);
            }}
            className={`px-3 py-1 border rounded-full text-sm ${
              selectedFilter === filter
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Nội dung đánh giá */}
      <div className="mt-6 space-y-6">
        {visibleFeedbacks.length > 0 ? (
          visibleFeedbacks.map((fb) => {
            console.log(fb.totalLikes);

            return (
              <div
                key={fb.feedback_id}
                style={{
                  boxShadow: "inset 0 2px 8px rgba(99, 102, 241, 0.2)",
                }}
                className="flex gap-3 p-4 rounded-lg inset-shadow-sm inset-shadow-indigo-500/50"
              >
                <img
                  src={
                    fb.user?.avatar ||
                    "https://i.pravatar.cc/40?u=" + fb.user?.id
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold">{fb.user?.displayName}</p>
                  <p className="text-gray-500 text-sm">
                    {getRelativeDateText(fb.feedback_date)}
                  </p>

                  <div className="flex items-center mb-2">
                    <div className="text-yellow-400 text-lg">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i}>{i <= fb.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium 
                    }`}
                    >
                      {getRecommendationText(fb.rating)}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm">
                    {fb.description_feedback}
                  </p>

                  {/* Ảnh đính kèm nếu có */}
                  {fb.feedback_album &&
                    (() => {
                      let album = [];
                      try {
                        album = JSON.parse(fb.feedback_album); // Parse từ chuỗi thành array
                      } catch (error) {
                        album = []; // Nếu lỗi (không phải JSON) thì để rỗng
                      }

                      return Array.isArray(album) && album.length > 0 ? (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {album.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Feedback Image ${idx}`}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          ))}
                        </div>
                      ) : null;
                    })()}

                  <div className="mt-3 text-gray-600 text-sm">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <span
                        onClick={() => handleToggleLike(fb.feedback_id)}
                        className={`text-lg ${
                          likePosts.includes(fb.feedback_id)
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        <AiOutlineLike />
                      </span>
                      <span>
                        {fb.likes?.includes(userId)
                          ? fb.totalLikes > 1
                            ? `Bạn và ${
                                fb.totalLikes - 1
                              } người khác thấy điều này hữu ích`
                            : `Bạn thấy điều này hữu ích`
                          : `${fb.totalLikes} người thấy điều này hữu ích`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">Chưa có đánh giá.</p>
        )}
      </div>

      {/* Xem thêm */}
      {visibleCount < filteredFeedbacks.length && (
        <div className="text-center mt-6">
          <button
            className="text-red-500 font-medium hover:underline"
            onClick={handleShowMore}
          >
            Xem thêm đánh giá
          </button>
        </div>
      )}
    </div>
  );
}
