const sequelize = require('./db');
const User = require('./models/User');

(async () => {
  try {
    await sequelize.sync({ force: true });

    // Sample teachers
    const teachers = [
      { name: 'Dr. Alice Johnson', email: 'alice@example.com', passwordHash: '$2a$10$hashedpassword1', role: 'teacher', verified: true },
      { name: 'Prof. Bob Smith', email: 'bob@example.com', passwordHash: '$2a$10$hashedpassword2', role: 'teacher', verified: true },
      { name: 'Ms. Carol Davis', email: 'carol@example.com', passwordHash: '$2a$10$hashedpassword3', role: 'teacher', verified: true },
    ];

    // Sample students
    const students = [
      { name: 'John Doe', email: 'john@example.com', passwordHash: '$2a$10$hashedpassword4', role: 'student', verified: true },
      { name: 'Jane Roe', email: 'jane@example.com', passwordHash: '$2a$10$hashedpassword5', role: 'student', verified: true },
      { name: 'Alex Lee', email: 'alex@example.com', passwordHash: '$2a$10$hashedpassword6', role: 'student', verified: true },
      { name: 'Sam Wilson', email: 'sam@example.com', passwordHash: '$2a$10$hashedpassword7', role: 'student', verified: true },
    ];

    // Hash passwords (using bcrypt)
    const bcrypt = require('bcrypt');
    for (let user of [...teachers, ...students]) {
      user.passwordHash = await bcrypt.hash('password123', 10); // Default password: password123
    }

    // Clear existing users first
    await User.destroy({ where: {} });

    // Create users with specific IDs
    const usersWithIds = [
      { id: 1, ...teachers[0] },
      { id: 2, ...teachers[1] },
      { id: 3, ...teachers[2] },
      { id: 4, ...students[0] },
      { id: 5, ...students[1] },
      { id: 6, ...students[2] },
      { id: 7, ...students[3] },
    ];


    for (const userData of usersWithIds) {

      console.log('Creating user:', userData);

      const user = await User.create(userData);

      console.log('Created user:', user.id);

    }


    console.log('Sample users seeded successfully.');
    console.log('Teachers: alice@example.com, bob@example.com, carol@example.com');
    console.log('Students: john@example.com, jane@example.com, alex@example.com, sam@example.com');
    console.log('Password for all: password123');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
})();
