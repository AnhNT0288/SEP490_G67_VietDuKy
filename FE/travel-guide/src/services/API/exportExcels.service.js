import { StorageService } from "../storage/StorageService";

export async function exportPassengerExcel(tourId, guideId) {
    const token = StorageService.getToken();

    const response = await fetch(
        `http://localhost:3000/api/passenger/export-excel/${tourId}?travel_guide_id=${guideId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const text = await response.text();
        console.error("❌ Response không OK:", text);
        throw new Error("Không thể export Excel");
    }

    return await response.blob();
}
