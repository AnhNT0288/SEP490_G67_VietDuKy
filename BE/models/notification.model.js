module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      notificationType: {
        type: Sequelize.ENUM('SYSTEM', 'BOOKING', 'PAYMENT', 'OTHER'),
        defaultValue: 'SYSTEM',
        field: 'type'
      },
      data: {
        type: Sequelize.JSON,
        allowNull: true
      }
    },
    {
      tableName: "notifications",
      timestamps: true,
      // Tắt tự động tạo associations
      defaultScope: {
        attributes: { exclude: [] }
      }
    }
  );

  // Không thêm associations ở đây
  return Notification;
};
