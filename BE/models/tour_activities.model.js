module.exports = (sequelize, Sequelize) => {
  const TourActivities = sequelize.define(
    "TourActivities",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      day: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      detail: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "tour_activities",
      timestamps: false, // Tự động thêm createdAt và updatedAt
    }
  );

  return TourActivities;
};
