const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();

console.log('Creating basic Express app...');

// Add middleware one by one
app.use(cors());
console.log('Added CORS...');

app.use(express.json());
console.log('Added JSON middleware...');

app.use(express.urlencoded({ extended: true }));
console.log('Added URL encoded middleware...');

// Test rate limiting - THIS IS LIKELY THE CULPRIT
console.log('About to add rate limiting...');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
console.log('Added rate limiting...');

// Test static files
console.log('About to add static files...');
app.use(express.static(path.join(__dirname, 'public')));
console.log('Added static files...');

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

console.log('Added routes...');

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

console.log('Added 404 handler...');

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

console.log('Server setup complete');