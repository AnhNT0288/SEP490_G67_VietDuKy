import restClient from "../restClient";

export const LikeService = {
    toggleLikePost: (data) => {
        return restClient({
            url: "like/toggle",
            method: "POST",
            data,
        });
    },
    totalLikeFeedback: (feedbackId) => {
        return restClient({
            url: "like/count",
            params: {
                target_id: feedbackId,
                target_type: "feedback",
            },
            method: "GET",
        });
    },
    isLikedFeedback: (feedbackId) => {
        const userId = JSON.parse(localStorage.getItem("user"))?.id;

        if (!userId) {
            throw new Error("User ID is not available");
        }

        return restClient({
            url: "like/isLiked",
            params: {
                user_id: userId,
                target_id: feedbackId,
                target_type: "feedback",
            },
            method: "GET",
        });
    },
}