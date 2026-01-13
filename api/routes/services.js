const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { services } = require('../data/dummy-data');

const router = express.Router();

// GET /api/services - Ambil semua data service
router.get('/', (req, res) => {
    try {
        const { page = 1, limit = 10, category, popular, difficulty } = req.query;
        
        let filteredServices = [...services];
        
        // Filter berdasarkan category
        if (category) {
            filteredServices = filteredServices.filter(service => 
                service.category.toLowerCase() === category.toLowerCase()
            );
        }
        
        // Filter berdasarkan popular
        if (popular !== undefined) {
            const isPopular = popular.toLowerCase() === 'true';
            filteredServices = filteredServices.filter(service => 
                service.popular === isPopular
            );
        }
        
        // Filter berdasarkan difficulty
        if (difficulty) {
            filteredServices = filteredServices.filter(service => 
                service.difficulty.toLowerCase() === difficulty.toLowerCase()
            );
        }
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedServices = filteredServices.slice(startIndex, endIndex);
        
        res.status(200).json({
            success: true,
            message: 'Data service berhasil diambil',
            data: paginatedServices,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredServices.length / limit),
                totalItems: filteredServices.length,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data service',
            error: error.message
        });
    }
});

// GET /api/services/:id - Ambil data service berdasarkan ID
router.get('/:id', (req, res) => {
    try {
        const service = services.find(s => s.id === req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service tidak ditemukan'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Data service berhasil diambil',
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data service',
            error: error.message
        });
    }
});

// POST /api/services - Tambah service baru
router.post('/', (req, res) => {
    try {
        const { name, category, description, basePrice, duration, difficulty, includes, requirements } = req.body;
        
        // Validasi input
        if (!name || !category || !description || !basePrice) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, description, dan basePrice wajib diisi'
            });
        }
        
        // Validasi category
        const validCategories = ['Performance', 'Exterior', 'Interior', 'Maintenance'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Category harus salah satu dari: ${validCategories.join(', ')}`
            });
        }
        
        // Validasi difficulty
        const validDifficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        if (difficulty && !validDifficulties.includes(difficulty)) {
            return res.status(400).json({
                success: false,
                message: `Difficulty harus salah satu dari: ${validDifficulties.join(', ')}`
            });
        }
        
        const newService = {
            id: uuidv4(),
            name,
            category,
            description,
            basePrice: parseInt(basePrice),
            duration: duration || '1-3 hari',
            difficulty: difficulty || 'Intermediate',
            popular: false,
            includes: includes || [],
            requirements: requirements || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        services.push(newService);
        
        res.status(201).json({
            success: true,
            message: 'Service berhasil ditambahkan',
            data: newService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan service',
            error: error.message
        });
    }
});

// PUT /api/services/:id - Update data service
router.put('/:id', (req, res) => {
    try {
        const serviceIndex = services.findIndex(s => s.id === req.params.id);
        
        if (serviceIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Service tidak ditemukan'
            });
        }
        
        const { name, category, description, basePrice, duration, difficulty, popular, includes, requirements } = req.body;
        
        // Validasi category jika diubah
        if (category) {
            const validCategories = ['Performance', 'Exterior', 'Interior', 'Maintenance'];
            if (!validCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: `Category harus salah satu dari: ${validCategories.join(', ')}`
                });
            }
        }
        
        // Validasi difficulty jika diubah
        if (difficulty) {
            const validDifficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
            if (!validDifficulties.includes(difficulty)) {
                return res.status(400).json({
                    success: false,
                    message: `Difficulty harus salah satu dari: ${validDifficulties.join(', ')}`
                });
            }
        }
        
        const updatedService = {
            ...services[serviceIndex],
            name: name || services[serviceIndex].name,
            category: category || services[serviceIndex].category,
            description: description || services[serviceIndex].description,
            basePrice: basePrice !== undefined ? parseInt(basePrice) : services[serviceIndex].basePrice,
            duration: duration || services[serviceIndex].duration,
            difficulty: difficulty || services[serviceIndex].difficulty,
            popular: popular !== undefined ? popular : services[serviceIndex].popular,
            includes: includes || services[serviceIndex].includes,
            requirements: requirements || services[serviceIndex].requirements,
            updatedAt: new Date()
        };
        
        services[serviceIndex] = updatedService;
        
        res.status(200).json({
            success: true,
            message: 'Data service berhasil diupdate',
            data: updatedService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate data service',
            error: error.message
        });
    }
});

// DELETE /api/services/:id - Hapus service
router.delete('/:id', (req, res) => {
    try {
        const serviceIndex = services.findIndex(s => s.id === req.params.id);
        
        if (serviceIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Service tidak ditemukan'
            });
        }
        
        const deletedService = services[serviceIndex];
        services.splice(serviceIndex, 1);
        
        res.status(200).json({
            success: true,
            message: 'Service berhasil dihapus',
            data: deletedService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus service',
            error: error.message
        });
    }
});

// GET /api/services/popular/list - Ambil service populer
router.get('/popular/list', (req, res) => {
    try {
        const { limit = 5 } = req.query;
        
        const popularServices = services
            .filter(service => service.popular)
            .sort((a, b) => b.basePrice - a.basePrice)
            .slice(0, parseInt(limit))
            .map(service => ({
                id: service.id,
                name: service.name,
                category: service.category,
                basePrice: service.basePrice,
                duration: service.duration,
                difficulty: service.difficulty
            }));
        
        res.status(200).json({
            success: true,
            message: 'Service populer berhasil diambil',
            data: popularServices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil service populer',
            error: error.message
        });
    }
});

// GET /api/services/categories/list - Ambil daftar kategori
router.get('/categories/list', (req, res) => {
    try {
        const categories = [...new Set(services.map(service => service.category))];
        const categoryStats = categories.map(category => {
            const categoryServices = services.filter(s => s.category === category);
            return {
                category,
                count: categoryServices.length,
                averagePrice: categoryServices.reduce((sum, s) => sum + s.basePrice, 0) / categoryServices.length || 0,
                popularCount: categoryServices.filter(s => s.popular).length
            };
        });
        
        res.status(200).json({
            success: true,
            message: 'Kategori service berhasil diambil',
            data: categoryStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil kategori service',
            error: error.message
        });
    }
});

module.exports = router;