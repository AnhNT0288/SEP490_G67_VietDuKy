//id, name_type, description_type
module.exports = (sequelize, Sequelize) => {
  const TypeTour = sequelize.define(
    "TypeTour",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "type_tour",
      timestamps: false,
    }
  );

  return TypeTour;
};
