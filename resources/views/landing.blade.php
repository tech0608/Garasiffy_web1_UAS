<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Garasifyy | Premium Auto Modification</title>
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary-red: #d32f2f;
            --dark-bg: #121212;
            --card-bg: #1e1e2d;
            --text-light: #ffffff;
            --text-dim: #a0a0a0;
        }

        body {
            background-color: var(--dark-bg);
            color: var(--text-light);
            font-family: 'Roboto', sans-serif;
            overflow-x: hidden;
        }

        /* Navbar */
        .navbar {
            background-color: rgba(18, 18, 18, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #2c2c35;
        }
        
        .navbar-brand {
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
            font-size: 1.5rem;
            color: var(--text-light) !important;
        }

        .navbar-brand span {
            color: var(--primary-red);
        }

        /* Hero Section */
        .hero-section {
            position: relative;
            height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1605515298946-d062f2e9da53?q=80&w=2070&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }

        .hero-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 3.5rem;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            opacity: 0;
            animation: slideUp 1s ease forwards;
        }

        .hero-subtitle {
            font-size: 1.2rem;
            color: var(--text-dim);
            margin-bottom: 2.5rem;
            max-width: 600px;
            opacity: 0;
            animation: slideUp 1s ease 0.3s forwards;
        }

        .btn-custom {
            background-color: var(--primary-red);
            color: white;
            padding: 12px 35px;
            border-radius: 50px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: all 0.3s ease;
            border: none;
            opacity: 0;
            animation: slideUp 1s ease 0.6s forwards;
            text-decoration: none;
            display: inline-block;
        }

        .btn-custom:hover {
            background-color: #b71c1c;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(211, 47, 47, 0.3);
            color: white;
        }

        .btn-outline-custom {
            background: transparent;
            border: 2px solid white;
            color: white;
            padding: 10px 30px;
            border-radius: 50px;
            font-weight: 600;
            text-decoration: none;
            margin-left: 15px;
            transition: all 0.3s;
            opacity: 0;
            animation: slideUp 1s ease 0.8s forwards;
            display: inline-block;
        }

        .btn-outline-custom:hover {
            background: white;
            color: var(--dark-bg);
        }

        /* Features */
        .features-section {
            padding: 100px 0;
            background-color: var(--dark-bg);
        }

        .feature-card {
            background-color: var(--card-bg);
            border: 1px solid #2c2c35;
            padding: 40px 30px;
            border-radius: 15px;
            transition: 0.3s;
            height: 100%;
            text-align: center;
        }

        .feature-card:hover {
            transform: translateY(-10px);
            border-color: var(--primary-red);
        }

        .feature-icon {
            font-size: 3rem;
            color: var(--primary-red);
            margin-bottom: 25px;
        }

        .feature-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.25rem;
            margin-bottom: 15px;
        }

        .feature-text {
            color: var(--text-dim);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        /* Footer */
        footer {
            background-color: #0f0f13;
            padding: 40px 0;
            border-top: 1px solid #2c2c35;
            text-align: center;
        }

        /* Animations */
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            .hero-section {
                text-align: center;
                justify-content: center;
            }
            .hero-subtitle {
                margin-left: auto;
                margin-right: auto;
            }
        }
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="#">GARASI<span>FYY</span></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item"><a class="nav-link text-white" href="#services">Layanan</a></li>
                    <li class="nav-item"><a class="nav-link text-white" href="#about">Tentang Kami</a></li>
                    <li class="nav-item ms-lg-3">
                        <a href="{{ route('login') }}" class="btn btn-sm btn-outline-light px-4 rounded-pill">Login Admin</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="hero-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <h1 class="hero-title">Bangun Mobil<br>Impian Anda.</h1>
                    <p class="hero-subtitle">Bengkel modifikasi profesional dengan standar kualitas tertinggi. Kustomisasi eksterior, upgrade performa, dan detailing premium untuk kendaraan kesayangan Anda.</p>
                    <div>
                        <a href="{{ route('login') }}" class="btn-custom">Mulai Proyek</a>
                        <a href="#services" class="btn-outline-custom">Lihat Layanan</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services -->
    <section id="services" class="features-section">
        <div class="container">
            <div class="row text-center mb-5">
                <div class="col-12">
                    <h2 class="hero-title" style="font-size: 2.5rem; animation: none; opacity: 1;">Layanan Kami</h2>
                    <p class="text-secondary">Solusi lengkap untuk kebutuhan modifikasi Anda</p>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="feature-card">
                        <i class="fas fa-paint-roller feature-icon"></i>
                        <h3 class="feature-title">Body Custom</h3>
                        <p class="feature-text">Transformasi tampilan eksterior dengan body kit custom, repainting, dan carbon parts berkualitas tinggi.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card">
                        <i class="fas fa-tachometer-alt feature-icon"></i>
                        <h3 class="feature-title">Performance Tuning</h3>
                        <p class="feature-text">Tingkatkan performa mesin Anda dengan remap ECU, turbo installation, dan upgrade sistem exhaust.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="feature-card">
                        <i class="fas fa-tools feature-icon"></i>
                        <h3 class="feature-title">Maintenance</h3>
                        <p class="feature-text">Perawatan rutin dan servis berkala untuk menjaga kondisi mobil modifikasi Anda tetap prima.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h4 class="navbar-brand mb-3">GARASI<span>FYY</span></h4>
                    <p class="text-secondary small mb-4">Jl. Teknologi No.12, Bandung, Indonesia</p>
                    <div class="lc-block mb-4">
                        <a class="text-decoration-none mx-2 text-secondary" href="#"><i class="fab fa-instagram"></i></a>
                        <a class="text-decoration-none mx-2 text-secondary" href="#"><i class="fab fa-facebook"></i></a>
                        <a class="text-decoration-none mx-2 text-secondary" href="#"><i class="fab fa-whatsapp"></i></a>
                    </div>
                    <p class="text-secondary small opacity-50">© 2026 Garasifyy. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
