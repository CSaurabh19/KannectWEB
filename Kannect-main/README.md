# Kannect

A simple, text-only teacher–student chat application built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

- **User Registration & Login**: Register as a teacher or student with email verification
- **Real-time Chat**: Send and receive messages between teachers and students
- **Role-based Access**: Teachers see students, students see teachers
- **Email Verification**: Accounts must be verified via email before chatting
- **Responsive UI**: Clean, modern interface that works on desktop and mobile

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite with Sequelize ORM
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Email**: Nodemailer (Ethereal test account by default)
- **Auth**: JWT tokens stored in localStorage

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- (Optional) An SMTP service for email verification

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/kannect.git
   cd kannect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** (or copy from `.env.example`)

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   - `PORT=3000` (or any available port)
   - `JWT_SECRET=<your-random-secret>`
   - `DATABASE_FILE=database.sqlite`
   - Optional SMTP config for production

4. **Start the server**
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser.

## Usage

### For Students

1. Register as a **Student**
2. Check your email and verify your account (Ethereal test link in console output by default)
3. Log in
4. View available teachers in the **Contacts** sidebar
5. Click a teacher to start chatting

### For Teachers

1. Register as a **Teacher**
2. Verify your email
3. Log in
4. View available students in the **Contacts** sidebar
5. Click a student to start chatting

### Messages

- Messages appear in real-time with sender name and timestamp
- Your messages appear on the right in blue; others' appear on the left in white
- The contact list auto-refreshes; chat history polls every 2.5 seconds

## Project Structure

```
kannect/
├── server.js                 # Express server setup
├── db.js                     # Sequelize database config
├── mailer.js                 # Email service (Nodemailer)
├── package.json              # Dependencies
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
│
├── models/
│   ├── User.js               # User model (name, email, password, role, verified)
│   └── Message.js            # Message model (content, sender, recipient)
│
├── routes/
│   ├── auth.js               # /api/auth/register, /api/auth/login
│   ├── users.js              # /api/users (list users by role)
│   └── messages.js           # /api/messages (fetch & send messages)
│
└── public/
    ├── index.html            # Landing page
    ├── register.html         # Registration form
    ├── login.html            # Login form
    ├── dashboard.html        # Chat interface
    └── styles.css            # Shared stylesheet
```

## API Endpoints

### Authentication

- `POST /api/auth/register` – Create a new user account
- `POST /api/auth/login` – Log in and receive a JWT token
- `POST /api/auth/verify` – Verify email (token in query param)

### Users

- `GET /api/users?role=student` – List all teachers (if student) or students (if teacher)

### Messages

- `GET /api/messages?with=<userId>` – Fetch conversation with a user
- `POST /api/messages` – Send a new message
  - Body: `{ to: userId, content: "message text" }`

## Environment Variables

| Variable        | Default           | Description                           |
| --------------- | ----------------- | ------------------------------------- |
| `PORT`          | `3000`            | Server port                           |
| `JWT_SECRET`    | (required)        | Secret for signing JWT tokens         |
| `DATABASE_FILE` | `database.sqlite` | SQLite database path                  |
| `SMTP_HOST`     | (optional)        | SMTP server hostname                  |
| `SMTP_PORT`     | (optional)        | SMTP port (typically 587 or 465)      |
| `SMTP_SECURE`   | (optional)        | Use TLS (true for 465, false for 587) |
| `SMTP_USER`     | (optional)        | SMTP username                         |
| `SMTP_PASS`     | (optional)        | SMTP password                         |
| `FROM_EMAIL`    | (optional)        | Sender email address                  |

If no SMTP config is provided, the app creates an Ethereal test account and logs preview URLs to the console.

## Development

### Start Server in Watch Mode

```bash
npx nodemon server.js
```

### Seed Test Data

```bash
node seed.js
```

This creates sample users and messages for testing.

### Run Tests

```bash
npm test
```

(Currently no tests; feel free to add Jest or Mocha!)

## Common Issues

### Port Already in Use

The server will automatically try the next available port (up to 5 attempts). Or, kill the process:

```bash
npx lsof -ti:3000 | xargs kill -9   # macOS/Linux
Get-Process -Name "node" | Stop-Process   # Windows PowerShell
```

### Database Locked

Delete `database.sqlite*` files and restart the server to reset:

```bash
rm database.sqlite database.sqlite-shm database.sqlite-wal
npm start
```

### Email Not Working

By default, Ethereal test accounts are created automatically. Check the server console for the preview URL. To use a real SMTP service, configure `.env` with your provider credentials.

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

**Questions?** Feel free to open an issue or reach out!
