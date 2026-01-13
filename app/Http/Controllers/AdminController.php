<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use Kreait\Firebase\Factory;
// use Kreait\Firebase\ServiceAccount;

class AdminController extends Controller
{
    protected $firestore;

    public function __construct()
    {
        // SDK Installation Failed on Environment. 
        // Using Mock Data Mode for Demonstration.
        // Once 'kreait/firebase-php' is installed, uncomment the logic below.
        
        /*
        $serviceAccountPath = base_path('garasifyy-firebase-adminsdk-fbsvc-d5bddf5452.json');
        
        if (file_exists($serviceAccountPath)) {
            $factory = (new Factory)->withServiceAccount($serviceAccountPath);
            $this->firestore = $factory->createFirestore()->database();
        }
        */
    }

    public function index()
    {
        if (!session('user_id')) {
            return redirect()->route('login');
        }

        // MOCK DATA (Until SDK Installed & Configured)
        // In real app: $projects = $this->firestore->collection('projects')->documents();
        
        $projects = [
            [
                'id' => '1',
                'serviceType' => 'Engine Upgrade',
                'plateNumber' => 'B 1234 CD',
                'carModel' => 'Honda Civic',
                'status' => 'waiting',
                'bookingDate' => now()->addDays(2),
                'totalCost' => 5000000
            ],
            [
                'id' => '2',
                'serviceType' => 'Body Paint',
                'plateNumber' => 'D 5678 EF',
                'carModel' => 'Toyota Yaris',
                'status' => 'on_progress',
                'bookingDate' => now()->subDays(1),
                'totalCost' => 3500000
            ]
        ];

        return view('dashboard', compact('projects'));
    }
}
