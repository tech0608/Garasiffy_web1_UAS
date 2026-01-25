// js/admin.js - Admin Panel JavaScript for Garasifyy
// Connected to Firebase Firestore (same database as mobile app)

// Global variables for Firebase
let db = null;
let firebaseModules = null;
let projectsData = [];
let servicesData = [];
let packagesData = [];

// Service price map for estimating totalCost when Firebase data is missing
const SERVICE_PRICES = {
    'ECU Tuning': 5000000,
    'Turbocharger Kit': 25000000,
    'Turbo Upgrade': 25000000,
    'Exhaust System': 8000000,
    'Body Kit': 15000000,
    'Body Kit Standard': 15000000,
    'Wide Body': 45000000,
    'Wide Body Conversion': 45000000,
    'Custom Paint Job': 20000000,
    'Body Paint': 20000000,
    'Premium Audio System': 12000000,
    'Audio Install': 12000000,
    'Interior Audio': 12000000,
    'Leather Interior': 18000000,
    'Service Berkala': 1500000,
    'Detailing Premium': 2500000,
    'Engine Upgrade': 35000000
};

// Default price if service type not found
const DEFAULT_SERVICE_PRICE = 10000000;

// Get estimated cost for a project
function getProjectCost(project) {
    if (project.totalCost && project.totalCost > 0) {
        return project.totalCost;
    }
    // Fallback to service price estimation
    return SERVICE_PRICES[project.serviceType] || DEFAULT_SERVICE_PRICE;
}

// Wait for Firebase to be ready
window.addEventListener('firebase-ready', function () {
    console.log('✅ Firebase is ready! Initializing real-time listeners...');
    db = window.firebaseDb;
    firebaseModules = window.firebaseModules;

    // Initialize Firebase listeners
    initFirebaseListeners();
});

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 Garasifyy Admin Panel Initialized');

    // Check admin authentication
    checkAdminAuth();

    // Initialize navigation
    initSidebarNavigation();

    // Initialize sidebar toggle
    initSidebarToggle();

    // Initialize logout
    initLogout();

    // Set default dates for reports
    setDefaultReportDates();

    // Show Firebase status
    showToast('info', '🔄 Menghubungkan ke Firebase Database...');
});

// Initialize Firebase Listeners - Real-time sync with mobile app
function initFirebaseListeners() {
    if (!db || !firebaseModules) {
        console.error('Firebase not initialized');
        return;
    }

    const { collection, query, onSnapshot, orderBy } = firebaseModules;

    // ========== PROJECTS LISTENER (Real-time) ==========
    const projectsQuery = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'));

    onSnapshot(projectsQuery, (snapshot) => {
        projectsData = [];
        snapshot.forEach((doc) => {
            projectsData.push({ id: doc.id, ...doc.data() });
        });

        console.log(`📊 Projects updated: ${projectsData.length} items from Firebase`);

        // Update dashboard stats
        updateDashboardStats();

        // Update tables
        updateRecentProjectsTable();
        updateQueueTable();
        updateProjectsTable();
        updateReportPreviewTable();

        showToast('success', `🔥 Data sinkron dengan mobile app (${projectsData.length} proyek)`);
    }, (error) => {
        console.error('Error listening to projects:', error);
        showToast('warning', 'Menggunakan data demo (Firebase read restricted)');
        // Fallback to demo data if Firebase fails
        loadDemoData();
    });

    // ========== SERVICES LISTENER ==========
    try {
        const servicesQuery = query(collection(db, 'services'));
        onSnapshot(servicesQuery, (snapshot) => {
            servicesData = [];
            snapshot.forEach((doc) => {
                servicesData.push({ id: doc.id, ...doc.data() });
            });
            console.log(`🛠️ Services updated: ${servicesData.length} items`);
        }, (error) => {
            console.log('Services collection not available, using demo data');
        });
    } catch (e) {
        console.log('Services listener setup failed');
    }

    // ========== PACKAGES LISTENER ==========
    try {
        const packagesQuery = query(collection(db, 'packages'));
        onSnapshot(packagesQuery, (snapshot) => {
            packagesData = [];
            snapshot.forEach((doc) => {
                packagesData.push({ id: doc.id, ...doc.data() });
            });
            console.log(`📦 Packages updated: ${packagesData.length} items`);
        }, (error) => {
            console.log('Packages collection not available, using demo data');
        });
    } catch (e) {
        console.log('Packages listener setup failed');
    }
}

// Load demo data as fallback
function loadDemoData() {
    projectsData = [
        { id: 'PRJ001', carModel: 'Honda Civic 2022', plateNumber: 'B 1234 ABC', serviceType: 'Body Kit', status: 'on_progress', progress: 65, totalCost: 28000000, customerName: 'Ahmad Rizki', bookingDate: new Date('2026-01-20') },
        { id: 'PRJ002', carModel: 'Toyota Supra 2023', plateNumber: 'D 5678 XYZ', serviceType: 'Engine Upgrade', status: 'waiting', progress: 10, totalCost: 35000000, customerName: 'Budi Santoso', bookingDate: new Date('2026-01-21') },
        { id: 'PRJ003', carModel: 'Mazda MX-5 2021', plateNumber: 'F 9012 DEF', serviceType: 'Interior Audio', status: 'completed', progress: 100, totalCost: 12000000, customerName: 'Citra Dewi', bookingDate: new Date('2026-01-18') },
        { id: 'PRJ004', carModel: 'Nissan GTR R35', plateNumber: 'B 3456 GHI', serviceType: 'Turbo Upgrade', status: 'on_progress', progress: 45, totalCost: 75000000, customerName: 'Dani Pratama', bookingDate: new Date('2026-01-23') },
        { id: 'PRJ005', carModel: 'BMW M4 2024', plateNumber: 'L 7890 JKL', serviceType: 'Wide Body', status: 'waiting', progress: 0, totalCost: 45000000, customerName: 'Eka Putra', bookingDate: new Date('2026-01-24') }
    ];

    updateDashboardStats();
    updateRecentProjectsTable();
    updateQueueTable();
    updateProjectsTable();
    updateReportPreviewTable();
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalQueue = projectsData.filter(p => p.status === 'waiting').length;
    const activeProjects = projectsData.filter(p => p.status === 'on_progress' || p.status === 'waiting').length;
    const completedProjects = projectsData.filter(p => p.status === 'completed').length;

    // Calculate revenue from CONFIRMED payments only (use estimated cost if totalCost is 0)
    const confirmedPayments = projectsData.filter(p => p.paymentConfirmed === true);
    const totalRevenue = confirmedPayments.reduce((sum, p) => sum + getProjectCost(p), 0);

    // Calculate pending revenue (invoices sent but not paid)
    const pendingPayments = projectsData.filter(p => p.invoiceSent === true && !p.paymentConfirmed);
    const pendingRevenue = pendingPayments.reduce((sum, p) => sum + getProjectCost(p), 0);

    // Update stat cards
    const totalQueueEl = document.getElementById('totalQueue');
    const activeProjectsEl = document.getElementById('activeProjects');
    const completedProjectsEl = document.getElementById('completedProjects');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const queueBadgeEl = document.getElementById('queueBadge');

    if (totalQueueEl) totalQueueEl.textContent = totalQueue;
    if (activeProjectsEl) activeProjectsEl.textContent = activeProjects;
    if (completedProjectsEl) completedProjectsEl.textContent = completedProjects;

    // Format revenue display
    if (totalRevenueEl) {
        if (totalRevenue >= 1000000) {
            totalRevenueEl.textContent = `Rp ${(totalRevenue / 1000000).toFixed(1)} Jt`;
        } else if (totalRevenue >= 1000) {
            totalRevenueEl.textContent = `Rp ${(totalRevenue / 1000).toFixed(0)} Rb`;
        } else {
            totalRevenueEl.textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
        }
    }

    if (queueBadgeEl) queueBadgeEl.textContent = totalQueue;

    // Update report stats
    const reportTotalEl = document.getElementById('reportTotalProjects');
    const reportCompletedEl = document.getElementById('reportCompleted');
    const reportRevenueEl = document.getElementById('reportRevenue');

    if (reportTotalEl) reportTotalEl.textContent = projectsData.length;
    if (reportCompletedEl) reportCompletedEl.textContent = completedProjects;
    if (reportRevenueEl) {
        if (totalRevenue >= 1000000) {
            reportRevenueEl.textContent = `Rp ${(totalRevenue / 1000000).toFixed(1)} Jt`;
        } else if (totalRevenue >= 1000) {
            reportRevenueEl.textContent = `Rp ${(totalRevenue / 1000).toFixed(0)} Rb`;
        } else {
            reportRevenueEl.textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
        }
    }

    console.log(`📊 Stats: ${confirmedPayments.length} pembayaran terkonfirmasi, Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}, Pending: Rp ${pendingRevenue.toLocaleString('id-ID')}`);
}

// Update Recent Projects Table (Dashboard)
function updateRecentProjectsTable() {
    const tbody = document.querySelector('#recentProjectsTable tbody');
    if (!tbody) return;

    const recentProjects = projectsData.slice(0, 5);

    if (recentProjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted p-4">Tidak ada proyek aktif. Data dari Firebase Firestore.</td></tr>';
        return;
    }

    tbody.innerHTML = recentProjects.map(project => {
        const status = project.status || 'waiting';
        const statusClass = status === 'waiting' ? 'bg-info' : status === 'on_progress' ? 'bg-warning' : 'bg-success';
        const statusText = status === 'waiting' ? 'Menunggu' : status === 'on_progress' ? 'On Progress' : 'Completed';
        const progress = project.progress || 0;
        const progressClass = status === 'completed' ? 'bg-success' : status === 'on_progress' ? 'bg-warning' : 'bg-info';

        const bookingDate = project.bookingDate?.toDate ?
            project.bookingDate.toDate().toLocaleDateString('id-ID') :
            (project.bookingDate instanceof Date ? project.bookingDate.toLocaleDateString('id-ID') : 'N/A');

        return `
            <tr>
                <td>#${project.id.substring(0, 6).toUpperCase()}</td>
                <td>${project.customerName || 'N/A'}</td>
                <td>${project.carModel || 'N/A'}</td>
                <td>${project.serviceType || 'N/A'}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar ${progressClass}" style="width: ${progress}%"></div>
                    </div>
                    <small>${progress}%</small>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-light" onclick="viewProject('${project.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${status !== 'completed' ? `
                    <button class="btn btn-sm btn-outline-success" onclick="updateStatus('${project.id}')">
                        <i class="fas fa-edit"></i>
                    </button>` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

// Update Queue Table
function updateQueueTable() {
    const tbody = document.getElementById('queueTableBody');
    if (!tbody) return;

    // Filter by queue filter value
    const filterEl = document.getElementById('queueFilter');
    const filterValue = filterEl ? filterEl.value : 'all';

    let filteredData = projectsData;
    if (filterValue !== 'all') {
        const statusMap = {
            'waiting': 'waiting',
            'in-progress': 'on_progress',
            'completed': 'completed'
        };
        filteredData = projectsData.filter(p => p.status === statusMap[filterValue]);
    }

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted p-4">Tidak ada antrian. Data real-time dari Firebase.</td></tr>';
        return;
    }

    let queueNumber = 1;
    tbody.innerHTML = filteredData.map(project => {
        const status = project.status || 'waiting';
        const statusClass = status === 'waiting' ? 'bg-info' : status === 'on_progress' ? 'bg-warning' : 'bg-success';
        const statusText = status === 'waiting' ? 'Menunggu' : status === 'on_progress' ? 'Dikerjakan' : 'Selesai';

        const bookingDate = project.bookingDate?.toDate ?
            project.bookingDate.toDate().toLocaleDateString('id-ID') :
            (project.bookingDate instanceof Date ? project.bookingDate.toLocaleDateString('id-ID') : 'N/A');

        let actionButton = '';
        if (status === 'waiting') {
            actionButton = `<button class="btn btn-sm btn-warning" onclick="setQueueStatus('${project.id}', 'on_progress')"><i class="fas fa-play"></i> Mulai</button>`;
        } else if (status === 'on_progress') {
            actionButton = `<button class="btn btn-sm btn-success" onclick="setQueueStatus('${project.id}', 'completed')"><i class="fas fa-check"></i> Selesai</button>`;
        } else {
            actionButton = '<span class="badge bg-success"><i class="fas fa-check"></i> Done</span>';
        }

        return `
            <tr>
                <td>Q-${String(queueNumber++).padStart(3, '0')}</td>
                <td>${project.customerName || 'N/A'}</td>
                <td>${project.plateNumber || 'N/A'}</td>
                <td>${project.serviceType || 'N/A'}</td>
                <td>${bookingDate}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>${actionButton}</td>
            </tr>
        `;
    }).join('');
}

// Update Projects Management Table (show ALL projects including completed for billing)
function updateProjectsTable() {
    const tbody = document.getElementById('projectsTableBody');
    if (!tbody) return;

    // Show ALL projects (not filtering out completed - for billing purposes)
    const allProjects = projectsData;

    if (allProjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted p-4">Tidak ada proyek. Data dari Firebase Firestore.</td></tr>';
        return;
    }

    tbody.innerHTML = allProjects.map(project => {
        const status = project.status || 'waiting';
        // Auto-set progress to 100% if completed
        const progress = status === 'completed' ? 100 : (project.progress || 0);
        const invoiceSent = project.invoiceSent || false;
        const paymentConfirmed = project.paymentConfirmed || false;
        const estimatedCost = getProjectCost(project);

        // Payment status badges
        let paymentStatusBadge = '';
        if (paymentConfirmed) {
            paymentStatusBadge = '<span class="badge bg-success ms-1" title="Lunas"><i class="fas fa-check"></i></span>';
        } else if (invoiceSent) {
            paymentStatusBadge = '<span class="badge bg-warning text-dark ms-1" title="Menunggu Pembayaran"><i class="fas fa-clock"></i></span>';
        }

        return `
            <tr data-project-id="${project.id}">
                <td>#${project.id.substring(0, 6).toUpperCase()} ${paymentStatusBadge}</td>
                <td>${project.serviceType || 'N/A'} - ${project.carModel || 'N/A'}</td>
                <td>${project.customerName || 'N/A'}</td>
                <td>
                    <input type="range" class="form-range" min="0" max="100" value="${progress}" 
                           onchange="updateProgress('${project.id}', this.value)">
                    <span class="progress-label">${progress}%</span>
                </td>
                <td>
                    <select class="form-select form-select-sm bg-dark text-light" 
                            onchange="updateProjectStatus('${project.id}', this.value)">
                        <option value="waiting" ${status === 'waiting' ? 'selected' : ''}>Waiting</option>
                        <option value="on_progress" ${status === 'on_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
                <td class="text-end">Rp ${estimatedCost.toLocaleString('id-ID')}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-info" onclick="viewProject('${project.id}')" title="Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn ${invoiceSent ? 'btn-success' : 'btn-outline-success'}" 
                                onclick="sendInvoice('${project.id}')" title="${invoiceSent ? 'Invoice Terkirim' : 'Kirim Invoice'}">
                            <i class="fas fa-file-invoice"></i>
                        </button>
                        <button class="btn ${paymentConfirmed ? 'btn-warning' : 'btn-outline-warning'}" 
                                onclick="confirmPayment('${project.id}')" 
                                title="${paymentConfirmed ? 'Pembayaran Diterima' : 'Konfirmasi Pembayaran'}"
                                ${paymentConfirmed ? 'disabled' : ''}>
                            <i class="fas fa-money-bill-wave"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Update Report Preview Table
function updateReportPreviewTable() {
    const tbody = document.querySelector('#reportPreviewTable tbody');
    if (!tbody) return;

    if (projectsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted p-4">Tidak ada data untuk laporan.</td></tr>';
        return;
    }

    tbody.innerHTML = projectsData.slice(0, 10).map(project => {
        const status = project.status || 'waiting';
        const statusClass = status === 'waiting' ? 'bg-info' : status === 'on_progress' ? 'bg-warning' : 'bg-success';
        const statusText = status === 'waiting' ? 'Waiting' : status === 'on_progress' ? 'On Progress' : 'Completed';

        const bookingDate = project.bookingDate?.toDate ?
            project.bookingDate.toDate().toLocaleDateString('id-ID') :
            (project.bookingDate instanceof Date ? project.bookingDate.toLocaleDateString('id-ID') : 'N/A');

        const cost = project.totalCost || 0;

        return `
            <tr>
                <td>#${project.id.substring(0, 6).toUpperCase()}</td>
                <td>${project.customerName || 'N/A'}</td>
                <td>${project.serviceType || 'N/A'}</td>
                <td>${bookingDate}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>Rp ${cost.toLocaleString('id-ID')}</td>
            </tr>
        `;
    }).join('');
}

// Check if user is admin
function checkAdminAuth() {
    const userRole = sessionStorage.getItem('userRole');
    const userEmail = sessionStorage.getItem('userEmail');

    if (userRole !== 'admin') {
        alert('Akses ditolak! Anda harus login sebagai admin.');
        window.location.href = 'login.html';
        return;
    }

    const adminEmailEl = document.getElementById('adminEmail');
    if (adminEmailEl && userEmail) {
        adminEmailEl.textContent = userEmail;
    }
}

// Sidebar Navigation
function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.admin-sidebar .list-group-item[data-section]');
    const contentSections = document.querySelectorAll('.content-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            contentSections.forEach(section => section.classList.add('d-none'));

            const targetSection = this.getAttribute('data-section') + '-section';
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.remove('d-none');
            }
        });
    });
}

// Sidebar Toggle
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const wrapper = document.getElementById('wrapper');
    const sidebar = document.getElementById('sidebar-wrapper');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            wrapper.classList.toggle('toggled');
        });
    }

    // Close button inside sidebar
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function () {
            wrapper.classList.remove('toggled');
        });
    }

    // Click outside sidebar to close on mobile
    document.addEventListener('click', function (e) {
        if (window.innerWidth < 992 && wrapper.classList.contains('toggled')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                wrapper.classList.remove('toggled');
            }
        }
    });
}

// Logout
function initLogout() {
    const logoutBtn = document.getElementById('adminLogoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                sessionStorage.removeItem('userRole');
                sessionStorage.removeItem('userEmail');
                showToast('success', 'Logout berhasil!');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }
}

// ============ QUEUE MANAGEMENT - FIREBASE INTEGRATION ============

async function setQueueStatus(projectId, newStatus) {
    console.log(`Updating project ${projectId} status to ${newStatus}`);

    if (db && firebaseModules) {
        try {
            const { doc, updateDoc, Timestamp } = firebaseModules;
            const projectRef = doc(db, 'projects', projectId);

            const updateData = {
                status: newStatus,
                updatedAt: Timestamp.now()
            };

            // If completing, set progress to 100
            if (newStatus === 'completed') {
                updateData.progress = 100;
            }

            await updateDoc(projectRef, updateData);
            showToast('success', `✅ Status berhasil diupdate ke: ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('error', `Gagal update status: ${error.message}`);
        }
    } else {
        // Demo mode
        const statusText = {
            'waiting': 'Menunggu',
            'on_progress': 'Dikerjakan',
            'completed': 'Selesai'
        };
        showToast('success', `Status diubah menjadi: ${statusText[newStatus]} (Demo Mode)`);

        // Update local data
        const project = projectsData.find(p => p.id === projectId);
        if (project) {
            project.status = newStatus;
            if (newStatus === 'completed') project.progress = 100;
            updateDashboardStats();
            updateQueueTable();
            updateProjectsTable();
        }
    }
}

// ============ PROJECT MANAGEMENT - FIREBASE INTEGRATION ============

function viewProject(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (project) {
        // Populate modal fields
        document.getElementById('detailCustomerName').textContent = project.customerName || 'N/A';
        document.getElementById('detailCustomerEmail').textContent = project.customerEmail || 'N/A';
        document.getElementById('detailCustomerPhone').textContent = project.customerPhone || 'N/A';

        document.getElementById('detailCarModel').textContent = project.carModel || 'N/A';
        document.getElementById('detailCarPlate').textContent = project.plateNumber || 'N/A';
        document.getElementById('detailCarYear').textContent = project.carYear || 'N/A';

        document.getElementById('detailServiceType').textContent = project.serviceType || 'N/A';
        document.getElementById('detailPackage').textContent = project.package || 'N/A';

        // Format date
        let bookingDate = 'N/A';
        if (project.bookingDate?.toDate) {
            bookingDate = project.bookingDate.toDate().toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        } else if (project.bookingDate instanceof Date) {
            bookingDate = project.bookingDate.toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        }
        document.getElementById('detailBookingDate').textContent = bookingDate;

        // Status badge
        const statusBadge = document.getElementById('detailStatus');
        const status = project.status || 'waiting';
        statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusBadge.className = 'badge ' + (
            status === 'completed' ? 'bg-success' :
                status === 'in-progress' ? 'bg-warning text-dark' : 'bg-info'
        );

        document.getElementById('detailProgress').textContent = (project.progress || 0) + '%';
        document.getElementById('detailTotalCost').textContent = `Rp ${(project.totalCost || 0).toLocaleString('id-ID')}`;
        document.getElementById('detailNotes').textContent = project.notes || 'Tidak ada catatan';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('projectDetailsModal'));
        modal.show();
    } else {
        showToast('error', `Proyek tidak ditemukan: ${projectId}`);
    }
}

function updateStatus(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (project) {
        document.getElementById('projectIdInput').value = projectId;
        document.getElementById('projectStatus').value = project.status || 'waiting';
        document.getElementById('projectProgress').value = project.progress || 0;
        document.getElementById('progressLabel').textContent = (project.progress || 0) + '%';
    }
    const modal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
    modal.show();
}

async function updateProgress(projectId, value) {
    const row = event.target.closest('tr');
    const label = row.querySelector('.progress-label');
    if (label) {
        label.textContent = value + '%';
    }

    if (db && firebaseModules) {
        try {
            const { doc, updateDoc, Timestamp } = firebaseModules;
            const projectRef = doc(db, 'projects', projectId);
            await updateDoc(projectRef, {
                progress: parseInt(value),
                updatedAt: Timestamp.now()
            });
            console.log(`Project ${projectId} progress updated to: ${value}%`);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }
}

function updateProgressLabel(value) {
    document.getElementById('progressLabel').textContent = value + '%';
}

async function updateProjectStatus(projectId, status) {
    console.log(`Project ${projectId} status updated to: ${status}`);

    // Auto-set progress to 100% when completed
    const updateData = {
        status: status,
        updatedAt: null
    };
    if (status === 'completed') {
        updateData.progress = 100;
    }

    if (db && firebaseModules) {
        try {
            const { doc, updateDoc, Timestamp } = firebaseModules;
            const projectRef = doc(db, 'projects', projectId);
            updateData.updatedAt = Timestamp.now();
            await updateDoc(projectRef, updateData);
            showToast('success', `Status proyek diubah menjadi: ${status}${status === 'completed' ? ' (Progress: 100%)' : ''}`);
        } catch (error) {
            console.error('Error updating project status:', error);
            showToast('error', `Gagal update status: ${error.message}`);
        }
    } else {
        showToast('success', `Status proyek ${projectId} diubah menjadi: ${status} (Demo)`);
        const project = projectsData.find(p => p.id === projectId);
        if (project) {
            project.status = status;
            if (status === 'completed') project.progress = 100;
            updateDashboardStats();
            updateRecentProjectsTable();
            updateProjectsTable();
        }
    }
}

async function saveProjectStatus() {
    const projectId = document.getElementById('projectIdInput').value;
    const status = document.getElementById('projectStatus').value;
    const progress = parseInt(document.getElementById('projectProgress').value);
    const notes = document.getElementById('projectNotes').value;

    if (db && firebaseModules) {
        try {
            const { doc, updateDoc, Timestamp } = firebaseModules;
            const projectRef = doc(db, 'projects', projectId);
            await updateDoc(projectRef, {
                status: status,
                progress: progress,
                notes: notes,
                updatedAt: Timestamp.now()
            });
            showToast('success', `✅ Proyek ${projectId} berhasil diupdate!`);
        } catch (error) {
            console.error('Error saving project status:', error);
            showToast('error', `Gagal menyimpan: ${error.message}`);
        }
    } else {
        showToast('success', `Proyek ${projectId} berhasil diupdate! (Demo Mode)`);
    }

    bootstrap.Modal.getInstance(document.getElementById('updateStatusModal')).hide();
}

// ============ SERVICE MANAGEMENT ============

function editService(serviceId) {
    const services = {
        'ecu-tuning': { name: 'ECU Tuning', price: 5000000, duration: '1-2 hari', category: 'Performance' },
        'turbo': { name: 'Turbocharger Kit', price: 25000000, duration: '3-5 hari', category: 'Performance' },
        'exhaust': { name: 'Exhaust System', price: 8000000, duration: '1 hari', category: 'Performance' },
        'bodykit': { name: 'Body Kit Standard', price: 15000000, duration: '5-7 hari', category: 'Exterior' },
        'widebody': { name: 'Wide Body Conversion', price: 45000000, duration: '14-21 hari', category: 'Exterior' },
        'paint': { name: 'Custom Paint Job', price: 20000000, duration: '7-10 hari', category: 'Exterior' },
        'audio': { name: 'Premium Audio System', price: 12000000, duration: '2-3 hari', category: 'Interior' },
        'leather': { name: 'Leather Interior', price: 18000000, duration: '5-7 hari', category: 'Interior' },
        'service': { name: 'Service Berkala', price: 1500000, duration: '1 hari', category: 'Maintenance' },
        'detailing': { name: 'Detailing Premium', price: 2500000, duration: '1-2 hari', category: 'Maintenance' }
    };

    const service = services[serviceId];
    if (service) {
        document.getElementById('serviceName').value = service.name;
        document.getElementById('servicePrice').value = service.price;
        document.getElementById('serviceDuration').value = service.duration;
        document.getElementById('serviceCategory').value = service.category;

        const modal = new bootstrap.Modal(document.getElementById('editServiceModal'));
        modal.show();
    }
}

function saveService() {
    const name = document.getElementById('serviceName').value;
    const price = document.getElementById('servicePrice').value;
    const duration = document.getElementById('serviceDuration').value;
    const category = document.getElementById('serviceCategory').value;

    console.log('Saving service:', { name, price, duration, category });
    showToast('success', `Layanan "${name}" berhasil disimpan!`);
    bootstrap.Modal.getInstance(document.getElementById('editServiceModal')).hide();
}

function showAddServiceModal() {
    document.getElementById('serviceName').value = '';
    document.getElementById('servicePrice').value = '';
    document.getElementById('serviceDuration').value = '';
    document.getElementById('serviceCategory').value = 'Performance';

    const modal = new bootstrap.Modal(document.getElementById('editServiceModal'));
    modal.show();
}

// ============ PACKAGE MANAGEMENT ============

function editPackage(packageId) {
    showToast('info', `Editing package: ${packageId}`);
}

function deletePackage(packageId) {
    if (confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
        showToast('success', `Paket ${packageId} berhasil dihapus!`);
    }
}

function showAddPackageModal() {
    showToast('info', 'Fitur tambah paket baru');
}

// ============ REPORTS & EXPORT ============

function setDefaultReportDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const startDateEl = document.getElementById('reportStartDate');
    const endDateEl = document.getElementById('reportEndDate');

    if (startDateEl) {
        startDateEl.value = firstDay.toISOString().split('T')[0];
    }
    if (endDateEl) {
        endDateEl.value = today.toISOString().split('T')[0];
    }
}

function generateReport() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const status = document.getElementById('reportStatus').value;
    const type = document.getElementById('reportType').value;

    console.log('Generating report:', { startDate, endDate, status, type });
    showToast('success', `Laporan berhasil di-generate! (${projectsData.length} data dari Firebase)`);
}

function exportToExcel() {
    showToast('info', 'Mengexport ke Excel...');

    try {
        const data = [];
        data.push(['ID', 'Customer', 'Kendaraan', 'Layanan', 'Tanggal', 'Status', 'Total']);

        projectsData.forEach(project => {
            const bookingDate = project.bookingDate?.toDate ?
                project.bookingDate.toDate().toLocaleDateString('id-ID') :
                (project.bookingDate instanceof Date ? project.bookingDate.toLocaleDateString('id-ID') : 'N/A');

            data.push([
                project.id || '',
                project.customerName || 'N/A',
                project.carModel || 'N/A',
                project.serviceType || 'N/A',
                bookingDate,
                project.status || 'N/A',
                `Rp ${(project.totalCost || 0).toLocaleString('id-ID')}`
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Laporan Garasifyy');

        ws['!cols'] = [
            { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 18 }
        ];

        const today = new Date().toISOString().split('T')[0];
        const filename = `Laporan_Garasifyy_${today}.xlsx`;

        // Use XLSX.writeFile which handles the download correctly
        XLSX.writeFile(wb, filename);

        showToast('success', `📥 File ${filename} berhasil didownload!`);
    } catch (error) {
        console.error('Excel export error:', error);
        showToast('error', `Gagal export Excel: ${error.message}`);
    }
}

function exportToPDF() {
    showToast('info', 'Mengexport ke PDF...');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(220, 53, 69);
        doc.text('GARASIFYY', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Laporan Proyek Modifikasi', 105, 30, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Data tersinkronisasi dengan aplikasi mobile', 105, 38, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const today = new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        doc.text(`Tanggal: ${today}`, 14, 50);

        const tableData = projectsData.map(project => {
            const bookingDate = project.bookingDate?.toDate ?
                project.bookingDate.toDate().toLocaleDateString('id-ID') :
                (project.bookingDate instanceof Date ? project.bookingDate.toLocaleDateString('id-ID') : 'N/A');

            return [
                (project.id || '').substring(0, 8),
                project.customerName || 'N/A',
                project.serviceType || 'N/A',
                bookingDate,
                project.status || 'N/A',
                `Rp ${(project.totalCost || 0).toLocaleString('id-ID')}`
            ];
        });

        doc.autoTable({
            head: [['ID', 'Customer', 'Layanan', 'Tanggal', 'Status', 'Total']],
            body: tableData,
            startY: 58,
            theme: 'grid',
            headStyles: { fillColor: [220, 53, 69], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 9 }
        });

        const finalY = doc.lastAutoTable.finalY + 15;
        const totalRevenue = projectsData.reduce((sum, p) => sum + (p.totalCost || 0), 0);
        const completedCount = projectsData.filter(p => p.status === 'completed').length;

        doc.setFontSize(12);
        doc.text('Ringkasan:', 14, finalY);
        doc.setFontSize(10);
        doc.text(`Total Proyek: ${projectsData.length}`, 14, finalY + 8);
        doc.text(`Selesai: ${completedCount}`, 14, finalY + 16);
        doc.text(`Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}`, 14, finalY + 24);

        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('© 2026 Garasifyy - Premium Car Modification | Data synced with mobile app', 105, 285, { align: 'center' });

        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `Laporan_Garasifyy_${dateStr}.pdf`;

        // Use jsPDF save method which handles download correctly
        doc.save(filename);

        showToast('success', `📥 File ${filename} berhasil didownload!`);
    } catch (error) {
        console.error('PDF export error:', error);
        showToast('error', `Gagal export PDF: ${error.message}`);
    }
}

// ============ UTILITY FUNCTIONS ============

function showToast(type, message) {
    const existingToast = document.querySelector('.admin-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'admin-toast';

    const bgClass = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    }[type] || 'bg-info';

    const icon = {
        'success': 'fa-check-circle',
        'error': 'fa-times-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    }[type] || 'fa-info-circle';

    toast.innerHTML = `
        <div class="alert ${bgClass} text-white d-flex align-items-center shadow-lg" role="alert">
            <i class="fas ${icon} me-2"></i>
            <div>${message}</div>
        </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

document.addEventListener('DOMContentLoaded', function () {
    const queueFilter = document.getElementById('queueFilter');
    if (queueFilter) {
        queueFilter.addEventListener('change', function () {
            updateQueueTable();
        });
    }
});

// ============ INVOICE & PAYMENT FUNCTIONS ============

// Current project for invoice/payment modals
let currentInvoiceProjectId = null;
let currentPaymentProjectId = null;

// Send Invoice - Open modal
function sendInvoice(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        showToast('error', 'Proyek tidak ditemukan!');
        return;
    }

    currentInvoiceProjectId = projectId;

    // Populate modal
    document.getElementById('invoiceProjectId').value = '#' + projectId.substring(0, 6).toUpperCase();
    document.getElementById('invoiceCustomerName').value = project.customerName || 'N/A';
    document.getElementById('invoiceCustomerEmail').value = project.customerEmail || '';
    document.getElementById('invoiceServiceType').value = project.serviceType || 'N/A';
    document.getElementById('invoiceTotalCost').value = `Rp ${(project.totalCost || 0).toLocaleString('id-ID')}`;
    document.getElementById('invoiceNotes').value = '';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('sendInvoiceModal'));
    modal.show();
}

// Send Invoice - Confirm action
async function sendInvoiceConfirm() {
    if (!currentInvoiceProjectId) return;

    const email = document.getElementById('invoiceCustomerEmail').value;
    if (!email || !email.includes('@')) {
        showToast('warning', 'Masukkan email customer yang valid!');
        return;
    }

    showToast('info', '📧 Mengirim invoice...');

    try {
        if (db && firebaseModules) {
            const { doc, updateDoc, Timestamp } = firebaseModules;
            await updateDoc(doc(db, 'projects', currentInvoiceProjectId), {
                invoiceSent: true,
                invoiceSentAt: Timestamp.now(),
                customerEmail: email,
                invoiceNotes: document.getElementById('invoiceNotes').value,
                updatedAt: Timestamp.now()
            });
        } else {
            // Update local data for demo
            const project = projectsData.find(p => p.id === currentInvoiceProjectId);
            if (project) {
                project.invoiceSent = true;
                project.customerEmail = email;
                updateProjectsTable();
                updateRecentProjectsTable();
            }
        }

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('sendInvoiceModal')).hide();
        showToast('success', `📧 Invoice berhasil dikirim ke ${email}!`);
    } catch (error) {
        console.error('Error sending invoice:', error);
        showToast('error', 'Gagal mengirim invoice: ' + error.message);
    }

    currentInvoiceProjectId = null;
}

// Confirm Payment - Open modal
function confirmPayment(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        showToast('error', 'Proyek tidak ditemukan!');
        return;
    }

    if (project.paymentConfirmed) {
        showToast('info', '✅ Pembayaran sudah dikonfirmasi sebelumnya.');
        return;
    }

    currentPaymentProjectId = projectId;

    // Populate modal
    document.getElementById('paymentProjectId').value = '#' + projectId.substring(0, 6).toUpperCase();
    document.getElementById('paymentCustomerName').value = project.customerName || 'N/A';
    document.getElementById('paymentAmount').value = `Rp ${(project.totalCost || 0).toLocaleString('id-ID')}`;
    document.getElementById('paymentMethod').value = 'transfer';
    document.getElementById('paymentNotes').value = '';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('confirmPaymentModal'));
    modal.show();
}

// Confirm Payment - Action
async function confirmPaymentAction() {
    if (!currentPaymentProjectId) return;

    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentNotes = document.getElementById('paymentNotes').value;

    showToast('info', '💰 Mengkonfirmasi pembayaran...');

    try {
        if (db && firebaseModules) {
            const { doc, updateDoc, Timestamp } = firebaseModules;
            await updateDoc(doc(db, 'projects', currentPaymentProjectId), {
                paymentConfirmed: true,
                paymentConfirmedAt: Timestamp.now(),
                paymentMethod: paymentMethod,
                paymentNotes: paymentNotes,
                updatedAt: Timestamp.now()
            });
        } else {
            // Update local data for demo
            const project = projectsData.find(p => p.id === currentPaymentProjectId);
            if (project) {
                project.paymentConfirmed = true;
                project.paymentMethod = paymentMethod;
                updateProjectsTable();
                updateRecentProjectsTable();
                updateDashboardStats();
            }
        }

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('confirmPaymentModal')).hide();
        showToast('success', '💰 Pembayaran berhasil dikonfirmasi! Revenue diperbarui.');

        // Update dashboard to reflect new revenue
        updateDashboardStats();
    } catch (error) {
        console.error('Error confirming payment:', error);
        showToast('error', 'Gagal konfirmasi pembayaran: ' + error.message);
    }

    currentPaymentProjectId = null;
}
