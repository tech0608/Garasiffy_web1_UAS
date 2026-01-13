const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const carsRoutes = require('./routes/cars');
const customersRoutes = require('./routes/customers');
const projectsRoutes = require('./routes/projects');
const servicesRoutes = require('./routes/services');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Info endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Garasifyy API - Car Modification Management System',
        version: '1.0.0',
        author: '23552011045_Luthfy Arief_TIF_RP_23_CNS_A',
        endpoints: {
            cars: '/api/cars',
            customers: '/api/customers', 
            projects: '/api/projects',
            services: '/api/services',
            auth: '/api/auth'
        },
        documentation: 'https://github.com/your-username/garasifyy-api'
    });
});

// Routes
app.use('/api/cars', carsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /api/cars',
            'POST /api/cars',
            'GET /api/customers',
            'POST /api/customers',
            'GET /api/projects',
            'POST /api/projects',
            'GET /api/services',
            'POST /api/services'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚗 Garasifyy API Server running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}`);
    console.log(`📚 Documentation: http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;