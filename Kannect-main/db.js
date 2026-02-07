const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const databaseFile = process.env.DATABASE_FILE || 'database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databaseFile,
  logging: false
});

module.exports = sequelize;