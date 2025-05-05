const { admin, db } = require("../firebase");
const { Role, User } = require("../models");
const { Op } = require("sequelize");

// Hàm tạo notification và gán cho user
const createNotificationWithRecipients = async (data, userIds = []) => {
  const notificationRef = db.collection("notifications").doc(); // Tạo document ID mới
  await notificationRef.set({
    title: data.title || "",
    body: data.body || "",
    type: data.type || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const batch = db.batch();

  for (const userId of userIds) {
    const recipientRef = notificationRef.collection("recipients").doc(String(userId));
    batch.set(recipientRef, {
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      readAt: null,
      userId,
    });
  }

  await batch.commit();
};

const sendNotificationToUser = async (userId, fcmToken, data) => {
    const message = {
        notification: {
            title: data.title
        },
        token: fcmToken,
    };

  try {
    await admin.messaging().send(message);
    await createNotificationWithRecipients(data, [userId]);
    console.log("Sent notification to user:", userId);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const sendNotificationToGroup = async (fcmTokens, userIds, data) => {
  // Gộp userId và token thành cặp để tránh lệch index
  const userTokenPairs = fcmTokens
    .map((token, idx) => ({ userId: userIds[idx], token }))
    .filter((pair) => Boolean(pair.token));

  if (userTokenPairs.length === 0) {
    console.log("No valid FCM tokens.");
    return;
  }
  console.log(userIds, "userIds");

  const message = {
    notification: {
      title: data?.title || "",
      body: data?.body || "",
    },
    tokens: userTokenPairs.map((u) => u.token),
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    const validUserIds = [];
    const invalidTokens = [];

    response.responses.forEach((resp, idx) => {
      const { userId, token } = userTokenPairs[idx];

      if (resp.success) {
        validUserIds.push(userId);
      } else {
        const errorCode = resp.error?.code;
        console.log(errorCode);

        if (errorCode === "messaging/registration-token-not-registered") {
          invalidTokens.push({ userId, token });
        }

        // console.error(`❌ Failed to send to user ${userId}, token ${token}:`, resp.error);
      }
    });
    console.log(validUserIds, "validUserIds");
    
    // Gửi notification Firestore cho các user thành công
    if (validUserIds.length > 0) {
      await createNotificationWithRecipients(data, validUserIds);
    }

    // Xoá các token lỗi khỏi MySQL
    for (const { userId, token } of invalidTokens) {
      await User.update(
        { fcm_token: null },
        { where: { id: userId, fcm_token: token } }
      );
      console.log(`✅ Removed invalid token for user ${userId}`);
    }
  } catch (error) {
    console.error("🔥 Error sending group message:", error);
  }
};


const sendRoleBasedNotification = async (roles, data) => {
  try {
    const roleNames = Array.isArray(roles) ? roles : [roles];

    const roleFind = await Role.findAll({
      where: { role_name: { [Op.in]: roleNames } },
    });

    if (!roleFind || roleFind.length === 0) throw new Error("Role(s) not found");

    const roleIds = roleFind.map((role) => role.id);

    const users = await User.findAll({
      where: { role_id: { [Op.in]: roleIds } },
    });

    const tokens = users.map((user) => user.fcm_token);
    const userIds = users.map((user) => user.id);
    console.log(tokens, userIds);

    if (tokens.length > 0 && userIds.length > 0) {
      await sendNotificationToGroup(tokens, userIds, data);
    } else {
      console.log("No users found or no tokens available.");
    }
  } catch (error) {
    console.error("Error sending role-based notification:", error);
  }
};

module.exports = {
  sendNotificationToUser,
  sendNotificationToGroup,
  sendRoleBasedNotification,
};
