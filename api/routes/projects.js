const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { projects, cars, customers } = require('../data/dummy-data');

const router = express.Router();

// GET /api/projects - Ambil semua data project
router.get('/', (req, res) => {
    try {
        const { page = 1, limit = 10, status, technician } = req.query;
        
        let filteredProjects = [...projects];
        
        // Filter berdasarkan status
        if (status) {
            filteredProjects = filteredProjects.filter(project => 
                project.status.toLowerCase() === status.toLowerCase()
            );
        }
        
        // Filter berdasarkan technician
        if (technician) {
            filteredProjects = filteredProjects.filter(project => 
                project.technician.toLowerCase().includes(technician.toLowerCase())
            );
        }
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
        
        // Tambahkan data mobil dan customer
        const enrichedProjects = paginatedProjects.map(project => {
            const car = cars.find(c => c.id === project.carId);
            const customer = customers.find(c => c.id === project.customerId);
            
            return {
                ...project,
                car: car ? { brand: car.brand, model: car.model, year: car.year } : null,
                customer: customer ? { name: customer.name, email: customer.email } : null
            };
        });
        
        res.status(200).json({
            success: true,
            message: 'Data project berhasil diambil',
            data: enrichedProjects,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredProjects.length / limit),
                totalItems: filteredProjects.length,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data project',
            error: error.message
        });
    }
});

// GET /api/projects/:id - Ambil data project berdasarkan ID
router.get('/:id', (req, res) => {
    try {
        const project = projects.find(p => p.id === req.params.id);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project tidak ditemukan'
            });
        }
        
        // Tambahkan data mobil dan customer
        const car = cars.find(c => c.id === project.carId);
        const customer = customers.find(c => c.id === project.customerId);
        
        const enrichedProject = {
            ...project,
            car: car || null,
            customer: customer || null
        };
        
        res.status(200).json({
            success: true,
            message: 'Data project berhasil diambil',
            data: enrichedProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data project',
            error: error.message
        });
    }
});

// POST /api/projects - Tambah project baru
router.post('/', (req, res) => {
    try {
        const { name, carId, customerId, description, services, startDate, endDate, estimatedCost, technician } = req.body;
        
        // Validasi input
        if (!name || !carId || !customerId || !description) {
            return res.status(400).json({
                success: false,
                message: 'Name, carId, customerId, dan description wajib diisi'
            });
        }
        
        // Validasi apakah car dan customer ada
        const car = cars.find(c => c.id === carId);
        const customer = customers.find(c => c.id === customerId);
        
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Mobil tidak ditemukan'
            });
        }
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer tidak ditemukan'
            });
        }
        
        const newProject = {
            id: uuidv4(),
            name,
            carId,
            customerId,
            description,
            services: services || [],
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : null,
            estimatedCost: parseInt(estimatedCost) || 0,
            actualCost: 0,
            status: 'planning',
            progress: 0,
            technician: technician || 'Belum ditentukan',
            notes: '',
            images: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        projects.push(newProject);
        
        res.status(201).json({
            success: true,
            message: 'Project berhasil ditambahkan',
            data: newProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan project',
            error: error.message
        });
    }
});

// PUT /api/projects/:id - Update data project
router.put('/:id', (req, res) => {
    try {
        const projectIndex = projects.findIndex(p => p.id === req.params.id);
        
        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Project tidak ditemukan'
            });
        }
        
        const { name, description, services, startDate, endDate, estimatedCost, actualCost, status, progress, technician, notes, images } = req.body;
        
        const updatedProject = {
            ...projects[projectIndex],
            name: name || projects[projectIndex].name,
            description: description || projects[projectIndex].description,
            services: services || projects[projectIndex].services,
            startDate: startDate ? new Date(startDate) : projects[projectIndex].startDate,
            endDate: endDate ? new Date(endDate) : projects[projectIndex].endDate,
            estimatedCost: estimatedCost !== undefined ? parseInt(estimatedCost) : projects[projectIndex].estimatedCost,
            actualCost: actualCost !== undefined ? parseInt(actualCost) : projects[projectIndex].actualCost,
            status: status || projects[projectIndex].status,
            progress: progress !== undefined ? parseInt(progress) : projects[projectIndex].progress,
            technician: technician || projects[projectIndex].technician,
            notes: notes !== undefined ? notes : projects[projectIndex].notes,
            images: images || projects[projectIndex].images,
            updatedAt: new Date()
        };
        
        projects[projectIndex] = updatedProject;
        
        res.status(200).json({
            success: true,
            message: 'Data project berhasil diupdate',
            data: updatedProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate data project',
            error: error.message
        });
    }
});

// DELETE /api/projects/:id - Hapus project
router.delete('/:id', (req, res) => {
    try {
        const projectIndex = projects.findIndex(p => p.id === req.params.id);
        
        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Project tidak ditemukan'
            });
        }
        
        const deletedProject = projects[projectIndex];
        projects.splice(projectIndex, 1);
        
        res.status(200).json({
            success: true,
            message: 'Project berhasil dihapus',
            data: deletedProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus project',
            error: error.message
        });
    }
});

// GET /api/projects/stats/dashboard - Statistik project untuk dashboard
router.get('/stats/dashboard', (req, res) => {
    try {
        const stats = {
            totalProjects: projects.length,
            completedProjects: projects.filter(p => p.status === 'completed').length,
            inProgressProjects: projects.filter(p => p.status === 'in-progress').length,
            planningProjects: projects.filter(p => p.status === 'planning').length,
            totalRevenue: projects.reduce((sum, p) => sum + p.actualCost, 0),
            estimatedRevenue: projects.reduce((sum, p) => sum + p.estimatedCost, 0),
            averageProgress: projects.reduce((sum, p) => sum + p.progress, 0) / projects.length || 0,
            recentProjects: projects
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    status: p.status,
                    progress: p.progress,
                    createdAt: p.createdAt
                }))
        };
        
        res.status(200).json({
            success: true,
            message: 'Statistik project berhasil diambil',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil statistik project',
            error: error.message
        });
    }
});

module.exports = router;