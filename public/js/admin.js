document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin JS Loaded & Initialized');

    // Access Firebase modules exposed from dashboard.blade.php
    if (!window.firebaseModules || !window.firebaseDb) {
        console.error("Firebase not initialized! Check dashboard.blade.php");
        return;
    }

    // Initialize Bootstrap Tooltips (Premium Detail)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Destructure Firebase modules
    const { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc, getDocs, getDoc, where, Timestamp, addDoc, setDoc } = window.firebaseModules;
    const db = window.firebaseDb;

    // Toast notification helper
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`;
        toast.style.cssText = 'min-width: 250px; margin-bottom: 10px; animation: slideIn 0.3s ease;';
        toast.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 9999;';
        document.body.appendChild(container);
        return container;
    }

    // Make showToast globally available
    window.showToast = showToast;

    // --- Sidebar Navigation ---
    const links = document.querySelectorAll('.list-group-item-action');
    const sections = document.querySelectorAll('.content-section');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const wrapper = document.getElementById('wrapper');

    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(sec => sec.classList.add('d-none'));

        // Show target section
        const target = document.getElementById(`${sectionId}-section`);
        if (target) {
            target.classList.remove('d-none');
        } else {
            console.warn(`Section #${sectionId}-section not found`);
        }

        // Update active link state
        links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Load data specific to section
        if (sectionId === 'queue') loadQueue();
        if (sectionId === 'projects') loadProjects();
    }

    // Attach Click Events to Sidebar Links
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('data-section');
            if (section) {
                e.preventDefault();
                showSection(section);

                // On mobile, close sidebar after click
                if (window.innerWidth < 992) {
                    wrapper.classList.remove('toggled');
                }
            }
        });
    });

    // Mobile Sidebar Toggles
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.toggle('toggled');
        });
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.remove('toggled');
        });
    }


    // --- Data Loading Functions ---

    let unsubscribeQueue = null;
    let unsubscribeProjects = null;

    // Load Queue (Bookings Collection)
    function loadQueue() {
        if (unsubscribeQueue) return; // Already listening

        const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        const tbody = document.getElementById('queueTableBody');

        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="loading-spinner"></div></td></tr>';

        unsubscribeQueue = onSnapshot(q, (snapshot) => {
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fas fa-clipboard-list fa-3x"></i><h4>Belum ada antrian</h4><p class="text-muted">Data antrian akan muncul di sini.</p></div></td></tr>';
                document.getElementById('queueBadge').innerText = '0';
                return;
            }

            document.getElementById('queueBadge').innerText = snapshot.size;

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const status = data.status || 'waiting';
                const badgeClass = getStatusBadge(status);
                // Format Date safely
                let dateStr = '-';
                if (data.bookingDate) dateStr = data.bookingDate;
                else if (data.createdAt && data.createdAt.toDate) dateStr = data.createdAt.toDate().toLocaleDateString();

                const row = `
                    <tr>
                        <td>${docSnap.id.substring(0, 8)}...</td>
                        <td>${data.name || data.customerName || '-'}</td>
                        <td>${data.plateNumber || '-'}</td>
                        <td>${data.serviceType || '-'}</td>
                        <td>${dateStr}</td>
                        <td><span class="badge ${badgeClass}">${capitalize(status)}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-success" onclick="updateStatus('${docSnap.id}', 'bookings')" title="Update Status">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }, (error) => {
            console.error("Error loading queue:", error);
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading data: ${error.message}</td></tr>`;
        });
    }

    // Load Projects (Projects Collection)
    function loadProjects() {
        if (unsubscribeProjects) return;

        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const tbody = document.getElementById('projectsTableBody');

        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="loading-spinner"></div></td></tr>';

        unsubscribeProjects = onSnapshot(q, (snapshot) => {
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7">
                            <div class="empty-state">
                                <i class="fas fa-tasks fa-3x"></i>
                                <h4>Belum ada proyek</h4>
                                <p>Proyek yang sedang berjalan akan muncul di sini.</p>
                            </div>
                        </td>
                    </tr>`;
                return;
            }

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const status = data.status || 'planning';
                const badgeClass = getStatusBadge(status);
                const progress = data.progress || 0;

                const row = `
                    <tr>
                        <td>#${docSnap.id.substring(0, 6)}</td>
                        <td>
                            <div class="fw-bold">${data.serviceType || '-'}</div>
                            <small class="text-secondary"><i class="fas fa-car me-1"></i>${data.carModel || '-'}</small>
                        </td>
                        <td>${data.customerName || data.customer || '-'}</td>
                        <td style="width: 20%">
                            <div class="d-flex align-items-center">
                                <div class="progress flex-grow-1 me-2" style="height: 6px;">
                                    <div class="progress-bar ${badgeClass}" style="width: ${progress}%"></div>
                                </div>
                                <span class="small fw-bold">${progress}%</span>
                            </div>
                        </td>
                        <td><span class="badge ${badgeClass}">${capitalize(status)}</span></td>
                        <td class="text-end fw-bold">Rp ${formatMoney(data.totalCost || data.cost || 0)}</td>
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-light" onclick="viewProject('${docSnap.id}')" title="Lihat Detail">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-warning" onclick="updateStatus('${docSnap.id}', 'projects')" title="Update Status">
                                    <i class="fas fa-edit"></i>
                                </button>
                                ${(status !== 'completed' && status !== 'selesai' && status !== 'paid') ?
                        `<button class="btn btn-sm btn-outline-success" onclick="sendInvoice('${docSnap.id}')" title="${status === 'waiting_payment' ? 'Ubah Invoice' : 'Kirim Invoice'}">
                                    <i class="fas fa-file-invoice-dollar"></i>
                                </button>` : ''}
                                ${(status === 'waiting_payment') ?
                        `<button class="btn btn-sm btn-success" onclick="verifyPayment('${docSnap.id}')" title="Verifikasi Pembayaran">
                                    <i class="fas fa-check-double"></i>
                                </button>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
    }

    // Load Services (Services Collection)
    function loadServices() {
        const q = query(collection(db, "services"), orderBy("price", "asc"));
        const serviceSection = document.getElementById('services-section');
        if (!serviceSection) return;
        const row = serviceSection.querySelector('.row.g-4');
        if (!row) return;

        row.innerHTML = '<div class="col-12"><div class="loading-spinner"></div></div>';

        onSnapshot(q, (snapshot) => {
            row.innerHTML = '';
            if (snapshot.empty) {
                row.innerHTML = `
                    <div class="col-12">
                        <div class="empty-state">
                            <i class="fas fa-tools fa-3x"></i>
                            <h4>Belum ada layanan</h4>
                            <p>Tambahkan layanan baru via tombol "Tambah Layanan".</p>
                        </div>
                    </div>`;
                return;
            }

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const card = `
                    <div class="col-md-4 col-lg-3">
                        <div class="stat-card bg-dark text-light h-100 border-secondary group-card">
                             <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="card-title text-danger fw-bold mb-0">${data.title || data.name}</h5>
                                </div>
                                <p class="small text-muted mb-3" style="min-height: 40px;">${data.description || 'Tidak ada deskripsi'}</p>
                                <h4 class="text-white mb-0">Rp ${formatMoney(data.price || 0)}</h4>
                            </div>
                        </div>
                    </div>
                `;
                row.innerHTML += card;
            });
        });
    }

    // Load Packages (Packages Collection)
    function loadPackages() {
        const q = query(collection(db, "packages"), orderBy("createdAt", "desc"));
        const container = document.getElementById('packagesContainer');
        if (!container) return;

        container.innerHTML = '<div class="col-12"><div class="loading-spinner"></div></div>';

        onSnapshot(q, (snapshot) => {
            container.innerHTML = '';
            if (snapshot.empty) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="empty-state">
                            <i class="fas fa-box fa-3x"></i>
                            <h4>Belum ada paket</h4>
                            <p>Tambahkan paket maintenance/upgrade.</p>
                        </div>
                    </div>`;
                return;
            }

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const card = `
                    <div class="col-md-4">
                        <div class="card bg-dark text-light border-secondary h-100 position-relative shadow-sm hover-elevate">
                            <div class="card-header bg-transparent border-bottom border-secondary text-center py-3">
                                <h5 class="card-title text-danger fw-bold mb-0">${data.name}</h5>
                            </div>
                            <div class="card-body text-center">
                                <h2 class="fw-bold mb-3">Rp ${formatMoney(data.price || 0)}</h2>
                                <p class="text-muted small mb-4">${data.description || ''}</p>
                            </div>
                            <div class="card-footer bg-transparent border-top-0 pb-3 text-center">
                                <button class="btn btn-sm btn-outline-danger w-75 rounded-pill">Detail Paket</button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        });
    }


    // Listen for section changes to trigger loads
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (!target.classList.contains('d-none')) {
                    if (target.id === 'services-section') loadServices();
                    if (target.id === 'packages-section') loadPackages();
                }
            }
        });
    });

    sections.forEach(sec => observer.observe(sec, { attributes: true }));


    // --- Helpers ---
    function getStatusBadge(status) {
        if (!status) return 'bg-secondary';
        status = status.toLowerCase();
        if (['completed', 'selesai'].includes(status)) return 'bg-success';
        if (['progress', 'on progress', 'dikerjakan', 'active'].includes(status)) return 'bg-warning';
        if (['waiting', 'menunggu', 'pending'].includes(status)) return 'bg-secondary';
        return 'bg-info';
    }

    function capitalize(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '-';
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('id-ID').format(amount);
    }

    // --- Global Actions (Exposed to Window) ---

    window.viewProject = async function (id) {
        try {
            const docRef = doc(db, "projects", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Map data to Modal IDs
                setText('detailCustomerName', data.customerName || data.name);
                setText('detailCustomerEmail', data.email);
                setText('detailCustomerPhone', data.phone);
                setText('detailCarModel', data.carModel);
                setText('detailCarPlate', data.plateNumber || data.plate);
                setText('detailCarYear', data.year);

                // Show Modal
                const modalEl = document.getElementById('projectDetailsModal');
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            } else {
                Swal.fire({ icon: 'warning', title: 'Tidak Ditemukan', text: 'Data proyek tidak ditemukan.', background: '#1e1e2d', color: '#fff' });
            }
        } catch (e) {
            console.error("Error viewing project:", e);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memuat data.', background: '#1e1e2d', color: '#fff' });
        }
    };

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerText = value || '-';
    }

    // --- Workflow Functions (Modal Handlers) ---

    // 1. Trigger Update Status Modal
    window.updateStatus = async function (id, collectionName) {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                document.getElementById('editProjectId').value = id;
                document.getElementById('editCollectionName').value = collectionName;
                document.getElementById('editStatusSelect').value = data.status || 'waiting';
                document.getElementById('editProgress').value = data.progress || 0;
                document.getElementById('progressValue').innerText = (data.progress || 0) + '%';

                const modal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
                modal.show();
            }
        } catch (e) {
            console.error("Error fetching for edit:", e);
        }
    };

    // 2. Confirm Update (Called from Modal)
    window.confirmUpdateStatus = async function () {
        const id = document.getElementById('editProjectId').value;
        const collectionName = document.getElementById('editCollectionName').value;
        const status = document.getElementById('editStatusSelect').value;
        const progress = document.getElementById('editProgress').value;

        const result = await Swal.fire({
            title: 'Simpan Perubahan?',
            text: `Status akan diubah menjadi ${capitalize(status)} dengan progress ${progress}%`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d32f2f',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Simpan',
            background: '#1e1e2d',
            color: '#fff'
        });

        if (!result.isConfirmed) return;

        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                status: status,
                progress: parseInt(progress),
                updatedAt: new Date()
            });

            if (status === 'completed' || status === 'selesai') {
                calculateRevenue();
            }

            const modalEl = document.getElementById('updateStatusModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            Swal.fire({
                title: 'Tersimpan!',
                text: 'Data berhasil diperbarui.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1e1e2d',
                color: '#fff'
            });

        } catch (e) {
            Swal.fire({ title: 'Error', text: e.message, icon: 'error', background: '#1e1e2d', color: '#fff' });
        }
    };

    // 3. Invoice Workflow
    window.sendInvoice = function (id) {
        document.getElementById('invoiceProjectId').value = id;

        // Use generic guess for amount or fetch real doc if needed. 
        // For speed, just clear input or set to 0.
        document.getElementById('invoiceAmount').value = '';

        const modal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        modal.show();
    };

    window.confirmSendInvoice = async function () {
        const id = document.getElementById('invoiceProjectId').value;
        const amount = document.getElementById('invoiceAmount').value;

        if (!amount || amount <= 0) {
            alert("Harap masukkan jumlah tagihan yang valid.");
            return;
        }

        try {
            const docRef = doc(db, 'projects', id);
            await updateDoc(docRef, {
                status: 'waiting_payment',
                invoiceAmount: parseInt(amount),
                updatedAt: new Date()
            });

            const modal = bootstrap.Modal.getInstance(document.getElementById('invoiceModal'));
            modal.hide();
            alert(`Invoice sebesar Rp ${new Intl.NumberFormat('id-ID').format(amount)} berhasil dikirim!`);
            loadProjects(); // Refresh list
        } catch (e) {
            alert("Error sending invoice: " + e.message);
        }
    };

    window.verifyPayment = async function (id) {
        const result = await Swal.fire({
            title: 'Verifikasi Pembayaran?',
            text: "Status akan diubah menjadi 'Completed' dan dana masuk ke Revenue.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Verifikasi',
            cancelButtonText: 'Batal',
            background: '#1e1e2d',
            color: '#fff'
        });

        if (!result.isConfirmed) return;

        try {
            const docRef = doc(db, 'projects', id);
            await updateDoc(docRef, {
                status: 'completed',
                progress: 100,
                updatedAt: new Date()
            });
            calculateRevenue(); // Update financials
            loadProjects();
            Swal.fire({
                title: 'Berhasil!',
                text: 'Pembayaran terverifikasi.',
                icon: 'success',
                background: '#1e1e2d',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (e) {
            Swal.fire({ title: 'Error', text: e.message, icon: 'error', background: '#1e1e2d', color: '#fff' });
        }
    };

    // 4. Add Service Workflow
    window.showAddServiceModal = function () {
        const modal = new bootstrap.Modal(document.getElementById('addServiceModal'));
        modal.show();
    };

    window.saveNewService = async function () {
        const name = document.getElementById('newServiceName').value;
        const desc = document.getElementById('newServiceDesc').value;
        const price = document.getElementById('newServicePrice').value;

        if (!name || !price) {
            Swal.fire({ icon: 'warning', title: 'Validasi', text: 'Nama dan Harga wajib diisi!', background: '#1e1e2d', color: '#fff' });
            return;
        }

        try {
            await addDoc(collection(db, 'services'), {
                title: name,
                description: desc,
                price: parseInt(price),
                createdAt: new Date()
            });

            const modal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
            modal.hide();
            showToast("Layanan baru berhasil ditambahkan!", 'success');
            // Clear form fields
            document.getElementById('newServiceName').value = '';
            document.getElementById('newServiceDesc').value = '';
            document.getElementById('newServicePrice').value = '';
            // Reload services section if visible
            loadServices();
        } catch (e) {
            showToast("Gagal menambah layanan: " + e.message, 'error');
        }
    };

    // 5. Change Password Workflow
    window.showChangePasswordModal = function () {
        const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
        modal.show();
    };

    window.confirmChangePassword = async function () {
        const oldPass = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmNewPassword').value;

        if (!oldPass || !newPass || !confirmPass) {
            alert("Semua field harus diisi!");
            return;
        }

        if (newPass !== confirmPass) {
            alert("Password baru tidak cocok!");
            return;
        }

        try {
            // First verify old password against Firestore config
            const { setDoc } = window.firebaseModules;
            const authDocRef = doc(db, 'config', 'auth');
            const authSnap = await getDoc(authDocRef);

            let currentAuth = { password: 'admin123' }; // Fallback
            if (authSnap.exists()) {
                currentAuth = authSnap.data();
            }

            if (oldPass !== currentAuth.password) {
                alert("Password lama salah!");
                return;
            }

            // Update password
            await updateDoc(authDocRef, {
                password: newPass,
                updatedAt: new Date()
            });

            alert("Password berhasil diubah! Silakan login ulang.");
            const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
            modal.hide();
            window.location.href = '/logout';

        } catch (e) {
            console.error(e);
            // Handle if config/auth doesn't exist yet (first time migration)
            if (e.code === 'not-found' || e.message.includes('No document')) {
                // Determine if we should allow migration from 'admin123'
                if (oldPass === 'admin123') {
                    await setDoc(doc(db, 'config', 'auth'), {
                        email: 'admin@garasifyy.com',
                        password: newPass,
                        updatedAt: new Date()
                    });
                    alert("Password berhasil diubah (Migrasi DB)! Silakan login ulang.");
                    window.location.href = '/logout';
                } else {
                    alert("Password lama salah (System Default).");
                }
            } else {
                alert("Gagal mengganti password: " + e.message);
            }
        }
    };

    // 4. Revenue Calculation
    let revenueUnsub = null;
    function calculateRevenue() {
        if (revenueUnsub) return;

        const q = query(collection(db, "projects"));

        revenueUnsub = onSnapshot(q, (snapshot) => {
            let total = 0;
            snapshot.forEach(doc => {
                const data = doc.data();
                const s = (data.status || '').toLowerCase();
                if (s === 'completed' || s === 'selesai' || s === 'paid') {
                    let cost = data.totalCost || data.cost || 0;
                    if (typeof cost === 'string') cost = parseInt(cost.replace(/\D/g, ''));
                    total += cost;
                }
            });

            // Update Dashboard Badge via ID
            const revenueDisplay = document.getElementById('totalRevenue');
            if (revenueDisplay) {
                revenueDisplay.innerText = 'Rp ' + new Intl.NumberFormat('id-ID', { notation: "compact" }).format(total);
                revenueDisplay.setAttribute('title', 'Rp ' + new Intl.NumberFormat('id-ID').format(total));
            }
        });
    }

    // Initialize Revenue Listener
    calculateRevenue();

    // Mobile/Backup Event Listener for Report Generation
    const btnGen = document.getElementById('btnGenerateReport');
    if (btnGen) {
        btnGen.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Generate Report Clicked (Listener)');
            if (typeof window.generateReport === 'function') {
                window.generateReport();
            } else {
                alert('Fungsi Report belum siap. Tunggu sebentar...');
            }
        });
    }

    // 5. Report Generation Logic

});

window.generateReport = async function () {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const status = document.getElementById('reportStatus').value;
    const type = document.getElementById('reportType').value;

    if (!startDate || !endDate) {
        Swal.fire({ icon: 'warning', title: 'Validasi', text: 'Tanggal Mulai dan Akhir wajib diisi!', background: '#1e1e2d', color: '#fff' });
        return;
    }

    // Ensure Firebase is ready when user Clicks
    if (!window.firebaseModules || !window.firebaseDb) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Koneksi Database belum siap. Silakan refresh halaman.', background: '#1e1e2d', color: '#fff' });
        return;
    }

    Swal.fire({
        title: 'Sedang memproses...',
        html: 'Mengambil data...',
        allowOutsideClick: false,
        background: '#1e1e2d',
        color: '#fff',
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const { collection, query, where, getDocs } = window.firebaseModules;
        const db = window.firebaseDb;

        // Convert dates
        const start = new Date(startDate); start.setHours(0, 0, 0, 0);
        const end = new Date(endDate); end.setHours(23, 59, 59, 999);

        let colRef;
        if (type === 'projects' || type === 'revenue') colRef = collection(db, 'projects');
        else if (type === 'queue') colRef = collection(db, 'bookings');

        // Build Query
        let q = query(colRef,
            where('createdAt', '>=', start),
            where('createdAt', '<=', end)
        );

        const snapshot = await getDocs(q);
        let data = [];
        snapshot.forEach(doc => {
            const d = doc.data();
            d.id = doc.id;
            // Client-side filtering
            if (status !== 'all' && (d.status || 'waiting') !== status) return;
            data.push(d);
        });

        if (data.length === 0) {
            Swal.fire({ icon: 'info', title: 'Tidak Ada Data', text: 'Tidak ada data pada periode tersebut.', background: '#1e1e2d', color: '#fff' });
            return;
        }

        Swal.close();

        // Ask for Format
        const { isConfirmed, isDenied } = await Swal.fire({
            title: 'Pilih Format Laporan',
            text: `Ditemukan ${data.length} data. Pilih format download:`,
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: '<i class="fas fa-file-pdf me-2"></i>PDF',
            denyButtonText: '<i class="fas fa-file-excel me-2"></i>Excel',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#d32f2f',
            denyButtonColor: '#198754',
            background: '#1e1e2d',
            color: '#fff'
        });

        if (isConfirmed) {
            generatePDF(data, type, startDate, endDate);
        } else if (isDenied) {
            generateExcel(data, type, startDate, endDate);
        }

    } catch (e) {
        console.error(e);
        Swal.fire({ icon: 'error', title: 'Gagal', text: e.message, background: '#1e1e2d', color: '#fff' });
    }
};

function generatePDF(data, type, start, end) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('GARASIFYY REPORT', 14, 20);
    doc.setFontSize(12);
    doc.text(`Tipe: ${type.toUpperCase()}`, 14, 30);
    doc.text(`Periode: ${start} s/d ${end}`, 14, 36);

    let columns = [];
    let rows = [];

    if (type === 'projects') {
        columns = ['Customer', 'Kendaraan', 'Layanan', 'Status', 'Biaya'];
        rows = data.map(d => [d.customerName || d.name || '-', d.carModel || '-', d.serviceType || '-', d.status || '-', FormatMoney(d.totalCost || d.cost || 0)]);
    } else if (type === 'revenue') {
        columns = ['ID Proyek', 'Tanggal', 'Status', 'Pendapatan'];
        let total = 0;
        data.forEach(d => {
            if (['completed', 'selesai', 'paid'].includes((d.status || '').toLowerCase())) {
                let cost = parseInt(d.totalCost || d.cost || 0);
                let dateStr = d.createdAt && d.createdAt.seconds ? new Date(d.createdAt.seconds * 1000).toLocaleDateString() : '-';
                rows.push([d.id.substring(0, 8), dateStr, d.status, FormatMoney(cost)]);
                total += cost;
            }
        });
        rows.push(['TOTAL REVENUE', '', '', 'Rp ' + FormatMoney(total)]);
    } else if (type === 'queue') {
        columns = ['Nama', 'Plat', 'Layanan', 'Tanggal', 'Status'];
        rows = data.map(d => {
            let dateStr = d.bookingDate ? d.bookingDate : (d.createdAt && d.createdAt.seconds ? new Date(d.createdAt.seconds * 1000).toLocaleDateString() : '-');
            return [d.name || d.customerName || '-', d.plateNumber || '-', d.serviceType || '-', dateStr, d.status || '-']
        });
    }

    doc.autoTable({
        startY: 45,
        head: [columns],
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [211, 47, 47] }
    });

    doc.save(`Garasifyy_${type}_${start}_${end}.pdf`);
}

function generateExcel(data, type, start, end) {
    let exportData = [];

    if (type === 'projects') {
        exportData = data.map(d => ({
            'ID': d.id,
            'Customer': d.customerName || d.name || '-',
            'Kendaraan': d.carModel || '-',
            'Layanan': d.serviceType || '-',
            'Status': d.status || '-',
            'Biaya': d.totalCost || d.cost || 0
        }));
    } else if (type === 'revenue') {
        exportData = data
            .filter(d => ['completed', 'selesai', 'paid'].includes((d.status || '').toLowerCase()))
            .map(d => ({
                'ID Proyek': d.id,
                'Tanggal': d.createdAt && d.createdAt.seconds ? new Date(d.createdAt.seconds * 1000).toLocaleDateString() : '-',
                'Status': d.status,
                'Pendapatan': parseInt(d.totalCost || d.cost || 0)
            }));
    } else if (type === 'queue') {
        exportData = data.map(d => ({
            'No Antrian': d.id,
            'Nama': d.name || d.customerName || '-',
            'Plat Nomor': d.plateNumber || '-',
            'Layanan': d.serviceType || '-',
            'Tanggal': d.bookingDate || (d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleDateString() : '-'),
            'Status': d.status || '-'
        }));
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-width columns
    const wscols = Object.keys(exportData[0] || {}).map(k => ({ wch: 20 }));
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Garasifyy_${type}_${start}_${end}.xlsx`);
}

// Helper for Global Context
function FormatMoney(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
}

