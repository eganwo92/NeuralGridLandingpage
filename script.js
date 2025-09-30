// Smooth scrolling and navigation functionality
class NeuralGridLanding {
    constructor() {
        this.currentSection = 0;
        this.sections = document.querySelectorAll('.section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.progressBar = document.querySelector('.progress-fill');
        this.mainContainer = document.querySelector('.main-container');
        this.scrollArrows = document.querySelectorAll('.scroll-arrow');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
        this.setupScrollSnap();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Navigation links
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(index);
            });
        });

        // Scroll arrows
        this.scrollArrows.forEach(arrow => {
            arrow.addEventListener('click', () => {
                this.scrollToNextSection();
            });
        });

        // Horizontal scroll detection
        this.mainContainer.addEventListener('scroll', () => {
            this.updateCurrentSection();
            this.updateProgress();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.scrollToPreviousSection();
            } else if (e.key === 'ArrowRight') {
                this.scrollToNextSection();
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
    }

    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;

        this.mainContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        });

        this.mainContainer.addEventListener('touchmove', (e) => {
            if (!isScrolling) {
                const deltaX = Math.abs(e.touches[0].clientX - startX);
                const deltaY = Math.abs(e.touches[0].clientY - startY);
                
                if (deltaX > deltaY) {
                    isScrolling = true;
                }
            }
        });

        this.mainContainer.addEventListener('touchend', (e) => {
            if (isScrolling) {
                const endX = e.changedTouches[0].clientX;
                const deltaX = endX - startX;
                
                if (Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.scrollToPreviousSection();
                    } else {
                        this.scrollToNextSection();
                    }
                }
            }
        });
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
            const containerWidth = this.mainContainer.clientWidth;
            
            this.mainContainer.scrollTo({
                left: sectionIndex * containerWidth,
                behavior: 'smooth'
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

    updateCurrentSection() {
        const containerWidth = this.mainContainer.clientWidth;
        const scrollLeft = this.mainContainer.scrollLeft;
        const newSection = Math.round(scrollLeft / containerWidth);
        
        if (newSection !== this.currentSection && newSection >= 0 && newSection < this.sections.length) {
            this.currentSection = newSection;
            this.updateActiveNavLink();
        }
    }

    updateActiveNavLink() {
        this.navLinks.forEach((link, index) => {
            link.classList.toggle('active', index === this.currentSection);
        });
    }

    updateProgress() {
        const containerWidth = this.mainContainer.clientWidth;
        const scrollLeft = this.mainContainer.scrollLeft;
        const maxScroll = this.mainContainer.scrollWidth - containerWidth;
        const progress = (scrollLeft / maxScroll) * 100;
        
        this.progressBar.style.width = `${progress}%`;
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
        
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
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
