const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

class ContactRequest extends Model {}

ContactRequest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: { type: DataTypes.ENUM('pending', 'accepted', 'blocked', 'declined'), defaultValue: 'pending' },
}, {
  sequelize,
  modelName: 'ContactRequest',
  timestamps: true,
});

// Associations
ContactRequest.belongsTo(User, { as: 'fromUser', foreignKey: 'fromId' });
ContactRequest.belongsTo(User, { as: 'toUser', foreignKey: 'toId' });

module.exports = ContactRequest;
