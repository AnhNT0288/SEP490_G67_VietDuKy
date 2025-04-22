module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define(
    "Location",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "location", // Tên bảng trong MySQL
      timestamps: false, // Tắt `createdAt` và `updatedAt`
    }
  );

  return Location;
};
