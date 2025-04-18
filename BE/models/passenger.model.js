module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "Passenger",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: Sequelize.BOOLEAN, // 0: Male, 1: Female
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      passport_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      travel_guide_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "passenger",
      timestamps: false,
    }
  );
};
