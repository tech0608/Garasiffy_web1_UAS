// js/firebase-config.js - Firebase Configuration for Garasifyy Admin Panel
// Connects to the same Firebase project as the mobile app

// Firebase configuration - same as mobile app project "garasifyy"
export const firebaseConfig = {
    apiKey: "AIzaSyCOaRCFiH--lrTQgaTdh-6HyqM0_DY2DB4",
    authDomain: "garasifyy.firebaseapp.com",
    projectId: "garasifyy",
    storageBucket: "garasifyy.firebasestorage.app",
    messagingSenderId: "189603872814",
    appId: "1:189603872814:web:65708c604ad6e9ee1ddfbf",
    measurementId: "G-JH69VW685Y"
};

// Firestore collection names (same as mobile app)
export const COLLECTIONS = {
    PROJECTS: 'projects',
    SERVICES: 'services',
    PACKAGES: 'packages',
    CUSTOMERS: 'customers',
    QUEUE: 'queue',
    BOOKINGS: 'bookings'
};

// Project status constants (sync with mobile app)
export const PROJECT_STATUS = {
    WAITING: 'waiting',
    ON_PROGRESS: 'on_progress',
    COMPLETED: 'completed'
};

// Service categories (sync with mobile app)
export const SERVICE_CATEGORIES = {
    PERFORMANCE: 'Performance',
    EXTERIOR: 'Exterior',
    INTERIOR: 'Interior',
    MAINTENANCE: 'Maintenance'
};
