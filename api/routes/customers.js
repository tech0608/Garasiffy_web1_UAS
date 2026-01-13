const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { customers } = require('../data/dummy-data');

const router = express.Router();

// GET /api/customers - Ambil semua data customer
router.get('/', (req, res) => {
    try {
        const { page = 1, limit = 10, search, sortBy = 'name', order = 'asc' } = req.query;
        
        let filteredCustomers = [...customers];
        
        // Search berdasarkan nama atau email
        if (search) {
            filteredCustomers = filteredCustomers.filter(customer => 
                customer.name.toLowerCase().includes(search.toLowerCase()) ||
                customer.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        // Sorting
        filteredCustomers.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (order === 'desc') {
                return aValue < bValue ? 1 : -1;
            }
            return aValue > bValue ? 1 : -1;
        });
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
        
        res.status(200).json({
            success: true,
            message: 'Data customer berhasil diambil',
            data: paginatedCustomers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredCustomers.length / limit),
                totalItems: filteredCustomers.length,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data customer',
            error: error.message
        });
    }
});

// GET /api/customers/:id - Ambil data customer berdasarkan ID
router.get('/:id', (req, res) => {
    try {
        const customer = customers.find(c => c.id === req.params.id);
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer tidak ditemukan'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Data customer berhasil diambil',
            data: customer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data customer',
            error: error.message
        });
    }
});

// POST /api/customers - Tambah customer baru
router.post('/', (req, res) => {
    try {
        const { name, email, phone, address, preferredServices } = req.body;
        
        // Validasi input
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Nama, email, dan phone wajib diisi'
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
        
        // Cek apakah email sudah ada
        const existingCustomer = customers.find(c => c.email === email);
        if (existingCustomer) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }
        
        const newCustomer = {
            id: uuidv4(),
            name,
            email,
            phone,
            address: address || '',
            memberSince: new Date(),
            totalProjects: 0,
            totalSpent: 0,
            loyaltyPoints: 0,
            preferredServices: preferredServices || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        customers.push(newCustomer);
        
        res.status(201).json({
            success: true,
            message: 'Customer berhasil ditambahkan',
            data: newCustomer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan customer',
            error: error.message
        });
    }
});

// PUT /api/customers/:id - Update data customer
router.put('/:id', (req, res) => {
    try {
        const customerIndex = customers.findIndex(c => c.id === req.params.id);
        
        if (customerIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Customer tidak ditemukan'
            });
        }
        
        const { name, email, phone, address, preferredServices, totalProjects, totalSpent, loyaltyPoints } = req.body;
        
        // Validasi email jika diubah
        if (email && email !== customers[customerIndex].email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Format email tidak valid'
                });
            }
            
            const existingCustomer = customers.find(c => c.email === email);
            if (existingCustomer) {
                return res.status(409).json({
                    success: false,
                    message: 'Email sudah terdaftar'
                });
            }
        }
        
        const updatedCustomer = {
            ...customers[customerIndex],
            name: name || customers[customerIndex].name,
            email: email || customers[customerIndex].email,
            phone: phone || customers[customerIndex].phone,
            address: address || customers[customerIndex].address,
            preferredServices: preferredServices || customers[customerIndex].preferredServices,
            totalProjects: totalProjects !== undefined ? parseInt(totalProjects) : customers[customerIndex].totalProjects,
            totalSpent: totalSpent !== undefined ? parseInt(totalSpent) : customers[customerIndex].totalSpent,
            loyaltyPoints: loyaltyPoints !== undefined ? parseInt(loyaltyPoints) : customers[customerIndex].loyaltyPoints,
            updatedAt: new Date()
        };
        
        customers[customerIndex] = updatedCustomer;
        
        res.status(200).json({
            success: true,
            message: 'Data customer berhasil diupdate',
            data: updatedCustomer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate data customer',
            error: error.message
        });
    }
});

// DELETE /api/customers/:id - Hapus customer
router.delete('/:id', (req, res) => {
    try {
        const customerIndex = customers.findIndex(c => c.id === req.params.id);
        
        if (customerIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Customer tidak ditemukan'
            });
        }
        
        const deletedCustomer = customers[customerIndex];
        customers.splice(customerIndex, 1);
        
        res.status(200).json({
            success: true,
            message: 'Customer berhasil dihapus',
            data: deletedCustomer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus customer',
            error: error.message
        });
    }
});

// GET /api/customers/loyalty/top - Top loyalty customers
router.get('/loyalty/top', (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        const topCustomers = customers
            .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
            .slice(0, parseInt(limit))
            .map(customer => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                loyaltyPoints: customer.loyaltyPoints,
                totalSpent: customer.totalSpent,
                totalProjects: customer.totalProjects,
                memberSince: customer.memberSince
            }));
        
        res.status(200).json({
            success: true,
            message: 'Top loyalty customers berhasil diambil',
            data: topCustomers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data loyalty customers',
            error: error.message
        });
    }
});

module.exports = router;