const Sequelize = require('sequelize');
const db = require('../helpers/db');


const Users = db.define('users', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.TEXT,
    },
    image:{
        type: Sequelize.TEXT,
    }
})

module.exports = Users;