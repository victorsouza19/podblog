const Sequelize = require("sequelize");

const connection = new Sequelize('castersblog', 'root', 'admin',{
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;