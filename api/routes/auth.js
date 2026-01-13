const express = require('express');
const { customers } = require('../data/dummy-data');

const router = express.Router();

// POST /api/auth/login - Login simulation
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            });
        }
        
        // Demo credentials untuk testing
        if (email === 'user@utb.ac.id' && password === 'utsweb1') {
            const demoUser = {
                id: 'demo-user-123',
                name: 'Demo User Garasifyy',
                email: 'user@utb.ac.id',
                role: 'customer',
                memberSince: new Date('2024-01-01'),
                loyaltyPoints: 500
            };
            
            return res.status(200).json({
                success: true,
                message: 'Login berhasil',
                data: {
                    user: demoUser,
                    token: 'demo-jwt-token-' + Date.now(),
                    expiresIn: '24h'
                }
            });
        }
        
        // Check customer database
        const customer = customers.find(c => c.email === email);
        
        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }
        
        // In real app, you would hash and compare passwords
        // For demo, we'll accept any password for existing customers
        const loginUser = {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            role: 'customer',
            memberSince: customer.memberSince,
            loyaltyPoints: customer.loyaltyPoints
        };
        
        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                user: loginUser,
                token: 'jwt-token-' + customer.id + '-' + Date.now(),
                expiresIn: '24h'
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal melakukan login',
            error: error.message
        });
    }
});

// POST /api/auth/register - Register new customer
router.post('/register', (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        // Validasi input
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password, dan phone wajib diisi'
            });
        }
        
        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }
        
        // Validasi password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password minimal 6 karakter'
            });
        }
        
        // Check existing customer
        const existingCustomer = customers.find(c => c.email === email);
        if (existingCustomer) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }
        
        // Create new customer (in real app, hash password first)
        const newCustomer = {
            id: require('uuid').v4(),
            name,
            email,
            phone,
            address: address || '',
            memberSince: new Date(),
            totalProjects: 0,
            totalSpent: 0,
            loyaltyPoints: 100, // Welcome bonus points
            preferredServices: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        customers.push(newCustomer);
        
        const registerUser = {
            id: newCustomer.id,
            name: newCustomer.name,
            email: newCustomer.email,
            role: 'customer',
            memberSince: newCustomer.memberSince,
            loyaltyPoints: newCustomer.loyaltyPoints
        };
        
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: {
                user: registerUser,
                token: 'jwt-token-' + newCustomer.id + '-' + Date.now(),
                expiresIn: '24h'
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal melakukan registrasi',
            error: error.message
        });
    }
});

// POST /api/auth/logout - Logout simulation
router.post('/logout', (req, res) => {
    try {
        // In real app, you would invalidate the token
        res.status(200).json({
            success: true,
            message: 'Logout berhasil'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal melakukan logout',
            error: error.message
        });
    }
});

// GET /api/auth/me - Get current user (requires token in real app)
router.get('/me', (req, res) => {
    try {
        // Simulate getting user from token
        // In real app, you would decode JWT token
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan'
            });
        }
        
        // Demo response for valid token
        const demoUser = {
            id: 'demo-user-123',
            name: 'Demo User Garasifyy',
            email: 'user@utb.ac.id',
            role: 'customer',
            memberSince: new Date('2024-01-01'),
            loyaltyPoints: 500,
            totalProjects: 2,
            totalSpent: 150000000
        };
        
        res.status(200).json({
            success: true,
            message: 'Data user berhasil diambil',
            data: demoUser
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data user',
            error: error.message
        });
    }
});

module.exports = router;