const { v4: uuidv4 } = require('uuid');

// Data dummy untuk mobil-mobil yang akan dimodifikasi
let cars = [
    {
        id: uuidv4(),
        brand: "Toyota",
        model: "Supra MK4",
        year: 1998,
        owner: "Ahmad Rizki",
        color: "Deep Blue Metallic",
        engine: "2JZ-GTE",
        horsepower: 320,
        modifications: ["Turbo Upgrade", "Exhaust System", "Cold Air Intake"],
        status: "completed",
        estimatedValue: 850000000,
        images: [
            "https://images.unsplash.com/photo-1544829099-b9a0c5303bea",
            "https://images.unsplash.com/photo-1553440569-bcc63803a83d"
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20')
    },
    {
        id: uuidv4(),
        brand: "Honda",
        model: "Civic Type R FK8",
        year: 2021,
        owner: "Sarah Indira",
        color: "Championship White",
        engine: "K20C1",
        horsepower: 350,
        modifications: ["Body Kit", "Lowering Springs", "Performance Exhaust"],
        status: "in-progress",
        estimatedValue: 750000000,
        images: [
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888"
        ],
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-11-15')
    },
    {
        id: uuidv4(),
        brand: "Mitsubishi",
        model: "Lancer Evolution X",
        year: 2015,
        owner: "Budi Santoso",
        color: "Rally Red",
        engine: "4B11T",
        horsepower: 380,
        modifications: ["Wide Body Kit", "Carbon Fiber Hood", "Racing Seats"],
        status: "planning",
        estimatedValue: 650000000,
        images: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
            "https://images.unsplash.com/photo-1609521263047-f8f205293f24"
        ],
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-20')
    },
    {
        id: uuidv4(),
        brand: "BMW",
        model: "M3 F80",
        year: 2018,
        owner: "Denny Pratama",
        color: "Mineral Grey",
        engine: "S55",
        horsepower: 450,
        modifications: ["Supercharger", "Carbon Fiber Aero", "Sport Suspension"],
        status: "completed",
        estimatedValue: 1200000000,
        images: [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e",
            "https://images.unsplash.com/photo-1570991220280-9ca1d00ce79e"
        ],
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-04-15')
    },
    {
        id: uuidv4(),
        brand: "Nissan",
        model: "Skyline GT-R R34",
        year: 1999,
        owner: "Rizky Fernanda",
        color: "Bayside Blue",
        engine: "RB26DETT",
        horsepower: 500,
        modifications: ["Single Turbo Conversion", "Nismo Parts", "Roll Cage"],
        status: "in-progress",
        estimatedValue: 1500000000,
        images: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
        ],
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-11-18')
    }
];

// Data dummy untuk customers
let customers = [
    {
        id: uuidv4(),
        name: "Ahmad Rizki",
        email: "ahmad.rizki@email.com",
        phone: "+62812345678",
        address: "Jl. Sudirman No. 123, Jakarta Selatan",
        memberSince: new Date('2023-06-15'),
        totalProjects: 3,
        totalSpent: 2500000000,
        loyaltyPoints: 1250,
        preferredServices: ["Performance Upgrade", "Body Modification"],
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2024-11-20')
    },
    {
        id: uuidv4(),
        name: "Sarah Indira",
        email: "sarah.indira@email.com", 
        phone: "+62823456789",
        address: "Jl. Gatot Subroto No. 456, Jakarta Barat",
        memberSince: new Date('2023-08-20'),
        totalProjects: 2,
        totalSpent: 1800000000,
        loyaltyPoints: 900,
        preferredServices: ["Interior Upgrade", "Audio System"],
        createdAt: new Date('2023-08-20'),
        updatedAt: new Date('2024-11-15')
    },
    {
        id: uuidv4(),
        name: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "+62834567890", 
        address: "Jl. Thamrin No. 789, Jakarta Pusat",
        memberSince: new Date('2024-01-10'),
        totalProjects: 1,
        totalSpent: 650000000,
        loyaltyPoints: 325,
        preferredServices: ["Body Kit", "Paint Job"],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-11-01')
    },
    {
        id: uuidv4(),
        name: "Denny Pratama",
        email: "denny.pratama@email.com",
        phone: "+62845678901",
        address: "Jl. Kuningan No. 321, Jakarta Selatan", 
        memberSince: new Date('2023-12-05'),
        totalProjects: 4,
        totalSpent: 3200000000,
        loyaltyPoints: 1600,
        preferredServices: ["Performance Upgrade", "Luxury Modification"],
        createdAt: new Date('2023-12-05'),
        updatedAt: new Date('2024-04-15')
    },
    {
        id: uuidv4(),
        name: "Rizky Fernanda", 
        email: "rizky.fernanda@email.com",
        phone: "+62856789012",
        address: "Jl. Senayan No. 654, Jakarta Selatan",
        memberSince: new Date('2024-09-15'),
        totalProjects: 1,
        totalSpent: 1500000000,
        loyaltyPoints: 750,
        preferredServices: ["JDM Modification", "Track Preparation"],
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-11-18')
    }
];

// Data dummy untuk projects modifikasi
let projects = [
    {
        id: uuidv4(),
        name: "Supra MK4 Beast Mode",
        carId: cars[0].id,
        customerId: customers[0].id,
        description: "Complete performance overhaul untuk Toyota Supra MK4",
        services: ["Engine Tuning", "Turbo Upgrade", "Exhaust System", "Cold Air Intake"],
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-20'),
        estimatedCost: 850000000,
        actualCost: 820000000,
        status: "completed",
        progress: 100,
        technician: "Master Tuner Joko",
        notes: "Project berhasil diselesaikan dengan hasil memuaskan. Power naik dari 320HP ke 450HP.",
        images: [
            "before_supra.jpg",
            "progress_supra.jpg", 
            "after_supra.jpg"
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20')
    },
    {
        id: uuidv4(),
        name: "Civic Type R Street Warrior",
        carId: cars[1].id,
        customerId: customers[1].id,
        description: "Modifikasi body kit dan performance untuk Honda Civic Type R",
        services: ["Body Kit Installation", "Lowering Springs", "Performance Exhaust", "ECU Remap"],
        startDate: new Date('2024-03-10'),
        endDate: null,
        estimatedCost: 750000000,
        actualCost: 600000000,
        status: "in-progress",
        progress: 75,
        technician: "Body Kit Specialist Andi",
        notes: "Sedang dalam tahap pengecatan body kit. Estimasi selesai minggu depan.",
        images: [
            "before_civic.jpg",
            "progress_civic.jpg"
        ],
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-11-15')
    },
    {
        id: uuidv4(),
        name: "Evo X Rally Style", 
        carId: cars[2].id,
        customerId: customers[2].id,
        description: "Wide body kit dan rally preparation untuk Lancer Evolution X",
        services: ["Wide Body Kit", "Carbon Fiber Parts", "Racing Seats", "Roll Cage"],
        startDate: new Date('2024-11-25'),
        endDate: new Date('2025-01-15'),
        estimatedCost: 650000000,
        actualCost: 0,
        status: "planning",
        progress: 5,
        technician: "Carbon Specialist Budi",
        notes: "Project dalam tahap planning. Menunggu part dari Jepang.",
        images: [],
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-20')
    }
];

// Data dummy untuk services yang tersedia
let services = [
    {
        id: uuidv4(),
        name: "Engine Performance Tuning",
        category: "Performance",
        description: "Complete engine tuning untuk maksimalkan performa mesin",
        basePrice: 25000000,
        duration: "7-14 hari",
        difficulty: "Expert",
        popular: true,
        includes: [
            "ECU Remapping",
            "Dyno Testing", 
            "Performance Analysis",
            "Optimization Report"
        ],
        requirements: [
            "Engine dalam kondisi baik",
            "Service history lengkap"
        ],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-11-01')
    },
    {
        id: uuidv4(),
        name: "Custom Body Kit Installation",
        category: "Exterior",
        description: "Pemasangan body kit custom sesuai keinginan customer",
        basePrice: 45000000,
        duration: "14-21 hari",
        difficulty: "Expert",
        popular: true,
        includes: [
            "Design Consultation",
            "Custom Fabrication",
            "Professional Installation", 
            "Paint Matching",
            "Quality Guarantee"
        ],
        requirements: [
            "Vehicle inspection",
            "Design approval"
        ],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-10-15')
    },
    {
        id: uuidv4(),
        name: "Premium Audio System",
        category: "Interior",
        description: "Instalasi sistem audio premium dengan teknologi terdepan",
        basePrice: 35000000,
        duration: "5-7 hari",
        difficulty: "Intermediate", 
        popular: false,
        includes: [
            "High-End Speakers",
            "Amplifier System",
            "Sound Deadening",
            "Custom Installation",
            "Audio Tuning"
        ],
        requirements: [
            "Interior access clearance",
            "Electrical system check"
        ],
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2024-09-20')
    },
    {
        id: uuidv4(),
        name: "Suspension Upgrade",
        category: "Performance",
        description: "Upgrade sistem suspensi untuk handling dan comfort yang optimal",
        basePrice: 30000000,
        duration: "3-5 hari",
        difficulty: "Advanced",
        popular: true,
        includes: [
            "Premium Coilovers",
            "Alignment Service",
            "Road Testing",
            "Setup Optimization"
        ],
        requirements: [
            "Suspension inspection",
            "Wheel alignment check"
        ],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-11-10')
    },
    {
        id: uuidv4(),
        name: "Exhaust System Custom",
        category: "Performance", 
        description: "Custom exhaust system untuk performa dan sound yang optimal",
        basePrice: 20000000,
        duration: "3-7 hari",
        difficulty: "Advanced",
        popular: true,
        includes: [
            "Custom Fabrication",
            "Stainless Steel Material",
            "Sound Testing",
            "Performance Optimization"
        ],
        requirements: [
            "Emission compliance check",
            "Local regulation review"
        ],
        createdAt: new Date('2023-01-10'),
        updatedAt: new Date('2024-11-05')
    }
];

module.exports = {
    cars,
    customers,
    projects,
    services
};