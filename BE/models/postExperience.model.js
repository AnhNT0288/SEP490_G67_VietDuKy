module.exports = (sequelize, Sequelize) => {
  //id, customer_id, title_post, description_post, post_date
  const PostExperience = sequelize.define(
    "PostExperience",
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
      title_post: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alias: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description_post: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      post_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      postEx_album: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // // 0: chưa duyệt, 1: đã duyệt, 2: đã từ chối
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "post_experience",
      timestamps: false,
    }
  );
  return PostExperience;
};
