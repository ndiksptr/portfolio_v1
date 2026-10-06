document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    
    if (!prefersReducedMotion && !sessionStorage.getItem('visited')) {
        sessionStorage.setItem('visited', 'true');
        
        // Animate bar 0-100%
        setTimeout(() => {
            if (preloaderBar) preloaderBar.style.width = '100%';
        }, 100);

        // Slide up after 1.2s
        setTimeout(() => {
            if (preloader) {
                preloader.style.transform = 'translateY(-100%)';
                setTimeout(() => preloader.remove(), 600); // Remove after slide out
                initHeroAnimation();
            }
        }, 1300);
    } else {
        if (preloader) preloader.remove();
        if (!prefersReducedMotion) initHeroAnimation();
        else document.querySelectorAll('.hero-char').forEach(el => el.style.opacity = '1');
    }

    // --- Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    function toggleDarkMode() {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            htmlElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
    }

    // --- Custom Cursor Logic ---
    const cursor = document.getElementById('custom-cursor');
    if (window.matchMedia("(hover: hover)").matches && cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            cursorX += dx * 0.2; // Lerp 0.2
            cursorY += dy * 0.2;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect for interactive elements
        const addCursorHover = () => {
            const interactables = document.querySelectorAll('a, button, input, .cursor-interact');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
            });
        };
        addCursorHover();

        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
        
        // Re-run hover logic if DOM changes (e.g., dynamic elements)
        const observer = new MutationObserver(addCursorHover);
        observer.observe(document.body, { childList: true, subtree: true });
    } else if (cursor) {
        cursor.remove();
        document.body.style.cursor = 'auto';
    }

    // --- Hero Animation (Staggered text) ---
    function initHeroAnimation() {
        const chars = document.querySelectorAll('.hero-char');
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.style.opacity = '1';
                char.style.transform = 'translateY(0)';
            }, index * 45); // 45ms gap
        });
    }

    // --- Typing Effect ---
    const typingElement = document.getElementById('typing-text');
    if (typingElement && !prefersReducedMotion) {
        const roles = ["Web Developer", "Junior System Engineer", "Database Administrator"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing next
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1500); // Start delay
    } else if (typingElement && prefersReducedMotion) {
        typingElement.textContent = "Web Developer";
    }

    // --- Scroll Reveal Animation ---
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-hidden');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach((el, index) => {
            // Apply delay manually via inline style for stagger
            const delay = el.getAttribute('data-delay') || 0;
            el.style.transitionDelay = `${delay}ms`;
            revealObserver.observe(el);
        });
    } else {
        document.querySelectorAll('.reveal-hidden').forEach(el => {
            el.classList.remove('reveal-hidden');
        });
    }

    // --- Number Counting Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!prefersReducedMotion) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseFloat(entry.target.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    const duration = 1400; // 1.4s
                    const frameRate = 1000 / 60;
                    const totalFrames = Math.round(duration / frameRate);
                    let frame = 0;
                    
                    const counter = setInterval(() => {
                        frame++;
                        const progress = frame / totalFrames;
                        // Ease out quad
                        const easeProgress = 1 - (1 - progress) * (1 - progress);
                        const current = target * easeProgress;
                        
                        entry.target.textContent = isDecimal ? current.toFixed(2) : Math.round(current);
                        
                        if (frame === totalFrames) {
                            clearInterval(counter);
                            entry.target.textContent = isDecimal ? target.toFixed(2) : target;
                        }
                    }, frameRate);
                    
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(num => statsObserver.observe(num));
    }

    // --- Horizontal Scroll (Snap) ---
    const scrollContainer = document.getElementById('project-scroll-container');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    
    if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
        });
        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }

    // --- Copy to Clipboard ---
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('ndiksptr159@gmail.com').then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'DISALIN!';
                copyBtn.classList.add('bg-acid', 'text-ink');
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove('bg-acid', 'text-ink');
                }, 2000);
            });
        });
    }

    // --- Gallery Modal ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');

    if (modal && modalImg && modalClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                modalImg.src = imgSrc;
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modalImg.src = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modalClose.click();
            }
        });
    }
});
