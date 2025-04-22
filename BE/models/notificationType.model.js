module.exports = (sequelize, Sequelize) => {
  const NotificationType = sequelize.define(
    "NotificationType",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      type_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description_notification_type: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "notification_type",
      timestamps: false, // Không có `createdAt` và `updatedAt`
    }
  );

  return NotificationType;
};
