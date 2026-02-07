const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'insecure_dev_secret';

const authMiddleware = require('../middleware/auth');

// list users (optionally filter by role or search by username). Excludes current user.
// Now returns all users for recommendations (classmates and opposite role)
router.get('/', authMiddleware, async (req, res) => {
  const role = req.query.role; // teacher or student (optional)
  const search = req.query.search; // search by username
  const where = {};
  if (role) where.role = role;
  if (search) where.name = { [Op.like]: `%${search}%` }; // case-insensitive search for SQLite
  const users = await User.findAll({
    where,
    attributes: ['id', 'name', 'email', 'role', 'verified']
  });
  const filtered = users.filter(u => u.id !== req.user.id);
  res.json(filtered);
});

module.exports = router;