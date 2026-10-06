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

        // Event delegation for hover effect
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, input, .cursor-interact')) {
                cursor.classList.add('hovering');
            }
        });
        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, input, .cursor-interact')) {
                cursor.classList.remove('hovering');
            }
        });

        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
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

    // --- Projects Data & Modal Logic ---
    const projectsData = [
        {
            id: 1,
            title: "ReadOnl1ne",
            type: "WEB APP",
            image: "image/project/readonl1ne.png",
            description: "ReadOnl1ne adalah website e-commerce buku digital yang dilengkapi katalog buku, fitur pencarian, manajemen data, dan dashboard admin. Dibangun dengan konsep MVC, mulai dari analisis kebutuhan, desain antarmuka di Figma, hingga dokumentasi perancangan dengan UML, Use Case, Activity Diagram, dan ERD.",
            stack: ["PHP", "HTML", "CSS", "Bootstrap", "CI4"],
            github: "https://github.com/ndiksptr/readonl1ne",
            web: "https://readonl1ne.netlify.app/",
            figma: null
        },
        {
            id: 2,
            title: "E-Warkas",
            type: "SISTEM INFORMASI",
            image: "image/project/e-warkas.png",
            description: "E-Warkas adalah sistem point of sale (kasir) sederhana yang membantu pedagang warung mengelola stok barang dan penjualan, serta mencetak laporan penjualan dan laporan stok barang.",
            stack: [],
            github: "https://github.com/ndiksptr/e-warkas",
            web: null,
            figma: null
        },
        {
            id: 3,
            title: "FAMS",
            type: "SISTEM INFORMASI",
            image: "image/project/fams.png",
            description: "FAMS adalah sistem procurement dan fixed assets management yang membantu mengelola pengadaan barang, registrasi aset, dan alur persetujuan.",
            stack: [],
            github: "https://github.com/ndiksptr/app-fams",
            web: null,
            figma: null
        },
        {
            id: 4,
            title: "Apotek Berkat",
            type: "DESAIN UI",
            image: "image/project/apotek_berkat.png",
            description: "Apotek Berkat adalah hasil perancangan desain aplikasi untuk studi kasus apotek yang ingin melakukan transaksi, manajemen stok obat, dan konsultasi dengan dokter melalui aplikasi.",
            stack: ["Figma"],
            github: null,
            web: null,
            figma: "https://www.figma.com/design/POtZDLe9csAfR1zDAVIkTP/Apotek_Berkat?node-id=0-1&t=jAfweMXb33HiOHkh-1"
        },
        {
            id: 5,
            title: "Undangan Khitanan",
            type: "DESAIN UNDANGAN",
            image: "image/project/undangankhitan.png",
            description: "Undangan Khitanan adalah hasil desain undangan digital untuk acara khitanan. Proyek ini tidak memiliki GitHub, dan file desainnya tidak dipublikasikan.",
            stack: [],
            github: null,
            web: null,
            figma: null,
            noLinksText: "Tautan tidak dipublikasikan"
        }
    ];

    const scrollContainer = document.getElementById('project-scroll-container');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    // Render Cards
    if (scrollContainer) {
        scrollContainer.innerHTML = ''; // Clear fallback
        projectsData.forEach((project, index) => {
            const stackDisplay = project.stack && project.stack.length > 0 ? project.stack.slice(0, 2).join(' & ') : project.type;
            const cardHTML = `
            <div tabindex="0" data-index="${index}" role="button" aria-label="Lihat detail proyek ${project.title}"
                class="project-card-btn w-[320px] md:w-[380px] shrink-0 border-2 border-ink dark:border-paper rounded-2xl bg-paper dark:bg-ink shadow-brutal-md md:shadow-brutal-lg p-[var(--modal-pad)] group snap-center cursor-none hover:-translate-y-2 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-acid focus:-translate-y-2">
                <div class="aspect-video border-2 border-ink dark:border-paper rounded-xl overflow-hidden bg-ink mb-4 relative pointer-events-none">
                    <span class="absolute top-2 left-2 bg-acid text-ink font-mono text-xs font-bold px-2 py-1 rounded-sm border-2 border-ink z-10">${project.type}</span>
                    <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.src='https://placehold.co/600x338/09090b/d2e823?text=${project.title.replace(' ', '+')}'">
                </div>
                <div class="flex justify-between items-start mb-2 pointer-events-none">
                    <h4 class="font-display uppercase text-xl line-clamp-1">${project.title}</h4>
                </div>
                <p class="font-body text-sm opacity-80 mb-4 h-20 overflow-hidden pointer-events-none line-clamp-4">${project.description}</p>
                <div class="w-full hard-btn bg-paper dark:bg-ink border-2 border-ink dark:border-paper py-2 rounded-lg font-bold shadow-brutal-sm hover:bg-acid dark:hover:bg-acid dark:hover:text-ink cursor-interact text-sm uppercase text-center">
                    Lihat Detail
                </div>
            </div>`;
            scrollContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Add event listeners to newly created cards
        const projectCards = document.querySelectorAll('.project-card-btn');
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.getAttribute('data-index'));
                openProjectModal(idx);
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const idx = parseInt(card.getAttribute('data-index'));
                    openProjectModal(idx);
                }
            });
        });
    }

    if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
        });
        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }

    // Modal Variables
    const projectModal = document.getElementById('project-modal');
    const pmBackdrop = document.getElementById('pm-backdrop');
    const pmCard = document.getElementById('pm-card');
    const pmClose = document.getElementById('pm-close');
    const pmImage = document.getElementById('pm-image');
    const pmType = document.getElementById('pm-type');
    const pmTitle = document.getElementById('pm-title');
    const pmDesc = document.getElementById('pm-desc');
    const pmStackContainer = document.getElementById('pm-stack-container');
    const pmLinks = document.getElementById('pm-links');
    const pmPrev = document.getElementById('pm-prev');
    const pmNext = document.getElementById('pm-next');
    const pmCurrentIndex = document.getElementById('pm-current-index');
    const pmTotal = document.getElementById('pm-total');
    
    let currentModalIndex = 0;
    let lastFocusedElement = null;

    if (pmTotal) pmTotal.textContent = projectsData.length;

    function renderModalContent(index) {
        const project = projectsData[index];
        
        // Fast transition for content if modal is already open
        pmImage.style.opacity = '0';
        pmTitle.style.opacity = '0';
        pmDesc.style.opacity = '0';
        pmType.style.opacity = '0';
        pmStackContainer.style.opacity = '0';
        pmLinks.style.opacity = '0';

        setTimeout(() => {
            pmImage.src = project.image;
            pmImage.alt = project.title;
            pmTitle.textContent = project.title;
            pmType.textContent = project.type;
            pmDesc.textContent = project.description;
            pmCurrentIndex.textContent = index + 1;

            // Render Stack Chips
            pmStackContainer.innerHTML = '';
            if (project.stack && project.stack.length > 0) {
                project.stack.forEach(tech => {
                    const chip = document.createElement('span');
                    chip.className = 'bg-ink dark:bg-paper text-paper dark:text-ink font-mono font-bold text-xs px-3 py-1 rounded-full border-2 border-transparent dark:border-ink';
                    chip.textContent = tech;
                    pmStackContainer.appendChild(chip);
                });
            }

            // Render Links
            pmLinks.innerHTML = '';
            if (project.github || project.web || project.figma) {
                if (project.github) pmLinks.appendChild(createLinkBtn(project.github, 'GitHub', '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>'));
                if (project.web) pmLinks.appendChild(createLinkBtn(project.web, 'Lihat Website', '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'));
                if (project.figma) pmLinks.appendChild(createLinkBtn(project.figma, 'Lihat Desain', '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12a4 4 0 0 0-4-4V4a4 4 0 1 0-8 0v8a4 4 0 0 0 8 0v4a4 4 0 0 0 4-4zm-8 4a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm0-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></svg>'));
            } else if (project.noLinksText) {
                pmLinks.innerHTML = `<span class="font-mono text-sm opacity-60">${project.noLinksText}</span>`;
            }

            // Animate content in (Staggered)
            const elements = [pmImage, pmType, pmTitle, pmDesc, pmStackContainer, pmLinks];
            elements.forEach((el, i) => {
                el.style.transition = prefersReducedMotion ? 'none' : 'opacity 0.2s ease-out';
                setTimeout(() => el.style.opacity = '1', prefersReducedMotion ? 0 : 60 * i);
            });
            
            // Preload next image if exists
            if (index + 1 < projectsData.length) {
                const img = new Image();
                img.src = projectsData[index + 1].image;
            }

        }, prefersReducedMotion ? 0 : 150);
    }

    function createLinkBtn(href, text, svgIcon) {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'hard-btn flex-1 md:flex-none h-11 bg-paper dark:bg-ink text-ink dark:text-paper border-2 border-ink dark:border-paper rounded-lg px-4 flex justify-center items-center gap-2 font-bold text-sm hover:bg-acid hover:text-ink shadow-brutal-sm cursor-interact whitespace-nowrap';
        a.setAttribute('aria-label', `${text} (Membuka tab baru)`);
        a.innerHTML = `${svgIcon} <span>${text}</span>`;
        return a;
    }

    function openProjectModal(index) {
        if (!projectModal) return;
        currentModalIndex = index;
        lastFocusedElement = document.activeElement;
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        
        // Fallback to default cursor inside modal if custom cursor is active
        // to prevent users from losing cursor if z-index fails
        if (window.matchMedia("(hover: hover)").matches) {
            document.body.style.cursor = 'auto';
        }
        
        renderModalContent(index);

        projectModal.classList.remove('hidden');
        projectModal.classList.add('flex');
        
        if (!prefersReducedMotion) {
            pmBackdrop.classList.remove('modal-backdrop-exit');
            pmCard.classList.remove('modal-card-exit');
            pmBackdrop.classList.add('modal-backdrop-enter');
            pmCard.classList.add('modal-card-enter');
        } else {
            pmBackdrop.style.opacity = '1';
            pmCard.style.opacity = '1';
            pmBackdrop.style.animation = 'none';
            pmCard.style.animation = 'none';
        }

        // Set focus to modal card
        setTimeout(() => pmCard.focus(), 50);
    }

    function closeProjectModal() {
        if (!projectModal) return;
        
        document.body.style.overflow = ''; // Restore scroll
        if (window.matchMedia("(hover: hover)").matches) {
            document.body.style.cursor = 'none'; // Restore custom cursor
        }
        
        if (!prefersReducedMotion) {
            pmBackdrop.classList.remove('modal-backdrop-enter');
            pmCard.classList.remove('modal-card-enter');
            pmBackdrop.classList.add('modal-backdrop-exit');
            pmCard.classList.add('modal-card-exit');
            
            setTimeout(() => {
                projectModal.classList.add('hidden');
                projectModal.classList.remove('flex');
                if (lastFocusedElement) lastFocusedElement.focus();
            }, 200);
        } else {
            projectModal.classList.add('hidden');
            projectModal.classList.remove('flex');
            if (lastFocusedElement) lastFocusedElement.focus();
        }
    }

    function prevProject() {
        currentModalIndex = (currentModalIndex - 1 + projectsData.length) % projectsData.length;
        renderModalContent(currentModalIndex);
    }
    
    function nextProject() {
        currentModalIndex = (currentModalIndex + 1) % projectsData.length;
        renderModalContent(currentModalIndex);
    }

    if (pmClose && pmBackdrop && pmPrev && pmNext) {
        pmClose.addEventListener('click', closeProjectModal);
        pmBackdrop.addEventListener('click', closeProjectModal);
        pmPrev.addEventListener('click', prevProject);
        pmNext.addEventListener('click', nextProject);
        
        // Keyboard navigation and Focus trap
        projectModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeProjectModal();
            else if (e.key === 'ArrowLeft') prevProject();
            else if (e.key === 'ArrowRight') nextProject();
            
            // Focus trap
            if (e.key === 'Tab') {
                const focusableElements = projectModal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
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
