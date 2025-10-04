// Smooth scrolling and navigation functionality
class NeuralGridLanding {
    constructor() {
        this.currentSection = 0;
        this.sections = document.querySelectorAll('.section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.progressBar = document.querySelector('.progress-fill');
        this.mainContainer = document.querySelector('.main-container');
        this.scrollArrows = document.querySelectorAll('.scroll-arrow');
        this.horizontalContainers = document.querySelectorAll('.horizontal-scroll-container');
        this.horizontalNavLeft = document.querySelectorAll('.horizontal-nav-left');
        this.horizontalNavRight = document.querySelectorAll('.horizontal-nav-right');
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
        this.setupScrollSnap();
        this.setupAnimations();
        this.updateArrowVisibility();
        this.setupSignupForm();
    }

    setupEventListeners() {
        // Navigation links
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(index);
            });
        });

        // Scroll arrows (now for vertical navigation)
        this.scrollArrows.forEach(arrow => {
            arrow.addEventListener('click', () => {
                this.scrollToNextSection();
            });
        });

        // Horizontal navigation arrows
        this.horizontalNavLeft.forEach((arrow, index) => {
            if (arrow) {
                arrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollHorizontalLeft(index);
                });
            }
        });

        this.horizontalNavRight.forEach((arrow, index) => {
            if (arrow) {
                arrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollHorizontalRight(index);
                });
            }
        });

        // Use scrollend event to detect when scroll snapping completes
        const mainContainer = document.querySelector('.main-container');
        
        mainContainer.addEventListener('scrollend', () => {
            this.updateCurrentSection();
            this.updateProgress();
        });
        
        // Also listen for regular scroll events for progress updates
        mainContainer.addEventListener('scroll', () => {
            this.updateProgress();
        });

        // Horizontal scroll detection for each section
        this.horizontalContainers.forEach((container, index) => {
            container.addEventListener('scroll', () => {
                this.updateHorizontalProgress(container);
                this.updateArrowVisibilityForSection(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                this.scrollToPreviousSection();
            } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                this.scrollToNextSection();
            } else if (e.key === 'ArrowLeft') {
                this.scrollHorizontalLeft(this.currentSection);
            } else if (e.key === 'ArrowRight') {
                this.scrollHorizontalRight(this.currentSection);
            }
        });

        // Touch/swipe support
        this.setupTouchEvents();

        // Form submission
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Return to top button
        const returnToTopBtn = document.querySelector('.return-to-top-btn');
        if (returnToTopBtn) {
            returnToTopBtn.addEventListener('click', () => {
                this.scrollToSection(0);
            });
        }

        // Setup pricing cards horizontal scrolling
        this.setupPricingCardsScrolling();
    }

    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        let touchStartTime = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
            touchStartTime = Date.now();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isScrolling) {
                const deltaX = Math.abs(e.touches[0].clientX - startX);
                const deltaY = Math.abs(e.touches[0].clientY - startY);
                
                if (deltaX > deltaY) {
                    isScrolling = true;
                }
            }
        });

        document.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            if (isScrolling && touchDuration < 300) {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                
                // Check if we're on mobile and disable horizontal scrolling
                const isMobile = window.innerWidth <= 768;
                
                if (!isMobile && Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.scrollHorizontalLeft(this.currentSection);
                    } else {
                        this.scrollHorizontalRight(this.currentSection);
                    }
                } else if (Math.abs(deltaY) > 50) {
                    if (deltaY > 0) {
                        this.scrollToPreviousSection();
                    } else {
                        this.scrollToNextSection();
                    }
                }
            }
        });

        // Prevent zoom on double tap for mobile
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    setupScrollSnap() {
        // Ensure smooth scroll snap behavior
        this.mainContainer.style.scrollBehavior = 'smooth';
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .stat-item, .tech-item, .feature-item, .contact-item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    scrollToSection(sectionIndex) {
        if (sectionIndex >= 0 && sectionIndex < this.sections.length) {
            this.currentSection = sectionIndex;
            const targetSection = this.sections[sectionIndex];
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            this.updateActiveNavLink();
        }
    }

    scrollToNextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.scrollToSection(this.currentSection + 1);
        }
    }

    scrollToPreviousSection() {
        if (this.currentSection > 0) {
            this.scrollToSection(this.currentSection - 1);
        }
    }

    scrollHorizontalLeft(sectionIndex = this.currentSection) {
        const container = this.horizontalContainers[sectionIndex];
        if (container) {
            const containerWidth = container.clientWidth;
            const currentScroll = container.scrollLeft;
            const targetScroll = Math.max(0, currentScroll - containerWidth);
            
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            
            // Update arrow visibility after scroll
            setTimeout(() => {
                this.updateArrowVisibility();
            }, 300);
        }
    }

    scrollHorizontalRight(sectionIndex = this.currentSection) {
        const container = this.horizontalContainers[sectionIndex];
        if (container) {
            const containerWidth = container.clientWidth;
            const currentScroll = container.scrollLeft;
            const maxScroll = container.scrollWidth - containerWidth;
            const targetScroll = Math.min(maxScroll, currentScroll + containerWidth);
            
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            
            // Update arrow visibility after scroll
            setTimeout(() => {
                this.updateArrowVisibility();
            }, 300);
        } else {
        }
    }

    updateCurrentSection() {
        const mainContainer = document.querySelector('.main-container');
        const scrollY = mainContainer.scrollTop;
        const windowHeight = mainContainer.clientHeight;
        
        // Find which section is currently at the top of the viewport
        let currentSectionIndex = 0;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            // Check if this section is currently visible at the top of the viewport
            if (scrollY >= sectionTop - windowHeight / 2 && scrollY < sectionBottom - windowHeight / 2) {
                currentSectionIndex = index;
            }
        });
        
        if (currentSectionIndex !== this.currentSection) {
            this.currentSection = currentSectionIndex;
            this.updateActiveNavLink();
            this.updateArrowVisibility();
        }
    }

    updateArrowVisibility() {
        // Update horizontal arrow visibility for all sections
        this.horizontalContainers.forEach((container, index) => {
            this.updateArrowVisibilityForSection(index);
        });
    }

    updateArrowVisibilityForSection(sectionIndex) {
        const container = this.horizontalContainers[sectionIndex];
        const leftArrow = this.horizontalNavLeft[sectionIndex];
        const rightArrow = this.horizontalNavRight[sectionIndex];
        
        if (leftArrow && rightArrow && container) {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            // Show/hide arrows based on scroll position
            if (scrollLeft <= 10) {
                leftArrow.style.opacity = '0.3';
                leftArrow.style.pointerEvents = 'none';
            } else {
                leftArrow.style.opacity = '0.7';
                leftArrow.style.pointerEvents = 'auto';
            }
            
            if (scrollLeft >= maxScroll - 10) {
                rightArrow.style.opacity = '0.3';
                rightArrow.style.pointerEvents = 'none';
            } else {
                rightArrow.style.opacity = '0.7';
                rightArrow.style.pointerEvents = 'auto';
            }
        }
    }


    updateActiveNavLink() {
        console.log(`Updating nav links, current section: ${this.currentSection}`);
        this.navLinks.forEach((link, index) => {
            const isActive = index === this.currentSection;
            link.classList.toggle('active', isActive);
            console.log(`Nav link ${index}: ${isActive ? 'active' : 'inactive'}`);
        });
    }

    updateProgress() {
        const mainContainer = document.querySelector('.main-container');
        const scrollY = mainContainer.scrollTop;
        const documentHeight = mainContainer.scrollHeight - mainContainer.clientHeight;
        const progress = (scrollY / documentHeight) * 100;
        
        this.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    updateHorizontalProgress(container) {
        const containerWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - containerWidth;
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        
        // You can add a horizontal progress indicator here if needed
        console.log(`Horizontal progress: ${progress}%`);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Simulate form submission
        this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        e.target.reset();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '10px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        const colors = {
            success: '#00d4ff',
            error: '#ff4757',
            info: '#7209b7'
        };
        notification.style.background = colors[type] || colors.info;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        navMenu.classList.toggle('mobile-active');
        navToggle.classList.toggle('active');
        
        // Close menu when clicking on a nav link
        if (navMenu.classList.contains('mobile-active')) {
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('mobile-active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }

    setupPricingCardsScrolling() {
        const pricingGrid = document.querySelector('.pricing-grid');
        if (!pricingGrid) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        pricingGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            pricingGrid.style.cursor = 'grabbing';
            startX = e.pageX - pricingGrid.offsetLeft;
            scrollLeft = pricingGrid.scrollLeft;
        });

        pricingGrid.addEventListener('mouseleave', () => {
            isDown = false;
            pricingGrid.style.cursor = 'grab';
        });

        pricingGrid.addEventListener('mouseup', () => {
            isDown = false;
            pricingGrid.style.cursor = 'grab';
        });

        pricingGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - pricingGrid.offsetLeft;
            const walk = (x - startX) * 2;
            pricingGrid.scrollLeft = scrollLeft - walk;
        });

        // Add grab cursor style
        pricingGrid.style.cursor = 'grab';
        pricingGrid.style.userSelect = 'none';
    }

    // Setup signup form with email validation
    setupSignupForm() {
        const signupForm = document.getElementById('signupForm');
        const emailInput = document.getElementById('email');
        const referrerInput = document.getElementById('referrer');
        const emailError = document.getElementById('emailError');
        const referrerError = document.getElementById('referrerError');

        if (!signupForm) return;

        // Email validation function
        const validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Real-time email validation
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                const email = emailInput.value.trim();
                if (email && !validateEmail(email)) {
                    if (emailError) {
                        emailError.textContent = 'Please enter a valid email address';
                        emailError.style.display = 'block';
                    }
                    emailInput.style.borderColor = '#ff6b6b';
                } else {
                    if (emailError) {
                        emailError.style.display = 'none';
                    }
                    emailInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        }

        // Real-time referrer email validation
        if (referrerInput) {
            referrerInput.addEventListener('input', () => {
                const referrerEmail = referrerInput.value.trim();
                if (referrerEmail && !validateEmail(referrerEmail)) {
                    if (referrerError) {
                        referrerError.textContent = 'Please enter a valid email address';
                        referrerError.style.display = 'block';
                    }
                    referrerInput.style.borderColor = '#ff6b6b';
                } else {
                    if (referrerError) {
                        referrerError.style.display = 'none';
                    }
                    referrerInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        }

        // Form submission
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(signupForm);
            const email = formData.get('email') ? formData.get('email').trim() : '';
            const referrerEmail = formData.get('referrer') ? formData.get('referrer').trim() : '';
            
            // Validate required fields
            if (!email || !validateEmail(email)) {
                if (emailError) {
                    emailError.textContent = 'Please enter a valid email address';
                    emailError.style.display = 'block';
                }
                if (emailInput) {
                    emailInput.style.borderColor = '#ff6b6b';
                }
                return;
            }
            
            if (referrerEmail && !validateEmail(referrerEmail)) {
                if (referrerError) {
                    referrerError.textContent = 'Please enter a valid email address';
                    referrerError.style.display = 'block';
                }
                if (referrerInput) {
                    referrerInput.style.borderColor = '#ff6b6b';
                }
                return;
            }
            
            // Show loading state
            const submitBtn = signupForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            try {
                // Prepare data for API
                const signupData = {
                    name: formData.get('name') ? formData.get('name').trim() : '',
                    email: email,
                    userType: formData.get('userType') || '',
                    category: formData.get('category') ? formData.get('category').trim() : '',
                    feedback: formData.get('feedback') ? formData.get('feedback').trim() : '',
                    referrer: referrerEmail || ''
                };
                
                // Determine API URL based on environment
                let apiUrl;
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    apiUrl = 'http://localhost:3000/api/signup';
                } else if (window.location.hostname.includes('amazonaws.com') || window.location.hostname.includes('cloudfront.net') || window.location.hostname.includes('neuralgridai.io')) {
                    // For S3/CloudFront deployment or custom domain, use API Gateway
                    apiUrl = 'https://hzxqh4bcx8.execute-api.us-east-1.amazonaws.com/prod/signup';
                } else {
                    // For other deployments
                    apiUrl = '/api/signup';
                }
                
                console.log('=== SIGNUP DEBUG v4 ===');
                console.log('Hostname:', window.location.hostname);
                console.log('Full URL:', window.location.href);
                console.log('Using API URL:', apiUrl);
                console.log('===================');
                
                // Send data to backend
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Success
                    this.showNotification(result.message, 'success');
                    
                    // Reset form
                    signupForm.reset();
                    if (emailError) emailError.style.display = 'none';
                    if (referrerError) referrerError.style.display = 'none';
                    if (emailInput) emailInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    if (referrerInput) referrerInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                } else {
                    // Error from server
                    this.showNotification(result.message || 'Registration failed. Please try again.', 'error');
                }
                
            } catch (error) {
                console.error('Signup error:', error);
                this.showNotification('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Particle system for background effects
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.setupResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.1';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    setupResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles = [];
            this.createParticles();
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Typing animation for hero text
class TypingAnimation {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isDeleting = false;
        
        this.init();
    }

    init() {
        this.element.textContent = '';
        this.type();
    }

    type() {
        const currentText = this.text.substring(0, this.currentIndex);
        this.element.textContent = currentText;
        
        if (!this.isDeleting && this.currentIndex < this.text.length) {
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else if (this.isDeleting && this.currentIndex > 0) {
            this.currentIndex--;
            setTimeout(() => this.type(), this.speed / 2);
        } else if (this.currentIndex === this.text.length) {
            setTimeout(() => {
                this.isDeleting = true;
                this.type();
            }, 2000);
        } else if (this.currentIndex === 0 && this.isDeleting) {
            this.isDeleting = false;
            setTimeout(() => this.type(), 500);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main landing page functionality
    const landingPage = new NeuralGridLanding();
    
    // Initialize particle system
    const particleSystem = new ParticleSystem();
    
    // Initialize typing animation for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        new TypingAnimation(heroSubtitle, originalText, 50);
    }
    
    // Add smooth reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for reveal animation
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(section);
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Performance optimization: Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            particleSystem.destroy();
        } else {
            if (!particleSystem.canvas) {
                particleSystem.init();
            }
        }
    });
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

