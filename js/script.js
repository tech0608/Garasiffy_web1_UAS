// js/script.js - Enhanced Garasifyy Car Modification Website with Visual Effects

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Project Garasifyy | Pemrograman Web 1 telah dimuat dengan efek visual enhanced!"); 

    // Initialize all features
    initVisualEffects(); // Add visual effects first
    initNavbarScroll();
    initAnimations();
    initLoginValidation();
    initDetailPage();
    initConsultationForm();
    initScrollToTop();
    initMobileFeatures();
    initDashboardNavigation();
    initIndexNavigation();
    
    // Enhanced Visual Effects System
    function initVisualEffects() {
        console.log('✨ Initializing enhanced visual effects...');
        
        // Scroll Reveal Animation
        initScrollReveal();
        
        // Particle Background
        createParticleBackground();
        
        // Enhanced Button Effects
        enhanceButtons();
        
        // Image Loading Enhancement
        enhanceImages();
        
        // Glow Effects
        addGlowEffects();
        
        // Enhanced Navbar
        enhanceNavbar();
    }
    
    function initScrollReveal() {
        const elements = document.querySelectorAll('.card-mod, .service-card, .hero-content, .testimonial-card');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-reveal', 'revealed');
                    entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                }
            });
        }, observerOptions);
        
        elements.forEach(element => {
            element.classList.add('scroll-reveal');
            observer.observe(element);
        });
    }

    function createParticleBackground() {
        // Only add particles on desktop for performance
        if (window.innerWidth > 768) {
            const particleContainer = document.createElement('div');
            particleContainer.className = 'particle-bg';
            
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (4 + Math.random() * 4) + 's';
                particleContainer.appendChild(particle);
            }
            
            document.body.appendChild(particleContainer);
        }
    }

    function enhanceButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Enhanced hover effects
            button.addEventListener('mouseenter', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                    this.style.boxShadow = '0 8px 25px rgba(255, 0, 64, 0.3)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }

    function enhanceImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading state
            img.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
            
            // Check if image is already loaded
            if (img.complete && img.naturalHeight !== 0) {
                img.style.opacity = '1';
            } else {
                img.style.opacity = '0';
                
                // Add load event listener
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                    console.log('✅ Image loaded successfully:', this.src);
                });
                
                // Add error event listener
                img.addEventListener('error', function() {
                    console.warn('⚠️ Image failed to load:', this.src);
                    this.style.opacity = '1'; // Still show the fallback
                });
            }
            
            // Add hover effects for gallery images
            if (img.closest('.gallery-item')) {
                img.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                });
                
                img.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            }
        });
        
        // Force reload images if they haven't loaded after 5 seconds
        setTimeout(() => {
            images.forEach(img => {
                if (img.style.opacity === '0') {
                    console.log('🔄 Force reloading image:', img.src);
                    const src = img.src;
                    img.src = '';
                    img.src = src;
                }
            });
        }, 5000);
    }

    function addGlowEffects() {
        // Add glow to every 3rd card for variety
        const cards = document.querySelectorAll('.card-mod, .service-card');
        cards.forEach((card, index) => {
            if (index % 3 === 1) {
                card.classList.add('glow-effect');
            }
        });
        
        // Add glow to primary buttons
        const primaryButtons = document.querySelectorAll('.btn-primary');
        primaryButtons.forEach(btn => {
            btn.classList.add('glow-effect');
        });
    }

    function enhanceNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', function() {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    navbar.style.background = 'rgba(20, 20, 20, 0.98)';
                    navbar.style.backdropFilter = 'blur(20px)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
                } else {
                    navbar.style.background = 'rgba(20, 20, 20, 0.9)';
                    navbar.style.backdropFilter = 'blur(15px)';
                    navbar.style.boxShadow = '';
                }
                
                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
            });
            
            navbar.style.transition = 'all 0.3s ease';
        }
    }
    
    // Initialize dashboard navigation for detail links
    function initDashboardNavigation() {
        console.log('🚗 Garasifyy: Initializing dashboard navigation...');
        
        // Wait for DOM to be fully loaded
        setTimeout(() => {
            // Service card click handlers
            const serviceCards = document.querySelectorAll('[data-service]');
            console.log('🔍 Found service cards:', serviceCards.length, serviceCards);
            
            if (serviceCards.length === 0) {
                console.warn('⚠️ No service cards found! Check if dashboard.html has [data-service] attributes');
                return;
            }
            
            serviceCards.forEach((card, index) => {
                const serviceType = card.getAttribute('data-service');
                console.log(`📋 Card ${index + 1}: ${serviceType}`);
                
                // Remove any existing listeners
                card.removeEventListener('click', handleCardClick);
                card.addEventListener('click', handleCardClick);
            });
            
            // Handle card clicks
            function handleCardClick(e) {
                const card = e.currentTarget;
                const serviceType = card.getAttribute('data-service');
                
                console.log('🖱️ Card clicked!');
                console.log('   Service type:', serviceType);
                console.log('   Target element:', e.target.tagName, e.target.className);
                
                // If clicking directly on button or link, let it handle naturally
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    console.log('🔗 Clicking on button/link - letting it handle navigation');
                    return true;
                }
                
                // If clicking on icon inside button
                if (e.target.closest('a') || e.target.closest('button')) {
                    console.log('🔗 Clicking on element inside button - letting button handle');
                    return true;
                }
                
                // Handle card body clicks
                if (serviceType) {
                    const url = `detail.html?info=${serviceType}`;
                    console.log(`🚀 Navigating to: ${url}`);
                    window.location.href = url;
                } else {
                    console.error('❌ No service type found on clicked card');
                }
            }
            
            // Also handle dropdown navigation  
            const dropdownLinks = document.querySelectorAll('.dropdown-item[href*="detail.html"]');
            console.log('📝 Found dropdown links:', dropdownLinks.length);
            
            dropdownLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    console.log('📋 Dropdown navigation to:', href);
                    // Let default behavior work
                });
            });
            
        }, 100); // Small delay to ensure DOM is ready
    }
    
    // Initialize navigation for index page cards
    function initIndexNavigation() {
        console.log('🏠 Garasifyy: Initializing index navigation...');
        
        setTimeout(() => {
            // Find card-mod elements in index page
            const indexCards = document.querySelectorAll('.card-mod');
            console.log('🔍 Found index cards:', indexCards.length);
            
            if (indexCards.length === 0) {
                console.log('ℹ️ No index cards found - probably not on index page');
                return;
            }
            
            indexCards.forEach((card, index) => {
                console.log(`📋 Index Card ${index + 1}: adding click handler`);
                
                card.addEventListener('click', function(e) {
                    console.log('🖱️ Index card clicked!');
                    console.log('   Target element:', e.target.tagName, e.target.className);
                    
                    // If clicking on button or link, let it handle naturally
                    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                        console.log('🔗 Clicking on button/link - letting it handle navigation');
                        return true;
                    }
                    
                    // If clicking on icon inside button or link
                    if (e.target.closest('a') || e.target.closest('button')) {
                        console.log('🔗 Clicking on element inside button - letting button handle');
                        return true;
                    }
                    
                    // Find the link inside this card
                    const cardLink = card.querySelector('a[href*="detail.html"]');
                    if (cardLink) {
                        const href = cardLink.getAttribute('href');
                        console.log(`🚀 Index card navigating to: ${href}`);
                        window.location.href = href;
                    } else {
                        console.error('❌ No detail link found in this card');
                    }
                });
                
                // Add hover effect for better UX
                card.style.cursor = 'pointer';
                card.style.transition = 'all 0.3s ease';
                
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 10px 25px rgba(255, 0, 64, 0.2)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '';
                });
            });
            
        }, 100);
    }
    
    // Navbar scroll effect
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar-custom');
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    // Scroll to top functionality
    function initScrollToTop() {
        // Create scroll to top button if it doesn't exist
        if (!document.querySelector('.scroll-to-top')) {
            const scrollButton = document.createElement('button');
            scrollButton.className = 'scroll-to-top';
            scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollButton.setAttribute('aria-label', 'Scroll to top');
            document.body.appendChild(scrollButton);

            // Show/hide button based on scroll position
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    scrollButton.classList.add('show');
                } else {
                    scrollButton.classList.remove('show');
                }
            });

            // Smooth scroll to top when clicked
            scrollButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Mobile-specific features
    function initMobileFeatures() {
        // Mobile menu toggle for dashboard
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            // Create mobile menu button
            const mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-menu-toggle';
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
            document.body.appendChild(mobileToggle);

            mobileToggle.addEventListener('click', function() {
                sidebar.classList.toggle('show');
                document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', function(e) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        }

        // Improved touch interactions for mobile
        if ('ontouchstart' in window) {
            document.querySelectorAll('.card-mod, .gallery-item, .testimonial-card').forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });
                
                element.addEventListener('touchend', function() {
                    this.style.transform = '';
                });
            });
        }
    }

    // Animation on scroll
    function initAnimations() {
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.fade-in-up, .slide-in-left');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) translateX(0)';
                }
            });
        };

        // Set initial styles for animated elements
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease-out';
        });

        document.querySelectorAll('.slide-in-left').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-50px)';
            el.style.transition = 'all 0.8s ease-out';
        });

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Run on page load
    }

    // Enhanced login validation - supports admin and member
    function initLoginValidation() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const emailInput = document.getElementById('inputEmail');
                const passwordInput = document.getElementById('inputPassword');
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();

                // Show loading state
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading-spinner me-2"></span>Memproses...';
                submitBtn.disabled = true;

                // Simulate loading delay
                setTimeout(() => {
                    // Admin credentials
                    const adminEmail = "admin@garasifyy.com";
                    const adminPassword = "admin123";
                    
                    // Member credentials
                    const memberEmail = "user@utb.ac.id";
                    const memberPassword = "utsweb1";

                    if (email === adminEmail && password === adminPassword) {
                        // Admin login - redirect to admin dashboard
                        showSuccessAlert("Login Admin Berhasil! Mengarahkan ke Dashboard Admin...");
                        // Store admin session
                        sessionStorage.setItem('userRole', 'admin');
                        sessionStorage.setItem('userEmail', email);
                        setTimeout(() => {
                            window.location.href = 'admin.html';
                        }, 1500);
                    } else if (email === memberEmail && password === memberPassword) {
                        // Member login - redirect to download app page
                        showSuccessAlert("Login Berhasil! Silakan download aplikasi mobile Garasifyy.");
                        sessionStorage.setItem('userRole', 'member');
                        sessionStorage.setItem('userEmail', email);
                        setTimeout(() => {
                            window.location.href = 'download-app.html';
                        }, 1500);
                    } else {
                        showErrorAlert("Login Gagal! Email atau Password salah.<br><strong>Admin:</strong> admin@garasifyy.com / admin123<br><strong>Member:</strong> user@utb.ac.id / utsweb1");
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        
                        // Add shake animation to form
                        loginForm.classList.add('shake');
                        setTimeout(() => loginForm.classList.remove('shake'), 500);
                    }
                }, 1000);
            });
        }
    }


    // Enhanced detail page content
    function initDetailPage() {
        const detailTitle = document.getElementById('detail-title');
        if (detailTitle) {
            const params = new URLSearchParams(window.location.search);
            const infoType = params.get('info');
            const detailContent = document.getElementById('detail-content');
            const packagesContainer = document.getElementById('packages-container');
            
            const serviceData = {
                'performa': {
                    title: 'Upgrade Performa Ekstrem',
                    content: `
                        <div class="service-intro">
                            <img src="https://images.unsplash.com/photo-1562141961-5a2e8dffba9d?auto=format&fit=crop&w=800&h=400&q=80" 
                                 class="img-fluid rounded shadow mb-4" alt="High Performance Turbo Engine Modification"
                                 onerror="this.src='https://source.unsplash.com/800x400/?engine,turbo,performance'; this.onerror=function(){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'400\' viewBox=\'0 0 800 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Ctext x=\'50%25\' y=\'45%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'24\' fill=\'white\'%3E🔧 ENGINE PERFORMANCE UPGRADE 🔧%3C/text%3E%3Ctext x=\'50%25\' y=\'55%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'16\' fill=\'white\'%3ETurbo • ECU • Cold Air Intake%3C/text%3E%3C/svg%3E'};">
                            <p class="lead">Tingkatkan performa mobil Anda dengan teknologi terdepan dan komponen berkualitas premium. 
                            Tim ahli kami akan mengoptimalkan setiap aspek mesin untuk memberikan daya dan torsi maksimal.</p>
                            
                            <div class="row my-4">
                                <div class="col-md-6 mb-3">
                                    <img src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=640&h=400&q=80" 
                                         class="img-fluid rounded shadow" alt="High Performance Turbocharger System"
                                         onerror="this.src='https://source.unsplash.com/640x400/?turbocharger,engine-bay'; this.onerror=function(){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'640\' height=\'400\' viewBox=\'0 0 640 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Ctext x=\'50%25\' y=\'45%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'20\' fill=\'white\'%3E🌪️ TURBO SYSTEM 🌪️%3C/text%3E%3Ctext x=\'50%25\' y=\'55%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'14\' fill=\'white\'%3EHigh Performance Turbocharger%3C/text%3E%3C/svg%3E'};">
                                    <h6 class="text-center mt-2 text-danger">Turbocharger Installation</h6>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <img src="https://images.pexels.com/photos/3612932/pexels-photo-3612932.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop" 
                                         class="img-fluid rounded shadow" alt="ECU Engine Tuning and Remapping"
                                         onerror="this.src='https://source.unsplash.com/640x400/?ecu,computer,tuning'; this.onerror=function(){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'640\' height=\'400\' viewBox=\'0 0 640 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Ctext x=\'50%25\' y=\'45%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'20\' fill=\'white\'%3E💻 ECU TUNING 💻%3C/text%3E%3Ctext x=\'50%25\' y=\'55%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'14\' fill=\'white\'%3EEngine Control Unit Remapping%3C/text%3E%3C/svg%3E'};">
                                    <h6 class="text-center mt-2 text-danger">ECU Remapping & Tuning</h6>
                                </div>
                            </div>
                            
                            <h4 class="text-danger mt-4 mb-3">Layanan Performa Meliputi:</h4>
                            <div class="row">
                                <div class="col-md-6">
                                    <ul class="service-list">
                                        <li><i class="fas fa-check text-success me-2"></i>ECU Tuning & Remapping</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Turbocharger Installation</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Cold Air Intake System</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Performance Exhaust</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <ul class="service-list">
                                        <li><i class="fas fa-check text-success me-2"></i>Racing Brake System</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Suspension Upgrade</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Dyno Testing</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Performance Monitoring</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `,
                    packages: [
                        {
                            name: 'Basic Performance',
                            price: 'Rp 15.000.000',
                            features: ['ECU Remapping', 'Cold Air Intake', 'Performance Filter', 'Basic Dyno Test']
                        },
                        {
                            name: 'Advanced Performance',
                            price: 'Rp 35.000.000',
                            features: ['Turbocharger Kit', 'Intercooler Upgrade', 'ECU Tuning', 'Exhaust System', 'Brake Upgrade']
                        },
                        {
                            name: 'Extreme Performance',
                            price: 'Rp 75.000.000',
                            features: ['Full Engine Build', 'Racing Components', 'Custom Turbo Setup', 'Roll Cage', 'Track Preparation']
                        }
                    ]
                },
                'body': {
                    title: 'Modifikasi Body Kit & Estetika',
                    content: `
                        <div class="service-intro">
                            <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&h=400&q=80" 
                                 class="img-fluid rounded shadow mb-4" alt="Wide Body Extreme Car Modification"
                                 onerror="this.src='https://source.unsplash.com/800x400/?sports-car,body-kit'; this.onerror=function(){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'400\' viewBox=\'0 0 800 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Ctext x=\'50%25\' y=\'45%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'24\' fill=\'white\'%3E🚗 CUSTOM BODY KIT STYLING 🚗%3C/text%3E%3Ctext x=\'50%25\' y=\'55%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'16\' fill=\'white\'%3EAerodynamic • Sporty • Aggressive%3C/text%3E%3C/svg%3E'};">
                            <p class="lead">Ubah penampilan mobil Anda menjadi lebih agresif dan sporty dengan body kit custom. 
                            Kami menggunakan material berkualitas tinggi dan desain yang telah teruji aerodinamisnya.</p>
                            
                            <div class="row my-4">
                                <div class="col-md-6 mb-3">
                                    <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=640&h=400&q=80" 
                                         class="img-fluid rounded shadow" alt="Wide Body Extreme Supercar"
                                         onerror="this.src='https://source.unsplash.com/640x400/?wide-body-extreme,supercar'; this.onerror=function(){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'640\' height=\'400\' viewBox=\'0 0 640 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Cg transform=\'translate(320,160)\'%3E%3Cpath d=\'M-120,-60 L-80,-80 L80,-80 L120,-60 L120,60 L80,80 L-80,80 L-120,60 Z\' fill=\'white\' opacity=\'0.3\'/%3E%3Cpath d=\'M-100,-50 L-70,-60 L70,-60 L100,-50 L100,50 L70,60 L-70,60 L-100,50 Z\' fill=\'white\'/%3E%3Ccircle cx=\'-60\' cy=\'50\' r=\'20\' fill=\'%23ff0040\'/%3E%3Ccircle cx=\'60\' cy=\'50\' r=\'20\' fill=\'%23ff0040\'/%3E%3Cpath d=\'M-80,-40 L80,-40 L60,-30 L-60,-30 Z\' fill=\'%23ff0040\'/%3E%3C/g%3E%3Ctext x=\'50%25\' y=\'75%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'20\' fill=\'white\' font-weight=\'bold\'%3E🏎️ WIDE BODY EXTREME 🏎️%3C/text%3E%3Ctext x=\'50%25\' y=\'85%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'14\' fill=\'white\'%3EAggressive Aero Package%3C/text%3E%3C/svg%3E'};">
                                    <h6 class="text-center mt-2 text-danger">Wide Body Extreme Conversion</h6>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <img src="https://images.unsplash.com/photo-1607603750916-e3d5ee2e38ca?auto=format&fit=crop&w=640&h=400&q=80" 
                                         class="img-fluid rounded shadow" alt="Custom Car Paint and Vinyl Wrap"
                                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'640\' height=\'400\' viewBox=\'0 0 640 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'20\' fill=\'white\'%3ECustom Paint%3C/text%3E%3C/svg%3E';">
                                    <h6 class="text-center mt-2 text-danger">Premium Paint & Graphics</h6>
                                </div>
                            </div>
                            
                            <h4 class="text-danger mt-4 mb-3">Layanan Body & Estetika:</h4>
                            <div class="row">
                                <div class="col-md-6">
                                    <ul class="service-list">
                                        <li><i class="fas fa-check text-success me-2"></i>Custom Body Kit Design</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Wide Body Conversion</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Carbon Fiber Components</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Premium Paint Job</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <ul class="service-list">
                                        <li><i class="fas fa-check text-success me-2"></i>Vinyl Wrapping</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Custom Graphics</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Aero Package</li>
                                        <li><i class="fas fa-check text-success me-2"></i>LED Lighting Kit</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `,
                    packages: [
                        {
                            name: 'Essential Styling',
                            price: 'Rp 12.000.000',
                            features: ['Front Lip Spoiler', 'Side Skirts', 'Rear Diffuser', 'Basic Paint Touch-up']
                        },
                        {
                            name: 'Complete Body Kit',
                            price: 'Rp 28.000.000',
                            features: ['Full Body Kit', 'Custom Paint', 'Vinyl Graphics', 'LED Lighting', 'Window Tinting']
                        },
                        {
                            name: 'Wide Body Extreme',
                            price: 'Rp 65.000.000',
                            features: ['Wide Body Conversion', 'Carbon Fiber Parts', 'Custom Livery', 'Aero Package', 'Show Car Finish']
                        }
                    ]
                },
                'interior': {
                    title: 'Interior, Audio & Kenyamanan',
                    content: `
                        <div class="service-intro">
                            <img src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&h=400&q=80" 
                                 class="img-fluid rounded shadow mb-4" alt="Car Interior with Super Audio System"
                                 onerror="this.src='https://source.unsplash.com/800x400/?car-audio,luxury-interior'; this.onerror=function(){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'400\' viewBox=\'0 0 800 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Cg transform=\'translate(400,200)\'%3E%3Ccircle cx=\'-100\' cy=\'0\' r=\'40\' fill=\'white\' opacity=\'0.8\'/%3E%3Ccircle cx=\'0\' cy=\'-50\' r=\'50\' fill=\'white\' opacity=\'0.9\'/%3E%3Ccircle cx=\'100\' cy=\'0\' r=\'40\' fill=\'white\' opacity=\'0.8\'/%3E%3Ccircle cx=\'-100\' cy=\'0\' r=\'25\' fill=\'%23ff0040\'/%3E%3Ccircle cx=\'0\' cy=\'-50\' r=\'30\' fill=\'%23ff0040\'/%3E%3Ccircle cx=\'100\' cy=\'0\' r=\'25\' fill=\'%23ff0040\'/%3E%3Ctext x=\'0\' y=\'80\' text-anchor=\'middle\' font-size=\'16\' fill=\'white\' font-weight=\'bold\'%3E♪♪♪ SUPER BASS ♪♪♪%3C/text%3E%3C/g%3E%3Ctext x=\'50%25\' y=\'85%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'24\' fill=\'white\' font-weight=\'bold\'%3E🎵 PREMIUM CAR AUDIO SYSTEM 🎵%3C/text%3E%3C/svg%3E'};";>
                            <p class="lead">Ciptakan pengalaman berkendara yang tak terlupakan dengan interior mewah dan sistem audio berkualitas tinggi. 
                            Setiap detail dirancang untuk kenyamanan dan gaya hidup Anda.</p>
                            
                            <div class="row my-4">
                                <div class="col-md-6 mb-3">
                                    <img src="https://images.unsplash.com/photo-1555626906-fcf10d6c933c?auto=format&fit=crop&w=640&h=400&q=80" 
                                         class="img-fluid rounded shadow" alt="Premium Racing Interior with Leather Seats"
                                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'640\' height=\'400\' viewBox=\'0 0 640 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'20\' fill=\'white\'%3ECustom Seats%3C/text%3E%3C/svg%3E';">
                                    <h6 class="text-center mt-2 text-danger">Premium Leather Seats</h6>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <img src="https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=640&h=400&q=80" 
                                         class="img-fluid rounded shadow" alt="Car with Super Audio System Installation"ystem with Subwoofer"
                                         onerror="this.src='https://source.unsplash.com/640x400/?subwoofer,speakers,audio'; this.onerror=function(){this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'640\' height=\'400\' viewBox=\'0 0 640 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ff0040\'/%3E%3Cg transform=\'translate(320,150)\'%3E%3Crect x=\'-80\' y=\'-50\' width=\'160\' height=\'100\' rx=\'10\' fill=\'white\' opacity=\'0.9\'/%3E%3Crect x=\'-70\' y=\'-40\' width=\'140\' height=\'80\' rx=\'5\' fill=\'%23ff0040\'/%3E%3Ccircle cx=\'-40\' cy=\'0\' r=\'15\' fill=\'white\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'20\' fill=\'white\'/%3E%3Ccircle cx=\'40\' cy=\'0\' r=\'15\' fill=\'white\'/%3E%3Ccircle cx=\'-40\' cy=\'0\' r=\'8\' fill=\'%23333\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'12\' fill=\'%23333\'/%3E%3Ccircle cx=\'40\' cy=\'0\' r=\'8\' fill=\'%23333\'/%3E%3C/g%3E%3Cg transform=\'translate(320,280)\'%3E%3Crect x=\'-60\' y=\'-30\' width=\'120\' height=\'60\' rx=\'8\' fill=\'white\' opacity=\'0.8\'/%3E%3Crect x=\'-50\' y=\'-20\' width=\'100\' height=\'40\' rx=\'5\' fill=\'%23333\'/%3E%3Ctext x=\'0\' y=\'5\' text-anchor=\'middle\' font-size=\'12\' fill=\'white\' font-weight=\'bold\'%3ESUPER BASS%3C/text%3E%3C/g%3E%3Ctext x=\'50%25\' y=\'90%25\' dominant-baseline=\'central\' text-anchor=\'middle\' font-size=\'18\' fill=\'white\' font-weight=\'bold\'%3E🔊 SUPER AUDIO SYSTEM 🔊%3C/text%3E%3C/svg%3E'};">
                                    <h6 class="text-center mt-2 text-danger">Super Audio System</h6>
                                </div>
                            </div>
                            
                            <h4 class="text-danger mt-4 mb-3">Layanan Interior & Audio:</h4>
                            <div class="row">
                                <div class="col-md-6">
                                    <ul class="service-list">
                                        <li><i class="fas fa-check text-success me-2"></i>Premium Leather Seats</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Custom Dashboard</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Ambient Lighting</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Sound Deadening</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <ul class="service-list">
                                        <li><i class="fas fa-check text-success me-2"></i>High-End Audio System</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Custom Subwoofer</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Entertainment System</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Climate Control</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `,
                    packages: [
                        {
                            name: 'Comfort Package',
                            price: 'Rp 18.000.000',
                            features: ['Seat Covers Upgrade', 'Basic Audio System', 'Interior Lighting', 'Steering Wheel Cover']
                        },
                        {
                            name: 'Luxury Interior',
                            price: 'Rp 42.000.000',
                            features: ['Leather Seat Retrim', 'Premium Audio', 'Custom Dashboard', 'Ambient Lighting', 'Sound Dampening']
                        },
                        {
                            name: 'VIP Experience',
                            price: 'Rp 85.000.000',
                            features: ['Full Alcantara Interior', 'Hi-Fi Audio System', 'Entertainment Package', 'Massage Seats', 'Custom Everything']
                        }
                    ]
                }
            };

            const service = serviceData[infoType];
            if (service) {
                detailTitle.innerText = service.title;
                detailContent.innerHTML = service.content;
                
                // Generate package cards
                packagesContainer.innerHTML = service.packages.map(pkg => `
                    <div class="col-md-4 mb-4">
                        <div class="package-card">
                            <h4>${pkg.name}</h4>
                            <div class="package-price">${pkg.price}</div>
                            <ul class="package-features">
                                ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                            <button class="btn btn-danger w-100" onclick="selectPackage('${pkg.name}')">
                                <i class="fas fa-shopping-cart me-2"></i>Pilih Paket
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                detailTitle.innerText = 'Detail Informasi Umum Garasifyy';
                detailContent.innerHTML = `
                    <p class="lead">Selamat datang di halaman detail layanan Garasifyy.</p>
                    <p>Silakan pilih layanan spesifik dari <a href="index.html" class="text-danger">halaman beranda</a> untuk melihat informasi lengkap.</p>
                `;
            }
        }
    }

    // Consultation form
    function initConsultationForm() {
        const consultationForm = document.getElementById('consultation-form');
        if (consultationForm) {
            consultationForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const formData = new FormData(consultationForm);
                const name = consultationForm.querySelector('input[placeholder="Nama Lengkap"]').value;
                const phone = consultationForm.querySelector('input[placeholder="No. WhatsApp"]').value;
                const carType = consultationForm.querySelector('select').value;
                const message = consultationForm.querySelector('textarea').value;
                
                if (name && phone) {
                    const whatsappMessage = encodeURIComponent(
                        `Halo Garasifyy! Saya ${name} ingin konsultasi modifikasi mobil.\n\n` +
                        `Detail:\n` +
                        `📱 Nomor: ${phone}\n` +
                        `🚗 Jenis Mobil: ${carType}\n` +
                        `💭 Keinginan: ${message}\n\n` +
                        `Terima kasih!`
                    );
                    
                    window.open(`https://wa.me/6281234567890?text=${whatsappMessage}`, '_blank');
                } else {
                    showErrorAlert('Mohon lengkapi nama dan nomor WhatsApp.');
                }
            });
        }
    }

    // Logout functionality
    const logoutButton = document.querySelector('#logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            showSuccessAlert('Anda telah keluar. Sampai jumpa!');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

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
    window.selectPackage = function(packageName) {
        showSuccessAlert(`Paket "${packageName}" telah dipilih! Silakan hubungi kami untuk konsultasi lebih lanjut.`);
    };
});

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