import restClient from "../restClient"

export const TourInfoService = {
    getTourInfo: (tourId) => {
        return restClient({
            url: `tour-info/get/${tourId}`,
            method: "GET",
        })
    },
}