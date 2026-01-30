<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Garasifyy</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link href="{{ asset('css/admin.css') }}" rel="stylesheet">
    <!-- SheetJS for Excel Export -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <!-- jsPDF for PDF Export -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
    <!-- FileSaver.js for reliable file downloads -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <!-- SweetAlert2 for Premium Alerts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.1);
            border-left-color: #d32f2f;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #6c757d;
        }
        .empty-state i {
            display: block;
            margin-bottom: 15px;
            opacity: 0.5;
        }

        /* Premium Details: Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1e1e2d; 
        }
        ::-webkit-scrollbar-thumb {
            background: #444; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #d32f2f; 
        }

        /* Premium Details: Red Focus Ring */
        .form-control:focus, .form-select:focus, .btn-close:focus {
            border-color: #d32f2f;
            box-shadow: 0 0 0 0.25rem rgba(211, 47, 47, 0.25);
        }

        /* --- Full Width Header Fixes --- */
        body {
            padding-top: 60px; /* Space for fixed navbar */
        }
        
        #sidebar-wrapper {
            top: 60px; /* Push sidebar down */
            height: calc(100vh - 60px);
            z-index: 1000;
        }

        .navbar.fixed-top {
            z-index: 1040;
            background-color: #1e1e2d !important; /* Match card bg for seamless look */
            height: 60px;
        }

        /* --- Fixed Footer --- */
        .footer-fixed {
            position: fixed;
            bottom: 0;
            right: 0;
            left: 250px; /* Match Desktop Sidebar */
            z-index: 1030;
            background-color: #0f0f13; /* Darker bg for contrast */
            border-top: 1px solid #2c2c35;
        }

        /* Mobile Adjustments */
        @media (max-width: 991.98px) {
            .footer-fixed {
                left: 0; /* Full width on mobile */
            }
        }
        
        /* content padding so footer doesn't cover content */
        #page-content-wrapper {
             padding-bottom: 60px;
        }

    </style>

    <!-- Firebase SDK - Connected to same database as mobile app -->
    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
        import { getFirestore, collection, query, onSnapshot, orderBy, doc, updateDoc, addDoc, deleteDoc, getDocs, getDoc, where, setDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

        // Firebase configuration - SAME AS MOBILE APP PROJECT
        const firebaseConfig = {
            apiKey: "AIzaSyCOaRCFiH--lrTQgaTdh-6HyqM0_DY2DB4",
            authDomain: "garasifyy.firebaseapp.com",
            projectId: "garasifyy",
            storageBucket: "garasifyy.firebasestorage.app",
            messagingSenderId: "189603872814",
            appId: "1:189603872814:web:65708c604ad6e9ee1ddfbf",
            measurementId: "G-JH69VW685Y"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log('🔥 Firebase connected to project: garasifyy (same as mobile app)');

        // Make Firebase available globally for admin.js
        window.firebaseDb = db;
        window.firebaseModules = { collection, query, onSnapshot, orderBy, doc, updateDoc, addDoc, deleteDoc, getDocs, getDoc, where, setDoc, Timestamp };

        // Notify that Firebase is ready
        window.dispatchEvent(new Event('firebase-ready'));
    </script>
</head>


<body class="admin-body">

    <!-- Fixed Top Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom shadow-sm fixed-top">
        <div class="container-fluid">
            <!-- Sidebar Toggle -->
            <button class="btn btn-outline-light me-3" id="sidebarToggle">
                <i class="fas fa-bars"></i>
            </button>
            
            <!-- Brand -->
            <a class="navbar-brand fw-bold me-auto" href="#">
                GARASI<span class="text-danger">FYY</span> <span class="d-none d-md-inline text-secondary small ms-2">| Admin Panel</span>
            </a>

            <!-- User Menu -->
            <div class="d-flex align-items-center">
                <div class="dropdown">
                    <span class="nav-link text-light dropdown-toggle cp" role="button" data-bs-toggle="dropdown" style="cursor: pointer;">
                        <i class="fas fa-user-circle me-1 text-danger"></i>
                        <span id="adminEmail" class="d-none d-md-inline">admin@garasifyy.com</span>
                    </span>
                    <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                         <li><h6 class="dropdown-header">User Profile</h6></li>
                        <li><a class="dropdown-item" href="#" onclick="showChangePasswordModal()"><i class="fas fa-key me-2"></i>Ganti Password</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="{{ route('logout') }}"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <div class="d-flex" id="wrapper">
        <!-- Sidebar -->
        <div class="admin-sidebar" id="sidebar-wrapper">
            <div
                class="sidebar-heading bg-danger text-white p-3 fw-bold d-flex justify-content-between align-items-center">
                <span><i class="fas fa-cogs me-2"></i>Admin Garasifyy</span>
                <button type="button" class="btn btn-sm btn-outline-light d-lg-none" id="sidebarClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action py-3 active" data-section="dashboard">
                    <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                </a>
                <a href="#" class="list-group-item list-group-item-action py-3" data-section="queue">
                    <i class="fas fa-users me-2"></i>Antrian <span class="badge bg-danger ms-2" id="queueBadge">5</span>
                </a>
                <a href="#" class="list-group-item list-group-item-action py-3" data-section="projects">
                    <i class="fas fa-project-diagram me-2"></i>Proyek
                </a>
                <a href="#" class="list-group-item list-group-item-action py-3" data-section="services">
                    <i class="fas fa-tools me-2"></i>Layanan & Harga
                </a>
                <a href="#" class="list-group-item list-group-item-action py-3" data-section="packages">
                    <i class="fas fa-box me-2"></i>Paket
                </a>
                <a href="#" class="list-group-item list-group-item-action py-3" data-section="reports">
                    <i class="fas fa-chart-bar me-2"></i>Laporan
                </a>
                <a href="{{ route('logout') }}" class="list-group-item list-group-item-action py-3 text-danger" id="adminLogoutBtn">
                    <i class="fas fa-sign-out-alt me-2"></i>Logout
                </a>
            </div>
        </div>

        <!-- Page Content -->
        <!-- Page Content -->
        <!-- Page Content -->
        <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column min-vh-100">




            <!-- Main Content -->
            <div class="container-fluid p-4">

                <!-- Dashboard Section -->
                <div id="dashboard-section" class="content-section">
                    <h2 class="fw-bold text-gradient mb-4"><i class="fas fa-tachometer-alt me-2"></i>Dashboard Overview
                    </h2>

                    <!-- Stats Cards -->
                    <div class="row g-4 mb-4">
                        <div class="col-xl-3 col-md-6">
                            <div class="card stat-card bg-primary text-white">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="text-uppercase mb-1 opacity-75">Total Antrian</h6>
                                            <h2 class="mb-0 fw-bold" id="totalQueue">{{ $stats['totalAntrian'] ?? 0 }}</h2>
                                        </div>
                                        <i class="fas fa-users fa-3x opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6">
                            <div class="card stat-card bg-warning text-dark">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="text-uppercase mb-1 opacity-75">Proyek Aktif</h6>
                                            <h2 class="mb-0 fw-bold" id="activeProjects">{{ $stats['proyekAktif'] ?? 0 }}</h2>
                                        </div>
                                        <i class="fas fa-wrench fa-3x opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6">
                            <div class="card stat-card bg-success text-white">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="text-uppercase mb-1 opacity-75">Selesai Bulan Ini</h6>
                                            <h2 class="mb-0 fw-bold" id="completedProjects">{{ $stats['selesaiBulan'] ?? 0 }}</h2>
                                        </div>
                                        <i class="fas fa-check-circle fa-3x opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6">
                            <div class="card stat-card bg-danger text-white">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="text-uppercase mb-1 opacity-75">Revenue</h6>
                                            <h2 class="mb-0 fw-bold" id="totalRevenue">Rp {{ number_format($stats['revenue'] ?? 0, 0, ',', '.') }}</h2>
                                        </div>
                                        <i class="fas fa-money-bill-wave fa-3x opacity-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Projects Table -->
                    <div class="card bg-dark text-light shadow">
                        <div class="card-header bg-danger">
                            <h5 class="mb-0"><i class="fas fa-clock me-2"></i>Proyek Terbaru</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-dark table-hover" id="recentProjectsTable">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Kendaraan</th>
                                            <th>Layanan</th>
                                            <th>Status</th>
                                            <th>Progress</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @forelse($projects as $project)
                                        <tr>
                                            <td>#{{ $project['id'] ?? '-' }}</td>
                                            <td>{{ $project['customer'] ?? '-' }}</td>
                                            <td>{{ $project['carModel'] ?? '-' }}</td>
                                            <td>{{ $project['serviceType'] ?? '-' }}</td>
                                            <td>
                                                @php
                                                    $status = $project['status'] ?? 'planning';
                                                    $badgeClass = match(strtolower($status)) {
                                                        'completed', 'selesai' => 'bg-success',
                                                        'on progress', 'dikerjakan' => 'bg-warning',
                                                        'waiting', 'menunggu' => 'bg-secondary',
                                                        default => 'bg-info'
                                                    };
                                                @endphp
                                                <span class="badge {{ $badgeClass }}">{{ ucfirst($status) }}</span>
                                            </td>
                                            <td>
                                                @php $progress = $project['progress'] ?? 0; @endphp
                                                <div class="progress" style="height: 8px;">
                                                    <div class="progress-bar {{ $badgeClass }}" style="width: {{ $progress }}%"></div>
                                                </div>
                                                <small>{{ $progress }}%</small>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-light" onclick="viewProject('{{ $project['id'] }}')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-success" onclick="updateStatus('{{ $project['id'] }}')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        @empty
                                        <tr>
                                            <td colspan="7" class="text-center">Belum ada data proyek dari Firebase.</td>
                                        </tr>
                                        @endforelse
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Queue Section -->
                <div id="queue-section" class="content-section d-none">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="fw-bold text-gradient"><i class="fas fa-users me-2"></i>Manajemen Antrian</h2>
                        <div>
                            <select class="form-select form-select-sm d-inline-block w-auto me-2" id="queueFilter">
                                <option value="all">Semua Status</option>
                                <option value="waiting">Menunggu</option>
                                <option value="in-progress">Dikerjakan</option>
                                <option value="completed">Selesai</option>
                            </select>
                        </div>
                    </div>

                    <div class="card bg-dark text-light shadow">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-dark table-hover" id="queueTable">
                                    <thead>
                                        <tr>
                                            <th>No. Antrian</th>
                                            <th>Customer</th>
                                            <th>No. Plat</th>
                                            <th>Layanan</th>
                                            <th>Tanggal Booking</th>
                                            <th>Status</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody id="queueTableBody">
                                        <!-- Populated via JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Projects Section -->
                <div id="projects-section" class="content-section d-none">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="fw-bold text-gradient"><i class="fas fa-project-diagram me-2"></i>Manajemen Proyek
                        </h2>
                    </div>

                    <div class="card bg-dark text-light shadow">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-dark table-hover" id="projectsTable">
                                    <thead>
                                        <tr>
                                            <th class="text-nowrap">ID Proyek</th>
                                            <th class="text-nowrap">Layanan - Kendaraan</th>
                                            <th class="text-nowrap">Customer</th>
                                            <th class="text-nowrap">Progress</th>
                                            <th class="text-nowrap">Status</th>
                                            <th class="text-end text-nowrap">Total</th>
                                            <th class="text-nowrap">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody id="projectsTableBody">
                                        <!-- Populated via JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Services Section -->
                <div id="services-section" class="content-section d-none">
                    <!-- Services content populated via JS or Static -->
                     <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="fw-bold text-gradient"><i class="fas fa-tools me-2"></i>Pengaturan Layanan & Harga
                        </h2>
                        <button class="btn btn-danger" onclick="showAddServiceModal()">
                            <i class="fas fa-plus me-2"></i>Tambah Layanan
                        </button>
                    </div>
                    <div class="row g-4">
                         <!-- Content placeholder maintained from source -->
                    </div>
                </div>

                <!-- Packages Section -->
                <div id="packages-section" class="content-section d-none">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="fw-bold text-gradient"><i class="fas fa-box me-2"></i>Paket Upgrade & Maintenance
                        </h2>
                        <button class="btn btn-danger" onclick="showAddPackageModal()">
                            <i class="fas fa-plus me-2"></i>Tambah Paket
                        </button>
                    </div>
                    <div class="row g-4" id="packagesContainer">
                        <!-- Packages populated via JS or Static -->
                    </div>
                </div>

                <!-- Reports Section -->
                <div id="reports-section" class="content-section d-none">
                    <!-- Reports UI maintained -->
                     <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="fw-bold text-gradient"><i class="fas fa-chart-bar me-2"></i>Laporan & Export</h2>
                    </div>
                     <!-- Report Filters -->
                    <div class="card bg-dark text-light shadow mb-4">
                        <div class="card-header bg-danger">
                            <h5 class="mb-0"><i class="fas fa-filter me-2"></i>Filter Laporan</h5>
                        </div>
                        <div class="card-body">
                             <div class="row g-3">
                                <div class="col-md-3">
                                    <label class="form-label">Tanggal Mulai</label>
                                    <input type="date" class="form-control bg-dark text-light" id="reportStartDate">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Tanggal Akhir</label>
                                    <input type="date" class="form-control bg-dark text-light" id="reportEndDate">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-select bg-dark text-light" id="reportStatus">
                                        <option value="all">Semua Status</option>
                                        <option value="completed">Selesai</option>
                                        <option value="in-progress">Dikerjakan</option>
                                        <option value="planning">Planning</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Jenis Laporan</label>
                                    <select class="form-select bg-dark text-light" id="reportType">
                                        <option value="projects">Proyek</option>
                                        <option value="revenue">Revenue</option>
                                        <option value="queue">Antrian</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mt-3">
                                <button class="btn btn-danger" onclick="generateReport()">
                                    <i class="fas fa-search me-2"></i>Generate Laporan
                                </button>
                            </div>
                        </div>
                    </div>
        </div>
        
        <!-- Professional Footer -->
        <!-- Fixed Footer Element -->
        <footer class="footer-fixed py-3 text-center">
            <div class="container-fluid">
                <span class="text-secondary small opacity-75">
                    @Copyright by 23552011045_Luthfy Arief_TIF RP 23 CNS A_UASWEB1
                </span>
            </div>
        </footer>
        </div> <!-- End Page Content Wrapper -->
    </div> <!-- End Main Wrapper -->

    <!-- Update Status Modal -->
    <div class="modal fade" id="updateStatusModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-white border-secondary">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title text-danger fw-bold"><i class="fas fa-edit me-2"></i>Update Status Proyek</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="editProjectId">
                    <input type="hidden" id="editCollectionName">
                    
                    <div class="mb-3">
                        <label for="editStatusSelect" class="form-label text-secondary small text-uppercase">Status Pengerjaan</label>
                        <select class="form-select bg-dark text-white border-secondary" id="editStatusSelect">
                            <option value="waiting">Menunggu (Pending)</option>
                            <option value="process">Sedang Dikerjakan (On Progress)</option>
                            <option value="waiting_payment">Menunggu Pembayaran (Invoice Sent)</option>
                            <option value="completed">Selesai (Completed)</option>
                            <option value="canceled">Dibatalkan</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label for="editProgress" class="form-label text-secondary small text-uppercase">Progress (%)</label>
                        <input type="range" class="form-range" id="editProgress" min="0" max="100" step="5" oninput="document.getElementById('progressValue').innerText = this.value + '%'">
                        <div class="text-end fw-bold text-danger" id="progressValue">0%</div>
                    </div>
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-danger" onclick="confirmUpdateStatus()">Simpan Perubahan</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Invoice Modal -->
    <div class="modal fade" id="invoiceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-white border-secondary">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title text-success fw-bold"><i class="fas fa-file-invoice-dollar me-2"></i>Kirim Invoice</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-4">
                        <i class="fas fa-paper-plane fa-3x text-success mb-3"></i>
                        <p>Kirim tagihan pembayaran ke pelanggan untuk proyek ini?</p>
                    </div>
                    
                    <div class="mb-3">
                        <label for="invoiceAmount" class="form-label text-light">Jumlah Tagihan (Rp)</label>
                        <input type="number" class="form-control bg-dark text-white border-secondary" id="invoiceAmount" placeholder="Contoh: 1500000">
                    </div>
                    
                    <small class="text-muted d-block text-center">Status akan berubah menjadi <strong>"Menunggu Pembayaran"</strong>.</small>
                    <input type="hidden" id="invoiceProjectId">
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-success" onclick="confirmSendInvoice()">Kirim Invoice</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Service Modal -->
    <div class="modal fade" id="addServiceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-white border-secondary">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title text-danger fw-bold"><i class="fas fa-tools me-2"></i>Tambah Layanan Baru</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="newServiceName" class="form-label">Nama Layanan</label>
                        <input type="text" class="form-control bg-dark text-white border-secondary" id="newServiceName" required>
                    </div>
                    <div class="mb-3">
                        <label for="newServiceDesc" class="form-label">Deskripsi</label>
                        <textarea class="form-control bg-dark text-white border-secondary" id="newServiceDesc" rows="2"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="newServicePrice" class="form-label">Harga (Rp)</label>
                        <input type="number" class="form-control bg-dark text-white border-secondary" id="newServicePrice" required>
                    </div>
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-danger" onclick="saveNewService()">Simpan Layanan</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-white border-secondary">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title text-warning fw-bold"><i class="fas fa-key me-2"></i>Ganti Password Admin</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="currentPassword" class="form-label">Password Saat Ini</label>
                        <input type="password" class="form-control bg-dark text-white border-secondary" id="currentPassword">
                    </div>
                    <div class="mb-3">
                        <label for="newPassword" class="form-label">Password Baru</label>
                        <input type="password" class="form-control bg-dark text-white border-secondary" id="newPassword">
                    </div>
                    <div class="mb-3">
                        <label for="confirmNewPassword" class="form-label">Konfirmasi Password Baru</label>
                        <input type="password" class="form-control bg-dark text-white border-secondary" id="confirmNewPassword">
                    </div>
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-warning text-dark" onclick="confirmChangePassword()">Update Password</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Details Modal -->
    <div class="modal fade" id="projectDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header bg-danger">
                    <h5 class="modal-title"><i class="fas fa-car me-2"></i>Detail Proyek</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <!-- Standard Modal Content -->
                     <div class="row">
                        <div class="col-md-6">
                            <h6 class="text-danger mb-3"><i class="fas fa-user me-2"></i>Informasi Customer</h6>
                            <p><strong>Nama:</strong> <span id="detailCustomerName">-</span></p>
                            <p><strong>Email:</strong> <span id="detailCustomerEmail">-</span></p>
                            <p><strong>Telepon:</strong> <span id="detailCustomerPhone">-</span></p>
                        </div>
                        <div class="col-md-6">
                            <h6 class="text-danger mb-3"><i class="fas fa-car me-2"></i>Informasi Kendaraan</h6>
                            <p><strong>Model:</strong> <span id="detailCarModel">-</span></p>
                            <p><strong>Plat:</strong> <span id="detailCarPlate">-</span></p>
                            <p><strong>Tahun:</strong> <span id="detailCarYear">-</span></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                </div>
            </div>
        </div>
    </div>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/admin.js') }}"></script>
</body>

</html>
