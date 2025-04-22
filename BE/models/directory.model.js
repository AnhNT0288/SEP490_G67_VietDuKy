module.exports = (sequelize, Sequelize) => {
  const Directory = sequelize.define(
    "Directory",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name_directory: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alias: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "directory",
      timestamps: false,
    }
  );

  return Directory;
};
