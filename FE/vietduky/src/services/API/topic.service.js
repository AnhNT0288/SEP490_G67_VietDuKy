import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const TopicService = {
    getTopic: () => {
        return restClient({
            url: "topic",
            method: "GET",
        });
    },
    getTopicById: (id) => {
        return restClient({
            url: `topic/${id}`,
            method: "GET",
        });
    },

};