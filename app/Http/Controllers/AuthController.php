<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('login');
    }

    public function login(Request $request)
    {
        // Simple manual login for Admin (Hardcoded for UAS simplicity, or verify via Firebase)
        // For this demo: Check if email is 'admin@garasifyy.com' and password 'admin123'
        
        $email = $request->input('email');
        $password = $request->input('password');

        if ($email === 'admin@garasifyy.com' && $password === 'admin123') {
            session(['user_id' => 'admin']);
            session(['role' => 'admin']);
            return redirect()->route('dashboard');
        }

        return back()->with('error', 'Invalid credentials');
    }

    public function logout()
    {
        session()->flush();
        return redirect()->route('login');
    }
}
