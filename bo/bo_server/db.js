// connect to database
const {Sequelize} = require('sequelize');
const DB_NAMES = ['BRANCH_OFFICE_1', 'BRANCH_OFFICE_2'];
const DB_NAME = DB_NAMES[process.argv[3].split('=')[1]];

var sequelize = new Sequelize(
  DB_NAME,
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

(async () => await sequelize.sync().catch( err => {console.log("Sequelize error!");console.log(err);} ))();

module.exports = sequelize;
