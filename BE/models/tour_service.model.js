module.exports = (sequelize, Sequelize) => {
  const TourService = sequelize.define(
    "TourService",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "tour_service",
      timestamps: false, // Tự động thêm createdAt và updatedAt
    }
  );

  return TourService;
};
