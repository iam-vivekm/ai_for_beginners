// Presentation Navigation System
class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 14;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideCounter = document.getElementById('slideCounter');
        this.progressBar = document.getElementById('progress');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideDisplay();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.autoResizeImages();
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index + 1));
        });

        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        // Remove active class from current slide
        this.slides[this.currentSlide - 1].classList.remove('active');
        this.dots[this.currentSlide - 1].classList.remove('active');

        // Add active class to new slide
        this.slides[slideNumber - 1].classList.add('active');
        this.dots[slideNumber - 1].classList.add('active');

        this.currentSlide = slideNumber;
        this.updateSlideDisplay();
        this.updateProgressBar();
        this.animateSlideTransition();
    }

    updateSlideDisplay() {
        this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;

        // Update button styles
        if (this.prevBtn.disabled) {
            this.prevBtn.style.opacity = '0.5';
        } else {
            this.prevBtn.style.opacity = '1';
        }

        if (this.nextBtn.disabled) {
            this.nextBtn.style.opacity = '0.5';
        } else {
            this.nextBtn.style.opacity = '1';
        }
    }

    updateProgressBar() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    animateSlideTransition() {
        const currentSlide = this.slides[this.currentSlide - 1];
        const content = currentSlide.querySelector('.slide-content');
        
        // Reset animation
        content.style.animation = 'none';
        content.offsetHeight; // Trigger reflow
        content.style.animation = 'slideIn 0.6s ease-out';
    }

    autoResizeImages() {
        const images = document.querySelectorAll('.slide-image');
        images.forEach(img => {
            img.addEventListener('load', () => {
                this.adjustImageSize(img);
            });
            // Also adjust on window resize
            window.addEventListener('resize', () => {
                this.adjustImageSize(img);
            });
        });
    }

    adjustImageSize(img) {
        const container = img.closest('.image-content');
        if (container) {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const maxWidth = Math.min(containerWidth * 0.9, 400);
            const maxHeight = Math.min(containerHeight * 0.8, 400);
            
            img.style.maxWidth = `${maxWidth}px`;
            img.style.maxHeight = `${maxHeight}px`;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Utility Functions
class PresentationUtils {
    static preloadImages() {
        const imageUrls = [
            'images/slide1-ai-brain.jpg',
            'images/slide2-ai-concepts.jpg',
            'images/slide3-daily-life.jpg',
            'images/slide4-student-learning.jpg',
            'images/slide5-task-solving.jpg',
            'images/slide6-ai-trends.jpg',
            'images/slide7-ai-tools.jpg',
            'images/slide8-chatgpt-student.jpg',
            'images/slide9-cursor.jpg',
            'images/slide10-openai-fm.jpg',
            'images/slide11-invideo-ai.jpg',
            'images/slide12-gemini-notes.jpg',
            'images/slide13-china-education.jpg',
            'images/slide-14.jpg'
        ];

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    static createPlaceholderImages() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 300;

        const images = document.querySelectorAll('.slide-image');
        images.forEach((img, index) => {
            if (!img.complete || img.naturalHeight === 0) {
                this.createPlaceholderImage(canvas, ctx, img, index + 1);
            }
        });
    }

    static createPlaceholderImage(canvas, ctx, imgElement, slideNumber) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Slide ${slideNumber}`, canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText('Image Placeholder', canvas.width / 2, canvas.height / 2 + 20);

        // Convert to data URL and set as src
        imgElement.src = canvas.toDataURL();
    }

    static addLoadingStates() {
        const images = document.querySelectorAll('.slide-image');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            img.style.opacity = '0.7';
            img.style.transition = 'opacity 0.3s ease';
        });
    }

    static addSmoothScrolling() {
        // Smooth scroll for any internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Animation Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addSlideAnimations();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // Observe all slide content
        document.querySelectorAll('.slide-content').forEach(content => {
            this.observer.observe(content);
        });
    }

    addSlideAnimations() {
        // Add staggered animation to feature cards
        const featureCards = document.querySelectorAll('.feature-card, .trend-card, .example-item');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// Performance Optimizer
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.addLazyLoading();
        this.optimizeAnimations();
    }

    optimizeImages() {
        const images = document.querySelectorAll('.slide-image');
        images.forEach(img => {
            // Add loading attribute for better performance
            img.setAttribute('loading', 'lazy');
            
            // Add error handling
            img.addEventListener('error', () => {
                this.handleImageError(img);
            });
        });
    }

    handleImageError(img) {
        // Create a placeholder when image fails to load
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 300;

        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Image not available', canvas.width / 2, canvas.height / 2);

        img.src = canvas.toDataURL();
    }

    addLazyLoading() {
        // Only load images when slide becomes active
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            const images = slide.querySelectorAll('.slide-image');
            images.forEach(img => {
                img.style.display = 'none';
            });
        });
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-motion');
        }

        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation controller
    const presentation = new PresentationController();
    
    // Initialize utility functions
    PresentationUtils.preloadImages();
    PresentationUtils.createPlaceholderImages();
    PresentationUtils.addLoadingStates();
    PresentationUtils.addSmoothScrolling();
    
    // Initialize animation controller
    const animations = new AnimationController();
    
    // Initialize performance optimizer
    const optimizer = new PerformanceOptimizer();

    // Add custom CSS for reduced motion
    const style = document.createElement('style');
    style.textContent = `
        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);

    // Add presentation controls info
    console.log('🎯 Presentation Controls:');
    console.log('← → Arrow keys or swipe to navigate');
    console.log('Space bar to go to next slide');
    console.log('Home/End to go to first/last slide');
    console.log('Escape to toggle fullscreen');
    console.log('Click dots to jump to specific slides');
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate image sizes
    const images = document.querySelectorAll('.slide-image');
    images.forEach(img => {
        const container = img.closest('.image-content');
        if (container) {
            const containerWidth = container.offsetWidth;
            const maxWidth = Math.min(containerWidth * 0.9, 400);
            img.style.maxWidth = `${maxWidth}px`;
        }
    });
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or timers when page is hidden
        document.body.classList.add('paused');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('paused');
    }
});
