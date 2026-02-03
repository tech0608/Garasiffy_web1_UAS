<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Show login page
     */
    public function showLogin()
    {
        // Redirect to dashboard if already logged in
        if (session('user_id')) {
            return redirect()->route('dashboard');
        }
        
        return view('login');
    }

    /**
     * Maximum login attempts before lockout
     */
    protected $maxAttempts = 5;
    
    /**
     * Lockout duration in minutes
     */
    protected $decayMinutes = 5;

    /**
     * Handle login request with rate limiting
     */
    public function login(Request $request)
    {
        // Get throttle key based on IP
        $throttleKey = 'login_attempts_' . $request->ip();
        
        // Check if user is locked out
        if ($this->hasTooManyLoginAttempts($throttleKey)) {
            $seconds = $this->getRemainingLockoutSeconds($throttleKey);
            $minutes = ceil($seconds / 60);
            
            Log::warning("Login blocked due to too many attempts from IP: " . $request->ip());
            
            return back()
                ->withInput(['email' => $request->input('email')])
                ->with('error', "Terlalu banyak percobaan login. Silakan tunggu {$minutes} menit sebelum mencoba lagi.")
                ->with('locked', true)
                ->with('lockout_seconds', $seconds);
        }

        // Validate input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        $email = $request->input('email');
        $password = $request->input('password');

        // Get credentials from Firestore or use defaults
        $credentials = $this->getAuthCredentials();

        // Validate credentials
        if ($email === $credentials['email'] && $password === $credentials['password']) {
            // Clear login attempts on successful login
            $this->clearLoginAttempts($throttleKey);
            
            session(['user_id' => 'admin']);
            session(['role' => 'admin']);
            session(['email' => $email]);
            
            Log::info("Admin login successful: {$email}");
            
            return redirect()->route('dashboard');
        }

        // Increment failed login attempts
        $this->incrementLoginAttempts($throttleKey);
        $attemptsLeft = $this->maxAttempts - $this->getLoginAttempts($throttleKey);
        
        Log::warning("Failed login attempt for: {$email} from IP: " . $request->ip() . " (Attempts left: {$attemptsLeft})");
        
        $errorMessage = 'Email atau password salah.';
        if ($attemptsLeft > 0 && $attemptsLeft <= 3) {
            $errorMessage .= " Sisa percobaan: {$attemptsLeft}";
        }
        
        return back()
            ->withInput(['email' => $email])
            ->with('error', $errorMessage)
            ->with('attempts_left', $attemptsLeft);
    }

    /**
     * Check if user has too many login attempts
     */
    protected function hasTooManyLoginAttempts(string $key): bool
    {
        return Cache::has($key . '_lockout');
    }

    /**
     * Get remaining lockout seconds
     */
    protected function getRemainingLockoutSeconds(string $key): int
    {
        $lockoutUntil = Cache::get($key . '_lockout');
        return max(0, $lockoutUntil - time());
    }

    /**
     * Increment login attempts
     */
    protected function incrementLoginAttempts(string $key): void
    {
        $attempts = Cache::get($key, 0) + 1;
        Cache::put($key, $attempts, now()->addMinutes($this->decayMinutes));
        
        if ($attempts >= $this->maxAttempts) {
            // Set lockout
            Cache::put($key . '_lockout', time() + ($this->decayMinutes * 60), now()->addMinutes($this->decayMinutes));
        }
    }

    /**
     * Get current login attempts
     */
    protected function getLoginAttempts(string $key): int
    {
        return Cache::get($key, 0);
    }

    /**
     * Clear login attempts
     */
    protected function clearLoginAttempts(string $key): void
    {
        Cache::forget($key);
        Cache::forget($key . '_lockout');
    }

    /**
     * Get authentication credentials from Firestore
     */
    private function getAuthCredentials(): array
    {
        // Default credentials (fallback)
        $defaultCredentials = [
            'email' => 'admin@garasifyy.com',
            'password' => 'garasi2515'
        ];

        $accessToken = $this->getFirebaseAccessToken();
        
        if (!$accessToken) {
            return $defaultCredentials;
        }

        try {
            $projectId = 'garasifyy';
            $url = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/config/auth";
            
            $response = Http::withToken($accessToken)
                ->timeout(10)
                ->get($url);

            if ($response->successful()) {
                $fields = $response->json()['fields'] ?? [];
                
                return [
                    'email' => $fields['email']['stringValue'] ?? $defaultCredentials['email'],
                    'password' => $fields['password']['stringValue'] ?? $defaultCredentials['password']
                ];
            }
            
            Log::warning("Firestore Auth Config not found, using defaults");
            
        } catch (\Exception $e) {
            Log::error("Error fetching auth config: " . $e->getMessage());
        }

        return $defaultCredentials;
    }

    /**
     * Get Firebase access token with caching
     */
    private function getFirebaseAccessToken(): ?string
    {
        $serviceAccountPath = base_path('garasifyy-firebase-adminsdk-fbsvc-d5bddf5452.json');

        if (!file_exists($serviceAccountPath)) {
            return null;
        }

        try {
            // Cache token for 50 minutes (expires in 60)
            return Cache::remember('firebase_access_token', 3000, function () use ($serviceAccountPath) {
                $credentials = new ServiceAccountCredentials(
                    ['https://www.googleapis.com/auth/datastore'],
                    $serviceAccountPath
                );
                return $credentials->fetchAuthToken()['access_token'];
            });
        } catch (\Exception $e) {
            Log::error("Auth Token Error: " . $e->getMessage());
            Cache::forget('firebase_access_token');
            return null;
        }
    }

    /**
     * Handle logout
     */
    public function logout()
    {
        $email = session('email', 'unknown');
        
        session()->flush();
        
        Log::info("Admin logout: {$email}");
        
        return redirect()->route('login')->with('success', 'Anda telah keluar dari sistem');
    }
}
