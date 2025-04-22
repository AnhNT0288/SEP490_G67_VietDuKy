import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const DirectoryService = {
    getAllDirectory: () => {
        return restClient({
            url: "directory",
            method: "GET",
        });
    },
};