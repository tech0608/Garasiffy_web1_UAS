<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    protected $projectId;
    protected $accessToken;
    protected $firebaseError = null;

    /**
     * Constructor - Initialize Firebase connection
     */
    public function __construct()
    {
        $this->initializeFirebase();
    }

    /**
     * Initialize Firebase connection with caching
     */
    private function initializeFirebase(): void
    {
        $serviceAccountPath = base_path('garasifyy-firebase-adminsdk-fbsvc-d5bddf5452.json');
        
        if (!file_exists($serviceAccountPath)) {
            $this->firebaseError = 'Service account file not found';
            return;
        }

        try {
            // Parse Project ID from JSON
            $json = json_decode(file_get_contents($serviceAccountPath), true);
            $this->projectId = $json['project_id'] ?? 'garasifyy';

            // Cache access token for 50 minutes (token expires in 60 min)
            $this->accessToken = Cache::remember('firebase_access_token', 3000, function () use ($serviceAccountPath) {
                $scopes = ['https://www.googleapis.com/auth/datastore'];
                $credentials = new ServiceAccountCredentials($scopes, $serviceAccountPath);
                return $credentials->fetchAuthToken()['access_token'];
            });
            
        } catch (\Exception $e) {
            $this->firebaseError = $e->getMessage();
            Log::error('Firebase Auth failed: ' . $e->getMessage());
            // Clear cache if token fetch failed
            Cache::forget('firebase_access_token');
        }
    }

    /**
     * Fetch data from Firestore collection
     */
    private function fetchFirestoreData(string $collection): array
    {
        if (!$this->accessToken) {
            return [];
        }

        $url = "https://firestore.googleapis.com/v1/projects/{$this->projectId}/databases/(default)/documents/{$collection}";
        
        try {
            $response = Http::withToken($this->accessToken)
                ->timeout(10)
                ->get($url);
            
            if ($response->successful()) {
                $documents = $response->json()['documents'] ?? [];
                
                return array_map(function ($doc) {
                    return $this->parseFirestoreDocument($doc);
                }, $documents);
            }
            
            Log::error("Firestore API Error [{$collection}]: " . $response->body());
            
        } catch (\Exception $e) {
            Log::error("Firestore Request failed: " . $e->getMessage());
        }
        
        return [];
    }

    /**
     * Parse Firestore document to simple array
     */
    private function parseFirestoreDocument(array $doc): array
    {
        $id = basename($doc['name']);
        $fields = $doc['fields'] ?? [];
        $data = ['id' => $id];
        
        foreach ($fields as $key => $value) {
            $data[$key] = $this->parseFirestoreValue($value);
        }
        
        return $data;
    }

    /**
     * Parse Firestore field value to PHP value
     */
    private function parseFirestoreValue(array $value)
    {
        // Handle different Firestore value types
        if (isset($value['stringValue'])) {
            return $value['stringValue'];
        }
        if (isset($value['integerValue'])) {
            return (int) $value['integerValue'];
        }
        if (isset($value['doubleValue'])) {
            return (float) $value['doubleValue'];
        }
        if (isset($value['booleanValue'])) {
            return (bool) $value['booleanValue'];
        }
        if (isset($value['nullValue'])) {
            return null;
        }
        if (isset($value['timestampValue'])) {
            return $value['timestampValue'];
        }
        if (isset($value['arrayValue'])) {
            return array_map([$this, 'parseFirestoreValue'], $value['arrayValue']['values'] ?? []);
        }
        if (isset($value['mapValue'])) {
            $result = [];
            foreach ($value['mapValue']['fields'] ?? [] as $k => $v) {
                $result[$k] = $this->parseFirestoreValue($v);
            }
            return $result;
        }
        
        // Fallback: return first value
        return reset($value);
    }

    /**
     * Calculate statistics from projects data
     */
    private function calculateStats(array $projects): array
    {
        $stats = [
            'totalAntrian' => count($projects),
            'proyekAktif' => 0,
            'selesaiBulan' => 0,
            'revenue' => 0
        ];

        $activeStatuses = ['active', 'on_progress', 'On Progress', 'waiting', 'process'];
        $completedStatuses = ['completed', 'selesai', 'paid'];
        $currentMonth = date('Y-m');

        foreach ($projects as $project) {
            $status = strtolower($project['status'] ?? '');
            
            // Count active projects
            if (in_array($project['status'] ?? '', $activeStatuses) || in_array($status, $activeStatuses)) {
                $stats['proyekAktif']++;
            }
            
            // Count completed this month
            if (in_array($status, $completedStatuses)) {
                $completedAt = $project['completedAt'] ?? $project['updatedAt'] ?? null;
                if ($completedAt && str_starts_with($completedAt, $currentMonth)) {
                    $stats['selesaiBulan']++;
                }
            }
            
            // Calculate revenue from completed projects
            if (in_array($status, $completedStatuses)) {
                $stats['revenue'] += (int) ($project['totalCost'] ?? $project['cost'] ?? 0);
            }
        }

        return $stats;
    }

    /**
     * Dashboard index page
     */
    public function index(Request $request)
    {
        // Check authentication
        if (!session('user_id')) {
            return redirect()->route('login');
        }

        // Debug Mode
        if ($request->has('debug_firebase')) {
            return response()->json([
                'project_id' => $this->projectId,
                'has_token' => !empty($this->accessToken),
                'token_error' => $this->firebaseError,
                'projects_count' => count($this->fetchFirestoreData('projects')),
                'services_count' => count($this->fetchFirestoreData('services')),
            ]);
        }

        // Fetch Data
        $projects = [];
        $services = [];
        $stats = [
            'totalAntrian' => 0,
            'proyekAktif' => 0,
            'selesaiBulan' => 0,
            'revenue' => 0
        ];

        if ($this->accessToken) {
            $projects = $this->fetchFirestoreData('projects');
            $services = $this->fetchFirestoreData('services');
            $stats = $this->calculateStats($projects);
        }

        // Use sample data only in development if no data
        if (empty($projects) && config('app.debug')) {
            $projects = $this->getSampleProjects();
            $stats = $this->getSampleStats();
        }

        return view('dashboard', compact('projects', 'services', 'stats'));
    }

    /**
     * Get sample projects for development
     */
    private function getSampleProjects(): array
    {
        return [
            [
                'id' => 'PRJ001',
                'customer' => 'Ahmad Rizki',
                'carModel' => 'Honda Civic 2022',
                'serviceType' => 'Body Kit',
                'status' => 'On Progress',
                'progress' => 60
            ],
            [
                'id' => 'PRJ002',
                'customer' => 'Budi Santoso',
                'carModel' => 'Toyota Supra 2023',
                'serviceType' => 'Engine Upgrade',
                'status' => 'Planning',
                'progress' => 10
            ],
            [
                'id' => 'PRJ003',
                'customer' => 'Citra Dewi',
                'carModel' => 'Mazda MX-5 2021',
                'serviceType' => 'Interior Audio',
                'status' => 'Completed',
                'progress' => 100
            ]
        ];
    }

    /**
     * Get sample stats for development
     */
    private function getSampleStats(): array
    {
        return [
            'totalAntrian' => 12,
            'proyekAktif' => 5,
            'selesaiBulan' => 8,
            'revenue' => 245000000
        ];
    }
}
