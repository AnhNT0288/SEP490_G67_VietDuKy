module.exports = (sequelize, Sequelize) => {
  const FavoriteTour = sequelize.define(
    "FavoriteTour",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "favorite_tour",
      timestamps: false,
    }
  );

  return FavoriteTour;
};
