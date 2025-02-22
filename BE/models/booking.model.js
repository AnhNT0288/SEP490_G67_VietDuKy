module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      discount_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      travel_tour_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      booking_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      number_adult: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      number_children: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      total_cost: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0, // 0: Pending, 1: Confirmed, 2: Canceled
      },
    },
    {
      tableName: "booking", // Đảm bảo tên bảng khớp với DB
      timestamps: false, // Không dùng createdAt và updatedAt
    }
  );

  return Booking;
};
