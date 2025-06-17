// 1DiKLxxp2nuo6QnA

// mongodb+srv://nirttech:1DiKLxxp2nuo6QnA@cluster0.toreugz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const clubAdminRoutes = require('./routes/clubAdminRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');
const path = require('path');


// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// Serve static files

app.use(express.static('public'));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// fall back route
// app.use((req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });
// error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Campus Link API Running');
});
// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Define Routes (we'll add these later)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/clubadmin', require('./routes/clubAdminRoutes'));
// app.use('/api/posts', postRoutes);

app.use('/api', postRoutes);
// app.use('/api/users', require('./routes/api/users'))
// app.use('/api/clubs', require('./routes/api/clubs'));
// app.use('/api/posts', require('./routes/api/posts'));

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));