/*
 * WARNING: This file was reconstructed from a partial backup.
 * It contains the initialization logic but might lack some helper functions (lines 1-800).
 * Please check if any functions are missing.
 */

/*
window.location.href = 'login.html';
            }, 1500);
        });
    }
*/

// Utility functions
function showSuccessAlert(message) {
    createCustomAlert(message, 'success');
}

function showErrorAlert(message) {
    createCustomAlert(message, 'error');
}

function createCustomAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    alertDiv.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 100);

    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
}

// Global function for package selection
window.selectPackage = function (packageName) {
    showSuccessAlert(`Paket "${packageName}" telah dipilih! Silakan hubungi kami untuk konsultasi lebih lanjut.`);
};

// Add Enhanced CSS for visual effects
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    /* Enhanced Visual Effects CSS */
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .img-container {
        overflow: hidden;
        border-radius: 15px;
    }
    
    .loading-placeholder {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
        background-size: 400% 100%;
        animation: loading-shimmer 1.5s ease-in-out infinite;
    }
    
    @keyframes loading-shimmer {
        0% { background-position: 100% 50%; }
        100% { background-position: -100% 50%; }
    }
    
    .img-fallback {
        background: linear-gradient(135deg, var(--garasifyy-accent), var(--garasifyy-dark));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--garasifyy-light);
        font-size: 1.5rem;
        text-align: center;
        gap: 10px;
        border-radius: 15px;
        padding: 20px;
    }
    
    .img-fallback i {
        font-size: 3rem;
        opacity: 0.8;
    }
    
    .img-fallback span {
        font-size: 0.9rem;
        opacity: 0.7;
    }
    
    /* Particle System */
    .particle-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
    }
    
    .particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: var(--garasifyy-accent);
        border-radius: 50%;
        animation: float-particles 6s ease-in-out infinite;
        opacity: 0.4;
        box-shadow: 0 0 6px var(--garasifyy-accent);
    }
    
    .particle:nth-child(2) { animation-delay: -1s; left: 15%; background: var(--garasifyy-yellow); box-shadow: 0 0 6px var(--garasifyy-yellow); }
    .particle:nth-child(3) { animation-delay: -2s; left: 25%; }
    .particle:nth-child(4) { animation-delay: -3s; left: 35%; background: var(--garasifyy-yellow); box-shadow: 0 0 6px var(--garasifyy-yellow); }
    .particle:nth-child(5) { animation-delay: -4s; left: 45%; }
    .particle:nth-child(6) { animation-delay: -5s; left: 55%; background: var(--garasifyy-yellow); box-shadow: 0 0 6px var(--garasifyy-yellow); }
    .particle:nth-child(7) { animation-delay: -1.5s; left: 65%; }
    .particle:nth-child(8) { animation-delay: -3.5s; left: 75%; background: var(--garasifyy-yellow); box-shadow: 0 0 6px var(--garasifyy-yellow); }
    
    @keyframes float-particles {
        0%, 100% {
            transform: translateY(100vh) rotateZ(0deg);
            opacity: 0;
        }
        10%, 90% {
            opacity: 0.4;
        }
        50% {
            transform: translateY(-100px) rotateZ(180deg);
            opacity: 0.8;
        }
    }
    
    /* Enhanced Scroll Reveal */
    .scroll-reveal {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    
    /* Glow Effects */
    .glow-effect {
        position: relative;
        overflow: visible !important;
    }
    
    .glow-effect::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, 
            var(--garasifyy-accent), 
            var(--garasifyy-yellow), 
            var(--garasifyy-accent-secondary),
            var(--garasifyy-accent));
        background-size: 400% 400%;
        border-radius: inherit;
        z-index: -1;
        filter: blur(8px);
        animation: glow-pulse 4s ease-in-out infinite alternate;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .glow-effect:hover::before {
        opacity: 0.7;
        animation-duration: 2s;
    }
    
    @keyframes glow-pulse {
        0% {
            background-position: 0% 50%;
            opacity: 0.3;
            filter: blur(8px);
        }
        50% {
            background-position: 100% 50%;
            opacity: 0.6;
            filter: blur(12px);
        }
        100% {
            background-position: 0% 50%;
            opacity: 0.3;
            filter: blur(8px);
        }
    }
    
    /* Enhanced Card Hover States */
    .card-mod {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }
    
    .card-mod:hover {
        transform: translateY(-8px) scale(1.02) !important;
        z-index: 10;
    }
    
    /* Button Loading State */
    .btn.loading {
        position: relative;
        pointer-events: none;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: button-spin 1s linear infinite;
    }
    
    @keyframes button-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Mobile Optimizations */
    @media (max-width: 768px) {
        .particle-bg {
            display: none;
        }
        
        .glow-effect::before {
            display: none;
        }
        
        .scroll-reveal {
            transform: translateY(20px) scale(0.98);
        }
    }
`;

// Add enhanced CSS
document.head.appendChild(enhancedStyle);

// Add CSS for custom alerts and animations
const style = document.createElement('style');
style.textContent = `
    .custom-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        max-width: 400px;
    }
    
    .custom-alert.show {
        transform: translateX(0);
    }
    
    .alert-success {
        background: linear-gradient(45deg, #28a745, #20c997);
    }
    
    .alert-error {
        background: linear-gradient(45deg, #dc3545, #e74c3c);
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .alert-content i {
        font-size: 1.2rem;
    }
    
    .shake {
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .service-list {
        list-style: none;
        padding: 0;
    }
    
    .service-list li {
        margin-bottom: 0.5rem;
        color: var(--garasifyy-light);
    }
`;
document.head.appendChild(style);
