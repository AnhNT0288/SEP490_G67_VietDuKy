module.exports = (sequelize, Sequelize) => {
  const Hotel = sequelize.define(
    "Hotel",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name_hotel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_hotel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: "hotel",
      timestamps: false,
    }
  );

  return Hotel;
};
