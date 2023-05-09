// connect to database
const {Sequelize} = require('sequelize');


var sequelize = new Sequelize(
  'head_db',
  'root',
  'password',
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
  }
);
// disable logging
sequelize.options.logging = false;

(async () => await sequelize.sync().catch( err => {console.log(__errlogclr, "Sequelize error!");console.log(err);} ))();

module.exports = sequelize;
