import restClient from "../restClient";

export const FeedbackService = {
    getAllFeedback: () => {
        return restClient({
            url: "feedback",
            method: "GET",
        });
    },
    getFeedbackByUserId: (userId) => {
        return restClient({
            url: `feedback/${userId}`,
            method: "GET",
        });
    },
    getFeedbackByTourId: (tourId) => {
        return restClient({
            url: `feedback/tour/${tourId}`,
            method: "GET",
        });
    },
    createFeedbackTour: (data) => {
        return restClient({
            url: "feedback/create/tour",
            method: "POST",
            data,
        });
    },
    createFeedbackGuide: (data) => {
        return restClient({
            url: "feedback/create/travel-guide",
            method: "POST",
            data,
        });
    },
    updateFeedback: (id, data) => {
        return restClient({
            url: `feedback/${id}`,
            method: "PUT",
            data,
        });
    },
    deleteFeedback: (id) => {
        return restClient({
            url: `feedback/${id}`,
            method: "DELETE",
        });
    },
}