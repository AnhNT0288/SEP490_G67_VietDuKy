const { admin, db } = require('../firebase');
const { Role } = require('../models');
const { User } = require('../models');
const { Op } = require('sequelize');

const sendNotificationToUser = async (userId, fcmToken, data) => {
    const message = {
        notification: {
            title: data.title,
            body,
        },
        token: fcmToken,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);

        const notificationRef = db.collection('notification');  // Trỏ đến collection "notification"

        await notificationRef.add({
            ...data,
            user_id: userId,  // ID của người nhận thông báo
            role: [],          // Có thể thêm thông tin về role nếu cần
            isRead: false,     // Mặc định là chưa đọc
            sentAt: admin.firestore.FieldValue.serverTimestamp()  // Thời gian gửi thông báo
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const sendNotificationToGroup = async (fcmTokens, data) => {
    const message = {
        notification: {
            title: data.title,
            body: data.body,
        },
        tokens: fcmTokens,  // Mảng token của các người dùng cần nhận thông báo
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        response.responses.forEach((resp, idx) => {
            if (!resp.success) {
                console.error(`❌ Token ${fcmTokens[idx]} failed:`, resp.error);
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const sendRoleBasedNotification = async (roles, data) => {
    try {

        // roles: string hoặc string[] => chuẩn hóa thành mảng
        const roleNames = Array.isArray(roles) ? roles : [roles];
        console.log('roleNames', roleNames);

        // Lấy tất cả các roles có trong mảng
        const roleFind = await Role.findAll({
            where: { role_name: { [Op.in]: roleNames } }
        });
        console.log('roleFind', roleFind);

        if (!roleFind || roleFind.length === 0) {
            throw new Error('Role(s) not found');
        }

        // Lấy tất cả user có role_id nằm trong mảng roleFind
        const roleIds = roleFind.map(role => role.id);
        console.log('roleIds', roleIds);

        const users = await User.findAll({
            where: { role_id: { [Op.in]: roleIds } }
        });
        console.log('users', users, roleIds);

        const tokens = users
            .map(user => user.fcm_token)
            .filter(Boolean);

        const notificationRef = db.collection('notification');

        await notificationRef.add({
            ...data,
            user_id: null,  // ID của người nhận thông báo
            role: roleNames,          // Có thể thêm thông tin về role nếu cần
            isRead: false,     // Mặc định là chưa đọc
            createAt: admin.firestore.FieldValue.serverTimestamp()  // Thời gian gửi thông báo
        });

        if (tokens.length > 0) {
            await sendNotificationToGroup(tokens, data);
        }
    } catch (error) {
        console.error('Error sending role-based notification:', error);
    }
};

module.exports = {
    sendNotificationToUser,
    sendNotificationToGroup,
    sendRoleBasedNotification,
};