module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "StaffLocation",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      location_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "staff_location",
      timestamps: false, // Không tự động thêm createdAt và updatedAt
    }
  );
};
