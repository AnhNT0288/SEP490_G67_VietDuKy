import { messaging } from "@/firebase/init";
import restClient from "@/services/restClient";
import { StorageService } from "@/services/storage/StorageService";
import { getToken } from "firebase/messaging";
import { Environment } from "@/environment";

async function requestPermissionAndSaveToken() {
  try {
    console.log("requestPermissionAndSaveToken");
    const swRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    const accessToken = StorageService.getToken();

    if (!accessToken) {
      return;
    }
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: Environment.FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });
      // Gọi API lưu token vào database cùng với userId

      await restClient({
        url: "user/fcm-token",
        method: "PUT",
        data: {
          fcmToken: token,
        },
      });
    }
  } catch (error) {
    console.log("error", error);
  }
}

export default requestPermissionAndSaveToken;
