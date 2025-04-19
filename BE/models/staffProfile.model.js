module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "StaffProfile",
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
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING, // "male", "female", "other"
        allowNull: true,
      },
    },
    {
      tableName: "staff_profiles",
      timestamps: false, // Không tự động thêm createdAt và updatedAt
    }
  );
};
