module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define(
    "Article",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      directory_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allow_null: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      alias: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      album_post: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      true_featured: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      true_active: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      article_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      article_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      article_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "article",
      timestamps: false,
    }
  );

  return Article;
};
