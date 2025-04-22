module.exports = (sequelize, Sequelize) => {
  const RestaurantBooking = sequelize.define(
    "RestaurantBooking",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "restaurant_booking",
      timestamps: false,
    }
  );

  return RestaurantBooking;
};
