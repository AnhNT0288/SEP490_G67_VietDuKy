import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/init";

export const useNotifications = ({ userId, role }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId && !role) return;

    const notificationsRef = collection(db, "notification");

    const userQuery = query(
      notificationsRef,
      where("user_id", "==", userId),
      orderBy("createAt", "desc")
    );

    const roleQuery = query(
      notificationsRef,
      where("role", "array-contains", role),
      orderBy("createAt", "desc")
    );

    const handleSnapshot = (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    };

    let userData = [];
    let roleData = [];

    const unsubscribeUser = onSnapshot(userQuery, (snapshot) => {
      userData = handleSnapshot(snapshot);
      updateCombinedNotifications();
    });

    const unsubscribeRole = onSnapshot(roleQuery, (snapshot) => {
      roleData = handleSnapshot(snapshot);
      updateCombinedNotifications();
    });

    const updateCombinedNotifications = () => {
      const combined = [...userData, ...roleData];
      const unique = Array.from(
        new Map(combined.map((item) => [item.id, item])).values()
      );
      setNotifications(unique);
    };

    return () => {
      unsubscribeUser();
      unsubscribeRole();
    };
  }, [userId, role]);

  // Gộp các notification từ hai query và loại bỏ các mục trùng lặp
  const uniqueNotifications = Array.from(
    new Map(notifications.map((item) => [item.id, item])).values()
  );
  /**
   * Đánh dấu 1 thông báo là đã đọc
   * @param notificationId - ID của document trong collection "notification"
   */
  const markNotificationAsRead = async (notificationId) => {
    try {
      const notiRef = doc(db, "notification", notificationId);
      await updateDoc(notiRef, {
        isRead: true,
      });
      console.log(`Notification ${notificationId} marked as read.`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return { notifications: uniqueNotifications, markNotificationAsRead };
};
