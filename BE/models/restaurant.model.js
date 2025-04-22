module.exports = (sequelize, Sequelize) => {
  const Restaurant = sequelize.define(
    "Restaurant",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name_restaurant: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address_restaurant: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "restaurant",
      timestamps: false,
    }
  );

  return Restaurant;
};
