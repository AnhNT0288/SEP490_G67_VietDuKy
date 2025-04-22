module.exports = (sequelize, Sequelize) => {
  const Service = sequelize.define(
    "Service",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name_service: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description_service: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price_service: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "service", // Tên bảng trong MySQL
      timestamps: false, // Tắt `createdAt` và `updatedAt`
    }
  );

  return Service;
};
