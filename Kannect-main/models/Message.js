const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

class Message extends Model {}

Message.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM('text', 'file'), defaultValue: 'text' },
  filePath: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  modelName: 'Message',
  timestamps: true,
});

// Associations: Message.senderId -> User.id, Message.receiverId -> User.id
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = Message;