const Sequelize = require("sequelize");
const Category = require("../categories/Category");
const connection = require("../database/database");

const Article = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

Article.belongsTo(Category); // Um artigo pertence à uma categoria | relacionamento 1/1
Category.hasMany(Article); // Uma categoria pertence à muitos artigos | relacionamento 1/n

Article.sync({force: false});

module.exports = Article;