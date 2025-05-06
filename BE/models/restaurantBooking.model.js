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
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      restaurant_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      meal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      
    },
    {
      tableName: "restaurant_booking",
      timestamps: false,
    }
  );

  return RestaurantBooking;
};
