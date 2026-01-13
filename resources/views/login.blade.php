<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Garasifyy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #0d1117; color: white; }
        .card { background-color: #161b22; }
        .input-dark { background-color: #0d1117; border-color: #30363d; color: white; }
        .btn-red { background-color: #dc3545; }
        .btn-red:hover { background-color: #bb2d3b; }
    </style>
</head>
<body class="flex items-center justify-center h-screen">

    <div class="card p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-red-500">Garasifyy Admin</h1>
            <p class="text-gray-400 text-sm">Masuk untuk mengelola bengkel</p>
        </div>

        @if(session('error'))
            <div class="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm border border-red-800">
                {{ session('error') }}
            </div>
        @endif

        <form action="{{ route('login.post') }}" method="POST">
            @csrf
            
            <div class="mb-4">
                <label class="block text-gray-400 text-sm mb-2">Email Address</label>
                <input type="email" name="email" class="w-full p-2 rounded border input-dark focus:outline-none focus:border-red-500" required>
            </div>

            <div class="mb-6">
                <label class="block text-gray-400 text-sm mb-2">Password</label>
                <input type="password" name="password" class="w-full p-2 rounded border input-dark focus:outline-none focus:border-red-500" required>
            </div>

            <button type="submit" class="w-full btn-red text-white font-bold py-2 px-4 rounded transition duration-200">
                MASUK
            </button>
        </form>

        <div class="mt-6 text-center text-xs text-gray-500">
            &copy; 2026 Garasifyy. All rights reserved.
        </div>
    </div>

</body>
</html>
