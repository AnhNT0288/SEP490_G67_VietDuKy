import restClient from "../restClient";

export function getTypeTours(page = 1, limit = 10) {
    return restClient({
        url: "type-tour",
        method: "GET",
        params: { page, limit },
    })
        .then(response => {
        return response.data;
        })
        .catch(error => {
        console.error("Lỗi API:", error);
        throw error;
        });
}