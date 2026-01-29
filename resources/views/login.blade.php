<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Garasifyy</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link href="{{ asset('css/admin.css') }}" rel="stylesheet"> <!-- Use admin.css for theme vars -->
    <style>
        /* Override specific login styles to match theme */
        body {
            background-color: #121212 !important; /* var(--bg-dark) */
            background: radial-gradient(circle at center, #1e1e2d 0%, #121212 100%);
            color: #ffffff;
        }
        .auth-card {
            background-color: #1e1e2d !important; /* var(--bg-card) */
            border: 1px solid #2c2c35; /* var(--border-color) */
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            border-radius: 12px;
        }
        .text-gradient {
            background: none;
            -webkit-text-fill-color: initial;
            color: #ffffff;
            border-left: 5px solid #d32f2f; /* var(--primary-red) */
            padding-left: 15px;
        }
        .form-control {
            background-color: #121212 !important;
            border: 1px solid #2c2c35 !important;
            color: #ffffff !important; /* Force white text */
            caret-color: #d32f2f; /* Red cursor */
        }
        .form-control::placeholder {
            color: #6c757d !important;
            opacity: 1;
        }
        .form-control:focus {
            background-color: #121212 !important;
            border-color: #d32f2f !important;
            box-shadow: 0 0 0 0.25rem rgba(211, 47, 47, 0.25);
            color: #ffffff !important;
        }
        /* Fix Browser Autofill */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #121212 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }
        .btn-danger {
            background-color: #d32f2f !important;
            border-color: #d32f2f !important;
        }
        .btn-danger:hover {
            background-color: #b71c1c !important;
        }
        .footer-custom {
            color: #a0a0a0;
        }
    </style>
</head>

<body class="d-flex flex-column min-vh-100">

    <div class="container d-flex justify-content-center align-items-center flex-grow-1">
        <div class="auth-card p-4 p-md-5" style="width: 100%; max-width: 450px;">
            <div class="card-body">
                <!-- Logo/Brand -->
                <div class="text-center mb-4">
                    <h2 class="text-gradient fw-bold" style="font-family: 'Orbitron', monospace; font-size: 2.5rem;">
                        GARASIFYY
                    </h2>
                    <p class="text-secondary small text-uppercase letter-spacing-2">Modifikasi Mobil Terbaik</p>
                </div>

                <h4 class="card-title text-center mb-4 text-white fw-bold">
                    Admin Login
                </h4>

                <!-- Error Message -->
                <!-- Error Message -->
                @if(session('error'))
                    <div class="alert alert-danger text-center mb-4 bg-dark border-danger text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i> {{ session('error') }}
                    </div>
                @endif

                <form action="{{ route('login.post') }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label for="inputEmail" class="form-label text-secondary small text-uppercase fw-bold">Email</label>
                        <div class="input-group">
                            <span class="input-group-text bg-dark border-secondary text-secondary"><i class="fas fa-envelope"></i></span>
                            <input type="email" class="form-control" name="email" id="inputEmail" placeholder="nama@email.com" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="inputPassword" class="form-label text-secondary small text-uppercase fw-bold">Password</label>
                         <div class="input-group">
                            <span class="input-group-text bg-dark border-secondary text-secondary"><i class="fas fa-lock"></i></span>
                            <input type="password" class="form-control" name="password" id="inputPassword" placeholder="******" required>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col">
                            <div class="form-check">
                                <input class="form-check-input bg-dark border-secondary" type="checkbox" id="rememberMe">
                                <label class="form-check-label text-secondary small" for="rememberMe">Ingat saya</label>
                            </div>
                        </div>
                        <div class="col text-end">
                            <a href="#" class="text-danger small fw-bold text-decoration-none">Lupa password?</a>
                        </div>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-danger btn-lg fw-bold">
                            MASUK <i class="fas fa-arrow-right ms-2"></i>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>

    <footer class="footer-custom py-3 text-center">
        <div class="container">
            <p class="mb-0 small opacity-50">© 2026 Garasifyy. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/script.js') }}"></script>
</body>

</html>
