import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/init";

export const useNotifications = ({ userId, role }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId && !role) return;
        console.log('userId:', userId, 'role:', role);

        const notificationsRef = collection(db, "notification");

        // Query 1: user_id == userId
        const userQuery = query(
            notificationsRef,
            where("user_id", "==", userId)
        );

        // Query 2: role array contains role
        const roleQuery = query(
            notificationsRef,
            where("role", "array-contains", role)
        );

        // Mảng để lưu kết quả nhận từ hai query
        let allNotifications = [];

        // Listener cho userQuery
        const unsubscribeUser = onSnapshot(userQuery, (snapshot) => {
            const notiDataUser = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("User Notifications:", notiDataUser);

            // Gộp dữ liệu mới vào allNotifications
            allNotifications = [...allNotifications, ...notiDataUser];

            // Cập nhật state với dữ liệu đã gộp
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                ...notiDataUser,
            ]);
        });

        // Listener cho roleQuery
        const unsubscribeRole = onSnapshot(roleQuery, (snapshot) => {
            const notiDataRole = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Role Notifications:", notiDataRole);

            // Gộp dữ liệu mới vào allNotifications
            allNotifications = [...allNotifications, ...notiDataRole];

            // Cập nhật state với dữ liệu đã gộp
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                ...notiDataRole,
            ]);
        });

        // Clean up subscriptions
        return () => {
            unsubscribeUser();
            unsubscribeRole();
        };
    }, [userId, role]);

    // Gộp các notification từ hai query và loại bỏ các mục trùng lặp
    const uniqueNotifications = Array.from(
        new Map(
            notifications.map((item) => [item.id, item])
        ).values()
    );

    return uniqueNotifications;
};
