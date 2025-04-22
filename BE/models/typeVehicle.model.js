//id, type_name
module.exports = (sequelize, Sequelize) => {
  const TypeVehicle = sequelize.define(
    "TypeVehicle",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      type_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "type_vehicle",
      timestamps: false,
    }
  );

  return TypeVehicle;
};
