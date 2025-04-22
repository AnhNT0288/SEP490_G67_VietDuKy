module.exports = (sequelize, Sequelize) => {
  const Tour = sequelize.define(
    "Tour",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      topic_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      code_tour: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name_tour: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price_tour: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      day_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rating_tour: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      activity_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      album: {
        type: Sequelize.TEXT,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue('album');
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            return [];
          }
        }
      },
      start_location: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      end_location: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      available_month: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passport: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    },
    {
      tableName: "tour", // Tên bảng trong MySQL
      timestamps: false, // Tắt `createdAt` và `updatedAt`
    }
  );

  return Tour;
};
