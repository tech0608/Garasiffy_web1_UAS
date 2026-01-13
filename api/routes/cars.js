const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { cars } = require('../data/dummy-data');

const router = express.Router();

// GET /api/cars - Ambil semua data mobil
router.get('/', (req, res) => {
    try {
        // Query parameters untuk filtering dan pagination
        const { page = 1, limit = 10, brand, status, owner } = req.query;
        
        let filteredCars = [...cars];
        
        // Filter berdasarkan brand
        if (brand) {
            filteredCars = filteredCars.filter(car => 
                car.brand.toLowerCase().includes(brand.toLowerCase())
            );
        }
        
        // Filter berdasarkan status
        if (status) {
            filteredCars = filteredCars.filter(car => 
                car.status.toLowerCase() === status.toLowerCase()
            );
        }
        
        // Filter berdasarkan owner
        if (owner) {
            filteredCars = filteredCars.filter(car => 
                car.owner.toLowerCase().includes(owner.toLowerCase())
            );
        }
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedCars = filteredCars.slice(startIndex, endIndex);
        
        res.status(200).json({
            success: true,
            message: 'Data mobil berhasil diambil',
            data: paginatedCars,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredCars.length / limit),
                totalItems: filteredCars.length,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data mobil',
            error: error.message
        });
    }
});

// GET /api/cars/:id - Ambil data mobil berdasarkan ID
router.get('/:id', (req, res) => {
    try {
        const car = cars.find(c => c.id === req.params.id);
        
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Mobil tidak ditemukan'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Data mobil berhasil diambil',
            data: car
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data mobil',
            error: error.message
        });
    }
});

// POST /api/cars - Tambah mobil baru
router.post('/', (req, res) => {
    try {
        const { brand, model, year, owner, color, engine, horsepower, modifications, estimatedValue, images } = req.body;
        
        // Validasi input
        if (!brand || !model || !year || !owner) {
            return res.status(400).json({
                success: false,
                message: 'Brand, model, year, dan owner wajib diisi'
            });
        }
        
        const newCar = {
            id: uuidv4(),
            brand,
            model,
            year: parseInt(year),
            owner,
            color: color || 'Unknown',
            engine: engine || 'Unknown',
            horsepower: parseInt(horsepower) || 0,
            modifications: modifications || [],
            status: 'planning',
            estimatedValue: parseInt(estimatedValue) || 0,
            images: images || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        cars.push(newCar);
        
        res.status(201).json({
            success: true,
            message: 'Mobil berhasil ditambahkan',
            data: newCar
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan mobil',
            error: error.message
        });
    }
});

// PUT /api/cars/:id - Update data mobil
router.put('/:id', (req, res) => {
    try {
        const carIndex = cars.findIndex(c => c.id === req.params.id);
        
        if (carIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Mobil tidak ditemukan'
            });
        }
        
        const { brand, model, year, owner, color, engine, horsepower, modifications, status, estimatedValue, images } = req.body;
        
        // Update data mobil
        const updatedCar = {
            ...cars[carIndex],
            brand: brand || cars[carIndex].brand,
            model: model || cars[carIndex].model,
            year: year ? parseInt(year) : cars[carIndex].year,
            owner: owner || cars[carIndex].owner,
            color: color || cars[carIndex].color,
            engine: engine || cars[carIndex].engine,
            horsepower: horsepower ? parseInt(horsepower) : cars[carIndex].horsepower,
            modifications: modifications || cars[carIndex].modifications,
            status: status || cars[carIndex].status,
            estimatedValue: estimatedValue ? parseInt(estimatedValue) : cars[carIndex].estimatedValue,
            images: images || cars[carIndex].images,
            updatedAt: new Date()
        };
        
        cars[carIndex] = updatedCar;
        
        res.status(200).json({
            success: true,
            message: 'Data mobil berhasil diupdate',
            data: updatedCar
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate data mobil',
            error: error.message
        });
    }
});

// DELETE /api/cars/:id - Hapus mobil
router.delete('/:id', (req, res) => {
    try {
        const carIndex = cars.findIndex(c => c.id === req.params.id);
        
        if (carIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Mobil tidak ditemukan'
            });
        }
        
        const deletedCar = cars[carIndex];
        cars.splice(carIndex, 1);
        
        res.status(200).json({
            success: true,
            message: 'Mobil berhasil dihapus',
            data: deletedCar
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus mobil',
            error: error.message
        });
    }
});

// GET /api/cars/stats - Statistik mobil
router.get('/stats/summary', (req, res) => {
    try {
        const stats = {
            totalCars: cars.length,
            completedProjects: cars.filter(car => car.status === 'completed').length,
            inProgressProjects: cars.filter(car => car.status === 'in-progress').length,
            planningProjects: cars.filter(car => car.status === 'planning').length,
            brandDistribution: {},
            averageValue: 0,
            totalValue: 0
        };
        
        // Hitung distribusi brand
        cars.forEach(car => {
            stats.brandDistribution[car.brand] = (stats.brandDistribution[car.brand] || 0) + 1;
        });
        
        // Hitung total dan rata-rata value
        stats.totalValue = cars.reduce((sum, car) => sum + car.estimatedValue, 0);
        stats.averageValue = stats.totalValue / cars.length || 0;
        
        res.status(200).json({
            success: true,
            message: 'Statistik mobil berhasil diambil',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil statistik',
            error: error.message
        });
    }
});

module.exports = router;