const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DB, process.env.USERDB, process.env.PASSWORDDB, {
    host: process.env.HOSTDB,
    port: process.env.PORTDB,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    define: {
        timestamps: false
      }
});

module.exports = db;