document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');

        // Animate hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('active'));
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.remove('active'));
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect - Liquid Glass Design
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            navbar.style.backdropFilter = 'blur(40px) saturate(180%)';
            navbar.style.boxShadow = '0 8px 32px rgba(107, 68, 35, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.72)';
            navbar.style.backdropFilter = 'blur(40px) saturate(180%)';
            navbar.style.boxShadow = '0 8px 32px rgba(107, 68, 35, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
        }

        lastScroll = currentScroll;
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        // Create WhatsApp message
        const whatsappMessage = `Olá Dr. Eriberto! Meu nome é *${name}*.%0A%0A` +
            `*Email:* ${email}%0A` +
            `*Telefone:* ${phone}%0A%0A` +
            `*Mensagem:*%0A${message}%0A%0A` +
            `Enviado através do site.`;

        const whatsappURL = `https://wa.me/5584991776106?text=${whatsappMessage}`;

        // Open WhatsApp
        window.open(whatsappURL, '_blank');

        // Reset form
        contactForm.reset();

        // Show success message
        showNotification('Redirecionando para WhatsApp...', 'success');
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .admin-card, .contact-item, .about-content, .judicial-content, .experience-content');

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroBackground = document.querySelector('.hero-background img');

        if (hero && heroBackground) {
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });

    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(-10px) scale(1)';
        });
    });

    // Innovation section animation
    const innovationCard = document.querySelector('.innovation-card');

    if (innovationCard) {
        const observerInnovation = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 1s ease-out';
                }
            });
        }, { threshold: 0.3 });

        observerInnovation.observe(innovationCard);
    }

    // Loading state for images
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // Add click analytics (placeholder for future integration)
    const trackClick = (element, action) => {
        // This could be integrated with Google Analytics or other tracking services
        console.log(`Clicked: ${action} on ${element}`);
    };

    // Track important clicks
    document.querySelectorAll('.cta-button, .form-button, .experience-button, .whatsapp-float').forEach(button => {
        button.addEventListener('click', function () {
            trackClick(this.className, 'CTA Click');
        });
    });

    // Performance optimization: lazy loading for non-critical images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#25d366' : '#007bff'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add custom cursor effect for premium feel
document.addEventListener('mousemove', function (e) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Add glass morphism effect on scroll
window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset;
    const elements = document.querySelectorAll('.service-card, .admin-card, .contact-item');

    elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const speed = (rect.top + scrollTop) * 0.002;

        if (rect.top < window.innerHeight && rect.top > -rect.height) {
            el.style.transform = `translateY(${speed * 10}px)`;
        }
    });
});

// Enhanced mobile experience
if (window.innerWidth <= 768) {
    // Optimize animations for mobile
    document.documentElement.style.setProperty('--animation-duration', '0.2s');

    // Reduce backdrop blur for better performance on mobile
    const blurElements = document.querySelectorAll('[style*="backdrop-filter"]');
    blurElements.forEach(el => {
        el.style.backdropFilter = 'blur(5px)';
    });
}

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNURDIi8+CjxwYXRoIGQ9Ik0yMCAzMEM4LjQ3NzE1IDMwIDMwIDI1LjUyMjggMzAgMjBDMzAgMTQuNDc3MiAyNS41MjI4IDEwIDIwIDEwQzE0LjQ3NzIgMTAgMTAgMTQuNDc3MiAxMCAyMEMxMCAyNS41MjI4IDE0LjQ3NzIgMzAgMjAgMzBaIiBzdHJva2U9IiM4QjQ1MTMiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
        this.alt = 'Imagem não disponível';
    });
});