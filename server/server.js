require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();

// Connect Database
connectDB();

// 1. Enhanced CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173'], // Array for multiple origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// 2. Apply CORS middleware
app.use(cors(corsOptions));

// 3. Explicit OPTIONS handler for all routes
app.options('*', cors(corsOptions));

// 4. Pre-flight request logger (for debugging)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('Pre-flight request detected:', req.headers);
  }
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Route imports
const userRoutes = require('./routes/userRoutes');
const clubRoutes = require('./routes/clubRoutes');
const postRoutes = require('./routes/postRoutes');
const homePostRoute = require('./routes/homePostRoute')
const clubAdminRoutes = require('./routes/clubAdminRoutes');


// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/posts', homePostRoute);
app.use('/api', postRoutes);

app.use('/api/clubadmin', clubAdminRoutes);
app.use('/api/applications', require('./routes/clubApplicationRoutes'));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'API running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS Configuration:', corsOptions);
});