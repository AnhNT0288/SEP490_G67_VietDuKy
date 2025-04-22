module.exports = (sequelize, Sequelize) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      type_vehicle_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name_vehicle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      plate_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "vehicle",
      timestamps: false,
    }
  );

  return Vehicle;
};
