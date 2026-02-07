const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

class Contact extends Model {}

Contact.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  blockedById: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'id' } }
}, {
  sequelize,
  modelName: 'Contact',
  timestamps: true,
});

// Many-to-many relationship through ContactUsers junction table
Contact.belongsToMany(User, { through: 'ContactUsers', foreignKey: 'contactId' });
User.belongsToMany(Contact, { through: 'ContactUsers', foreignKey: 'userId' });

module.exports = Contact;
