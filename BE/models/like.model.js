module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define(
    "Like",
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
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      target_type: {
        type: Sequelize.ENUM("feedback", "postExperience", "article"),
        allowNull: false,
      },
    },
    {
      tableName: "like",
      timestamps: false,
    }
  );

  return Like;
};
