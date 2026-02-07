const sequelize = require('./db');
const User = require('./models/User');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const users = await User.findAll();
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Verified: ${user.verified}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();
