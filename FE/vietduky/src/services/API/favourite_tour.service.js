import restClient from "../restClient";

export const FavouriteTourService = {
    getFavouriteTourByUserID: (userId) => {
        return restClient({
            url: `favorite-tour/user/${userId}`,
            method: "GET",
        });
    },
    add: (data) => {
        return restClient({
            url: "favorite-tour/add",
            method: "POST",
            data,
        });
    },
    remove: (data) => {
        return restClient({
            url: `favorite-tour/remove`,
            method: "DELETE",
            data,
        });
    },
};