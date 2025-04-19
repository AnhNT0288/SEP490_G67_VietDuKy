module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "GuideTour",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      travel_guide_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      travel_tour_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER, // 0: Chưa duyệt, 1: Đã duyệt, 2: Từ chối
        allowNull: true,
        defaultValue: 0,
      },
      group_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isLeader: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      tableName: "guide_tour",
      timestamps: true, // Không có `createdAt` và `updatedAt`
    }
  );
};
