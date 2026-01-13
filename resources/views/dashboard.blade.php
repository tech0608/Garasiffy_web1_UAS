<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Garasifyy Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Firebase Web SDK -->
    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
        import { getFirestore, collection, query, onSnapshot, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
        
        const firebaseConfig = {
            apiKey: "AIzaSyCOaRCFiH--lrTQgaTdh-6HyqM0_DY2DB4",
            authDomain: "garasifyy.firebaseapp.com",
            projectId: "garasifyy",
            storageBucket: "garasifyy.firebasestorage.app",
            messagingSenderId: "189603872814",
            appId: "1:189603872814:web:65708c604ad6e9ee1ddfbf",
            measurementId: "G-JH69VW685Y"
        };
        
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Real-time listener for projects
        const projectsQuery = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'));
        
        onSnapshot(projectsQuery, (snapshot) => {
            const projects = [];
            snapshot.forEach((doc) => {
                projects.push({ id: doc.id, ...doc.data() });
            });
            
            // Update stats
            const totalProjects = projects.length;
            const activeProjects = projects.filter(p => p.status === 'waiting' || p.status === 'on_progress').length;
            const completedProjects = projects.filter(p => p.status === 'completed').length;
            const totalRevenue = projects.reduce((sum, p) => sum + (p.totalCost || 0), 0);
            
            document.getElementById('stat-total').textContent = totalProjects;
            document.getElementById('stat-revenue').textContent = 'Rp ' + (totalRevenue / 1000000).toFixed(1) + ' Jt';
            document.getElementById('stat-pending').textContent = activeProjects;
            
            // Update table
            const tbody = document.getElementById('projects-table-body');
            if (projects.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-gray-500">No active projects found. Data loaded from Firebase Firestore (Real-time)</td></tr>';
            } else {
                tbody.innerHTML = projects.map(project => {
                    const statusClass = project.status === 'waiting' ? 'status-waiting' : 
                                       project.status === 'on_progress' ? 'status-on_progress' : 
                                       'status-completed';
                    const bookingDate = project.bookingDate?.toDate ? project.bookingDate.toDate().toLocaleDateString('id-ID') : 'N/A';
                    
                    return `
                        <tr class="table-row transition">
                            <td class="p-4">
                                <div class="font-medium text-white">${project.carModel || 'N/A'}</div>
                                <div class="text-xs text-gray-500">${project.plateNumber || 'N/A'}</div>
                            </td>
                            <td class="p-4 text-gray-300">${project.serviceType || 'N/A'}</td>
                            <td class="p-4 text-gray-300">${bookingDate}</td>
                            <td class="p-4">
                                <span class="status-badge ${statusClass}">
                                    ${(project.status || 'unknown').toUpperCase().replace('_', ' ')}
                                </span>
                            </td>
                            <td class="p-4 text-gray-300">Rp ${(project.totalCost || 0).toLocaleString('id-ID')}</td>
                            <td class="p-4 text-center">
                                <button class="text-gray-400 hover:text-white mx-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        });
    </script>
    
    <style>
        body { background-color: #0d1117; color: white; }
        .sidebar { background-color: #161b22; border-right: 1px solid #30363d; }
        .header { background-color: #161b22; border-bottom: 1px solid #30363d; }
        .card { background-color: #161b22; border: 1px solid #30363d; }
        .table-header { background-color: #21262d; }
        .table-row:hover { background-color: #21262d; }
        .status-badge { padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .status-waiting { background-color: rgba(255, 193, 7, 0.2); color: #ffc107; border: 1px solid rgba(255, 193, 7, 0.5); }
        .status-on_progress { background-color: rgba(13, 110, 253, 0.2); color: #0d6efd; border: 1px solid rgba(13, 110, 253, 0.5); }
        .status-completed { background-color: rgba(25, 135, 84, 0.2); color: #198754; border: 1px solid rgba(25, 135, 84, 0.5); }
    </style>
</head>
<body class="flex h-screen">

    <!-- Sidebar -->
    <div class="sidebar w-64 flex flex-col hidden md:flex">
        <div class="p-6">
            <h1 class="text-2xl font-bold text-red-500 tracking-wider">GARASIFYY</h1>
            <p class="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav class="flex-1 px-4 py-4 space-y-2">
            <a href="#" class="flex items-center px-4 py-3 bg-red-900/20 text-red-500 rounded-lg">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                Dashboard
            </a>
            <a href="#" class="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Customers
            </a>
            <a href="#" class="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Invoices
            </a>
        </nav>
        <div class="p-4 border-t border-gray-800">
            <a href="{{ route('logout') }}" class="flex items-center px-4 py-2 text-gray-500 hover:text-white transition">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Logout
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="header flex items-center justify-between p-6">
            <h2 class="text-xl font-semibold">Project Overview</h2>
            <div class="flex items-center space-x-4">
                <div class="text-right mr-2">
                    <p class="text-sm font-bold text-white">Admin</p>
                    <p class="text-xs text-gray-500">Super Administrator</p>
                </div>
                <div class="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                    A
                </div>
            </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-dark p-6">
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="card p-6 rounded-xl">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-gray-400 text-sm font-medium">TOTAL PROJECTS</h3>
                        <span class="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </span>
                    </div>
                    <div class="text-3xl font-bold mb-1" id="stat-total">{{ count($projects ?? []) }}</div>
                    <div class="text-xs text-green-500 font-medium flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        +12% from last month
                    </div>
                </div>

                <div class="card p-6 rounded-xl">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-gray-400 text-sm font-medium">REVENUE</h3>
                        <span class="p-2 bg-green-500/10 text-green-500 rounded-lg">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                    </div>
                    <div class="text-3xl font-bold mb-1" id="stat-revenue">Rp 0 Jt</div>
                    <div class="text-xs text-green-500 font-medium flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        +8.1% from last month
                    </div>
                </div>

                <div class="card p-6 rounded-xl">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-gray-400 text-sm font-medium">PENDING ORDERS</h3>
                        <span class="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                    </div>
                    <div class="text-3xl font-bold mb-1" id="stat-pending">0</div>
                    <div class="text-xs text-gray-500 font-medium">
                        Requires attention
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="card rounded-xl overflow-hidden">
                <div class="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h3 class="font-bold text-lg">Active Projects</h3>
                    <button class="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition">
                        + Manual Booking
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="table-header text-left">
                            <tr>
                                <th class="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer / Car</th>
                                <th class="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Service</th>
                                <th class="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                <th class="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th class="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Cost</th>
                                <th class="p-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800" id="projects-table-body">
                            @forelse($projects as $project)
                            <tr class="table-row transition">
                                <td class="p-4">
                                    <div class="font-medium text-white">{{ $project['carModel'] }}</div>
                                    <div class="text-xs text-gray-500">{{ $project['plateNumber'] }}</div>
                                </td>
                                <td class="p-4 text-gray-300">{{ $project['serviceType'] }}</td>
                                <td class="p-4 text-gray-300">
                                    {{ is_string($project['bookingDate']) ? $project['bookingDate'] : $project['bookingDate']->format('d M Y') }}
                                </td>
                                <td class="p-4">
                                    @php
                                        $statusClass = match($project['status']) {
                                            'waiting' => 'status-waiting',
                                            'on_progress' => 'status-on_progress',
                                            'completed' => 'status-completed',
                                            default => 'bg-gray-700 text-gray-300'
                                        };
                                    @endphp
                                    <span class="status-badge {{ $statusClass }}">
                                        {{ strtoupper(str_replace('_', ' ', $project['status'])) }}
                                    </span>
                                </td>
                                <td class="p-4 text-gray-300">
                                    Rp {{ number_format($project['totalCost'], 0, ',', '.') }}
                                </td>
                                <td class="p-4 text-center">
                                    <button class="text-gray-400 hover:text-white mx-1">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="6" class="p-8 text-center text-gray-500">
                                    No active projects found.
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

</body>
</html>
