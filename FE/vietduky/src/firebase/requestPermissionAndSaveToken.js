import { messaging } from "@/firebase/init";
import restClient from "@/services/restClient";
import { getToken, deleteToken } from "firebase/messaging";
import { Environment } from "@/environment";

async function requestPermissionAndSaveToken() {
  try {

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    const swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    let permission = Notification.permission;
    if (permission !== "granted") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return;
    }

    // ❌ Xoá token cũ trước khi tạo mới
    try {
      const deleted = await deleteToken(messaging);
      console.log("Old FCM token deleted:", deleted);
    } catch (err) {
      console.warn("Failed to delete old token (maybe none existed):", err);
    }

    // ✅ Tạo token mới
    const fcmToken = await getToken(messaging, {
      vapidKey: Environment.FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (!fcmToken) {
      console.warn("FCM token is null.");
      return;
    }

    // Gửi lên server
    await restClient({
      url: "user/fcm-token",
      method: "PUT",
      data: { fcmToken },
    });

    console.log("New FCM token sent to server:", fcmToken);
  } catch (error) {
    console.error("FCM setup failed:", error);
  }
}

export default requestPermissionAndSaveToken;
