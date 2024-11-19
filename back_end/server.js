const express = require('express');
const topicsRoutes = require('./routes/topicsRoutes');
const cors = require('cors'); // Enable cross-origin requests (for frontend-backend communication)
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // Ensure this path is correct
const userRoutes = require('./routes/userRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');




const app = express();
dotenv.config();
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Routes
app.use('/api/topics', topicsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscribeRoutes);





const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
