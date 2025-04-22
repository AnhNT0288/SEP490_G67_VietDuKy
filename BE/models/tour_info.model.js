module.exports = (sequelize, Sequelize) => {
  const TourInfo = sequelize.define(
    "TourInfo",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      tab: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "tour_info", // Tên bảng trong MySQL
      timestamps: false, // Tắt `createdAt` và `updatedAt`
    }
  );

  return TourInfo;
};
