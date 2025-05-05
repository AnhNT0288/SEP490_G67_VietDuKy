import { useEffect, useState } from "react";
import {
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  collectionGroup,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/init";

export const useNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const recipientsQuery = query(
      collectionGroup(db, "recipients"),
      where("userId", "==", Number(userId)),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(recipientsQuery, async (snapshot) => {
      const notiPromises = snapshot.docs.map(async (recipientDoc) => {
        try {

          const recipientData = recipientDoc.data();
          const recipientRef = recipientDoc.ref;
          const notificationRef = recipientRef.parent.parent;

          if (!notificationRef) return null;

          const notificationSnap = await getDoc(notificationRef);
          if (!notificationSnap.exists()) return null;

          return {
            id: notificationSnap.id,
            ...notificationSnap.data(),
            isRead: recipientData.isRead,
            readAt: recipientData.readAt || null,
            recipientDocId: recipientDoc.id,
          };
        } catch (error) {
          console.log(error);
        }
      });

      const notiData = await Promise.all(notiPromises);
      setNotifications(notiData.filter(Boolean));
    });

    return () => unsubscribe();
  }, [userId]);

  const markNotificationAsRead = async (notificationId, recipientId) => {
    console.log("notificationId:", notificationId);
    console.log("recipientId:", recipientId);
    try {
      const recipientRef = doc(
        db,
        "notifications",
        notificationId,
        "recipients",
        String(recipientId)
      );

      await updateDoc(recipientRef, {
        isRead: true,
        readAt: new Date().toISOString(),
      });

      console.log(`Notification ${notificationId} marked as read.`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return { notifications, markNotificationAsRead };
};
