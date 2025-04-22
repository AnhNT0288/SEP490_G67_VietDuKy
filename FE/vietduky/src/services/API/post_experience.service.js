import restClient from "../restClient";

export const PostExperienceService = {
    getAllPostExperience: () => {
        return restClient({
            url: "post-experience",
            method: "GET",
        });
    },
    getPostExperienceById: (id) => {
        return restClient({
            url: `post-experience/${id}`,
            method: "GET",
        });
    },
    getPostExperienceByUserId: (userId) => {
        return restClient({
            url: `post-experience/user/${userId}`,
            method: "GET",
        });
    },
    createPostExperience: (data) => {
        return restClient({
            url: "post-experience/create",
            method: "POST",
            data,
        });
    },
    updatePostExperience: (id, data) => {
        return restClient({
            url: `post-experience/update/${id}`,
            method: "PUT",
            data,
        });
    },
    deletePostExperience: (id) => {
        return restClient({
            url: `post-experience/${id}`,
            method: "DELETE",
        });
    },
    incrementViews: (id) => {
        return restClient({
            url: `post-experience/increment-views/${id}`,
            method: "POST",
        });
    }
};