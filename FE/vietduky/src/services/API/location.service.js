import restClient from "../restClient";

export const LocationService = {
  getAllLocations: () => {
    return restClient({
      url: "location",
      method: "GET",
    });
  },
  getLocationById: (id) => {
    return restClient({
      url: `location/${id}`,
      method: "GET",
    });
  },
}