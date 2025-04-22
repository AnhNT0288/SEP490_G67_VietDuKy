module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "VehicleBooking",
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
      vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "vehicle_booking",
      timestamps: false,
    }
  );
};
