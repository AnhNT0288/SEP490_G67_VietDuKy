module.exports = (sequelize, Sequelize) => {
  const Feedback = sequelize.define(
    "Feedback",
    {
      feedback_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      travel_guide_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description_feedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5, // Giả sử rating chỉ từ 1 đến 5
        },
      },
      feedback_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      feedback_album: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "feedback",
      timestamps: false, // Không có `createdAt` và `updatedAt`
    }
  );

  return Feedback;
};
