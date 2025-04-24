import ModalAddSharePost from "./ModalAddSharePost";
import ModalEditSharePost from "./ModalEditSharePost";
import Icons from "@/components/Icons/Icon";
import { FeedbackService } from "@/services/API/feedback.service";
import { PostExperienceService } from "@/services/API/post_experience.service";
import { formatDate } from "@/utils/dateUtil";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { FiEdit2, FiExternalLink } from "react-icons/fi";

const statusMap = {
  pending: { text: "Đang chờ duyệt bài", color: "text-blue-500" },
  approved: { text: "Bài đã được duyệt", color: "text-green-600" },
  locked: { text: "Bài đã bị khóa", color: "text-red-600" },
};

export default function ReviewTour() {
  const [activeTab, setActiveTab] = useState("review");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await FeedbackService.getFeedbackByUserId(user?.id);
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await PostExperienceService.getPostExperienceByUserId(
          user?.id
        );
        setSharedPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
    fetchReviews();
  }, [user?.id]);

  // console.log("Shared Posts:", sharedPosts);

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

  const ratingColors = {
    5: "text-green-600",
    4: "text-blue-500",
    3: "text-yellow-500",
    2: "text-orange-500",
    1: "text-red-500",
  };

  // console.log("Reviews:", reviews);

  return (
    <div className=" mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách đánh giá</h2>
        {activeTab === "shared" && (
          <button
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg"
            onClick={() => setShowAddModal(true)}
          >
            Thêm bài viết đánh giá
          </button>
        )}
      </div>

      <ModalAddSharePost
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          className={`pb-2 px-4 font-medium ${
            activeTab === "review"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("review")}
        >
          Nhận xét
        </button>
        <button
          className={`pb-2 px-4 font-medium ${
            activeTab === "shared"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("shared")}
        >
          Bài viết chia sẻ
        </button>
      </div>

      {activeTab === "review" &&
        reviews.map((review) => {
          const feedbackDate = new Date(review.feedback_date);
          const currentDate = new Date();

          // Tính số mili giây đã qua
          const differenceInTime = currentDate - feedbackDate;

          // Tính số ngày và giờ
          const differenceInDays = Math.floor(
            differenceInTime / (1000 * 3600 * 24)
          );
          const differenceInHours = Math.floor(
            (differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600)
          );

          let timeAgo;
          if (differenceInDays > 0) {
            timeAgo = `${differenceInDays} days ago`;
          } else {
            timeAgo = `${differenceInHours} hours ago`;
          }

          //     const feedbackDate = new Date(review.feedback_date);
          //   const currentDate = new Date();

          //   // Tính số ngày đã qua
          //   const differenceInTime = currentDate - feedbackDate;
          //   const differenceInDays = Math.floor(
          //     differenceInTime / (1000 * 3600 * 24)
          //   );
          return (
            <div
              key={review.feedback_id}
              className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200"
            >
              <h3 className="text-lg font-bold text-red-600 mb-2">
                {review?.tour?.name_tour}
              </h3>

              <div className="flex items-center mb-2">
                <img
                  src={review?.user?.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="text-sm">
                  <p className="font-semibold">{review?.user?.displayName}</p>
                  <p className="text-gray-400">{timeAgo}</p>
                </div>
              </div>

              {/* Stars + Label */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`mr-1 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span
                  className={`ml-2 text-sm font-medium ${
                    ratingColors[review.rating]
                  }`}
                >
                  {getRecommendationText(review.rating)}
                </span>
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                {review.description_feedback}
              </p>

              {/* Images */}
              {/* <div className="grid grid-cols-5 gap-2 mb-3">
        {r.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`img-${i}`}
            className="h-24 object-cover rounded"
          />
        ))}
      </div> */}

              {/* Like */}
              <div className="flex items-center text-sm text-gray-500">
                <FaThumbsUp className="mr-2" />
                {review.likes} người thấy điều này hữu ích
              </div>
            </div>
          );
        })}

      {/* Bài viết chia sẻ */}
      {activeTab === "shared" &&
        sharedPosts.map((post) => {
          const postExAlbum = JSON.parse(post.postEx_album);
          const firstImage = postExAlbum?.[0];

          return (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow border mb-5"
            >
              <div className="text-sm font-medium mb-3 border-b border-gray-300 pb-2">
                Trạng thái:{" "}
                <span
                  className={post.status ? "text-green-600" : "text-red-600"}
                >
                  {post.status ? "Đã được duyệt" : "Chưa được duyệt"}
                </span>
              </div>

              <div className="flex gap-4">
                <img
                  src={firstImage}
                  alt="preview"
                  className="w-28 h-24 object-cover rounded-md"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-600 mb-2">
                    {post.title_post}
                  </h3>

                  <div className="text-sm text-gray-600 flex flex-wrap gap-4 mb-1">
                    <span className="flex items-center gap-1 text-zinc-900">
                      <img src={Icons.CalendarBold} />
                      <span>Ngày viết: {formatDate(post.post_date)}</span>
                    </span>
                    <span className="flex items-center gap-1 text-zinc-900">
                      <FaThumbsUp className="inline mr-1" />
                      {post.likes} người thấy điều này hữu ích
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Viết bởi: {post?.user?.displayName || "Người dùng ẩn danh"}
                  </p>
                </div>

                {/* Icons */}
                <div className="flex items-center justify-center gap-3 pr-2 text-gray-500">
                  <button onClick={() => setShowEditModal(true)}>
                    <FiEdit2
                      className="cursor-pointer hover:text-blue-500"
                      title="Sửa bài viết"
                    />
                  </button>
                  <ModalEditSharePost
                    isOpen={showEditModal}
                    post={post}
                    onClose={() => setShowEditModal(false)}
                  />
                  <FiExternalLink
                    className="cursor-pointer hover:text-blue-500"
                    title="Xem bài viết"
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
