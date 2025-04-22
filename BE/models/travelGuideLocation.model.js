module.exports = (sequelize, Sequelize) => {
  const TravelGuideLocation = sequelize.define(
    "TravelGuideLocation",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      travel_guide_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      location_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_current: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Đánh dấu địa điểm hiện tại
      },
    },
    {
      tableName: "travel_guide_location",
      timestamps: false,
    }
  );

  return TravelGuideLocation;
};
