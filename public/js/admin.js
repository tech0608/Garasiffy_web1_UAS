document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin JS Loaded & Initialized');

    // Access Firebase modules exposed from dashboard.blade.php
    if (!window.firebaseModules || !window.firebaseDb) {
        console.error("Firebase not initialized! Check dashboard.blade.php");
        return;
    }

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
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Loading data...</td></tr>';

        unsubscribeQueue = onSnapshot(q, (snapshot) => {
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada antrian.</td></tr>';
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
        if (unsubscribeProjects) return; // Already listening

        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const tbody = document.getElementById('projectsTableBody');

        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Loading projects...</td></tr>';

        unsubscribeProjects = onSnapshot(q, (snapshot) => {
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada proyek aktif.</td></tr>';
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
                        <td>${data.serviceType || '-'} <br> <small class="text-muted">${data.carModel || '-'}</small></td>
                        <td>${data.customerName || data.customer || '-'}</td>
                        <td style="width: 15%">
                            <div class="progress" style="height: 6px;">
                                <div class="progress-bar ${badgeClass}" style="width: ${progress}%"></div>
                            </div>
                            <small>${progress}%</small>
                        </td>
                        <td><span class="badge ${badgeClass}">${capitalize(status)}</span></td>
                        <td class="text-end">Rp ${formatMoney(data.totalCost || data.cost || 0)}</td>
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-light" onclick="viewProject('${docSnap.id}')" title="Lihat Detail">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-warning" onclick="updateStatus('${docSnap.id}', 'projects')" title="Update Status">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <!-- Actions based on status -->
                                <!-- Actions based on status -->
                                ${(status !== 'completed') ?
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
        const container = document.getElementById('services-container'); // Need to ensure this exists in HTML or handle it
        // Or if it's a table? The user screen showed a "Layanan & Harga" section.
        // Let's assume there's a container. If not, we might need to update dashboard.blade.php too or just target the generic row.
        // Based on the browser agent's interaction, it targeted '#services-section .row.g-4'.
        const serviceSection = document.getElementById('services-section');
        if (!serviceSection) return;
        const row = serviceSection.querySelector('.row');

        if (!row) return;

        onSnapshot(q, (snapshot) => {
            row.innerHTML = '';
            if (snapshot.empty) {
                row.innerHTML = '<div class="col-12 text-center text-muted">Belum ada layanan.</div>';
                return;
            }

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const card = `
                    <div class="col-md-4 col-lg-3">
                        <div class="stat-card bg-dark text-light h-100">
                             <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="card-title text-danger fw-bold mb-0">${data.name}</h5>
                                    <i class="fas fa-tools text-secondary opacity-50"></i>
                                </div>
                                <p class="small text-muted mb-3">${data.description || ''}</p>
                                <h4 class="text-white mb-0">Rp ${new Intl.NumberFormat('id-ID').format(data.price || 0)}</h4>
                            </div>
                        </div>
                    </div>
                `;
                row.innerHTML += card;
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
                alert("Data proyek tidak ditemukan.");
            }
        } catch (e) {
            console.error("Error viewing project:", e);
            alert("Terjadi kesalahan saat memuat data.");
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

        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                status: status,
                progress: parseInt(progress),
                updatedAt: new Date()
            });

            // If completed, trigger revenue recalc
            if (status === 'completed' || status === 'selesai') {
                calculateRevenue();
            }

            // Close modal
            const modalEl = document.getElementById('updateStatusModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            // Refresh UI
            if (collectionName === 'bookings') loadQueue();
            if (collectionName === 'projects') loadProjects();

        } catch (e) {
            alert("Error updating: " + e.message);
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
        if (!confirm("Verifikasi pembayaran pelanggan ini? Status akan menjadi 'Completed' dan masuk ke Revenue.")) return;

        try {
            const docRef = doc(db, 'projects', id);
            await updateDoc(docRef, {
                status: 'completed',
                progress: 100,
                updatedAt: new Date()
            });
            calculateRevenue(); // Update financials
            loadProjects();
        } catch (e) {
            alert("Error verifying payment: " + e.message);
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
            alert("Nama dan Harga wajib diisi!");
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

        // Listen to ALL projects to filter locally or use compound query if index exists.
        // For simplicity/small data, we listen to all and filter.
        // Ideally: query(collection(db, 'projects'), where('status', 'in', ['completed', 'selesai']));

        const q = query(collection(db, "projects"));

        revenueUnsub = onSnapshot(q, (snapshot) => {
            let total = 0;
            snapshot.forEach(doc => {
                const data = doc.data();
                const s = (data.status || '').toLowerCase();
                if (s === 'completed' || s === 'selesai' || s === 'paid') {
                    // Try to parse cost. Remove non-numeric if needed, or assume number
                    let cost = data.totalCost || data.cost || 0;
                    if (typeof cost === 'string') cost = parseInt(cost.replace(/\D/g, ''));
                    total += cost;
                }
            });

            // Update Dashboard Badge
            // Assuming there's an element ID 'revenueBadge' or similar. 
            // In the admin html provided, it might correspond to the 4th card value.
            // Let's target by ID if we add one, or generic selector.
            // The 4th stat-card h2 is Revenue.
            const revenueDisplay = document.querySelector('.col-xl-3:nth-child(4) h2');
            if (revenueDisplay) {
                revenueDisplay.innerText = 'Rp ' + new Intl.NumberFormat('id-ID', { notation: "compact" }).format(total);
                revenueDisplay.setAttribute('title', 'Rp ' + new Intl.NumberFormat('id-ID').format(total));
            }
        });
    }

    // Initialize Revenue Listener
    calculateRevenue();

});
