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
        }, { passive: true });

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
            if (e.target.closest('a, button, input, textarea, .cursor-interact')) {
                cursor.classList.add('hovering');
            }
        });
        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, input, textarea, .cursor-interact')) {
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
            image: "image/project/readonl1ne.webp",
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
            image: "image/project/e-warkas.webp",
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
            image: "image/project/fams.webp",
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
            image: "image/project/apotek_berkat.webp",
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
            image: "image/project/undangankhitan.webp",
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
                    <img src="${project.image}" alt="${project.title}" width="380" height="214" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" onerror="this.src='https://placehold.co/600x338/09090b/d2e823?text=${project.title.replace(' ', '+')}'">
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

    // Validasi URL untuk mencegah XSS via pseudoprotocol (javascript:, data:)
    function sanitizeSafeUrl(url) {
        if (!url || typeof url !== 'string') return '#';
        const trimmed = url.trim();
        if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
            return trimmed;
        }
        return '#';
    }

    function createLinkBtn(href, text, svgIcon) {
        const a = document.createElement('a');
        a.href = sanitizeSafeUrl(href);
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

    // =========================================================================
    // --- LIVE CHAT WIDGET & AI INTEGRATION LAYER ---
    // =========================================================================

    /**
     * Konfigurasi dan Flag Pengembang
     * -------------------------------------------------------------------------
     * Ganti MOCK_ERROR = true untuk melihat tampilan gelembung error & tombol "Coba lagi".
     */
    const MOCK_ERROR = false;

    // Teks sambutan awal asisten
    const WELCOME_MESSAGE = "Halo, saya asisten Andika. Tanyakan apa saja soal proyek, pengalaman, atau sertifikasi Andika.";

    // Daftar tombol jawaban cepat (Quick Replies / Chips)
    const QUICK_REPLIES = [
        { label: "Proyek apa saja yang pernah dibuat?", key: "proyek" },
        { label: "Apa pengalaman PKL-nya?", key: "pkl" },
        { label: "Sertifikasi apa yang dimiliki?", key: "sertifikasi" },
        { label: "Bagaimana cara menghubungi Andika?", key: "kontak" }
    ];

    // Bank jawaban data tiruan (Mock Knowledge Base)
    const MOCK_KNOWLEDGE = {
        proyek: "Beberapa proyek unggulan yang pernah dikembangkan oleh Andika antara lain:\n\n1. ReadOnl1ne — Website e-commerce buku digital dengan konsep MVC CI4 lengkap dengan katalog, pencarian, dan dashboard admin.\n2. E-Warkas — Sistem Point of Sale (kasir) warung untuk manajemen stok & laporan penjualan.\n3. FAMS — Sistem Procurement & Fixed Assets Management untuk pengadaan aset.\n4. Apotek Berkat — Desain UI/UX sistem informasi apotek & konsultasi dokter di Figma.\n5. Undangan Khitanan — Desain grafis undangan digital.\n\nAnda dapat melihat kartu interaktif lengkapnya di bagian Proyek pada portfolio ini!",
        pkl: "Pengalaman Praktik Kerja Lapangan (PKL) Andika Saputra:\n\n• PT IP Network Solusindo (Desember 2022 – April 2023) sebagai Junior System Engineer:\n  Mengimplementasikan 200 server Hadoop & 10 server FTP di TTC Telkomsel BSD & Simatupang, staging, unboxing, instalasi OS, serta manajemen iDRAC.\n\n• Madina Islamic School (September – Desember 2022) sebagai Staff IT:\n  Pemeliharaan komputer & jaringan LAN/WiFi, backup berkala, perakitan kabel UTP, dan perbaikan perangkat printer.",
        sertifikasi: "Andika memiliki 3 sertifikasi kompetensi resmi berstandar BNSP:\n\n1. Database Administrator (2026) — Operasi CRUD, relasi database, SP, trigger, dan optimasi query SQL.\n2. Tenaga Operator Komputer (2025) — Administrasi dokumen lanjutan Microsoft Office (Word, Excel, PowerPoint).\n3. Teknik Komputer dan Jaringan Level II (2024) — Konfigurasi MikroTik, routing internet gateway, DHCP server, dan instalasi jaringan LAN.",
        kontak: "Anda dapat menghubungi Andika secara langsung melalui:\n\n• Email: ndiksptr159@gmail.com\n• GitHub: https://github.com/ndiksptr\n• LinkedIn: https://www.linkedin.com/in/ndik15\n\nAtau klik tombol 'HUBUNGI' di menu atas untuk membuka aplikasi email Anda!"
    };

    const FALLBACK_REPLY = "Halo! Asisten AI ini saat ini masih dalam tahap pengembangan (mock template). Untuk informasi spesifik, diskusi proyek, atau tawaran kerja sama, silakan hubungi langsung Andika melalui email di ndiksptr159@gmail.com atau LinkedIn di https://www.linkedin.com/in/ndik15.";

    /**
     * =========================================================================
     * TITIK INTEGRASI AI (AI INTEGRATION POINT)
     * =========================================================================
     * Fungsi ini adalah SATU-SATUNYA TEMPAT yang perlu diubah saat Anda siap
     * menghubungkan chat ini ke model AI sungguhan (misal OpenAI, Gemini, Claude, dll).
     *
     * ⚠️ PERINGATAN KEAMANAN SANGAT PENTING:
     * JANGAN PERNAH menuliskan API key AI langsung di file JavaScript browser ini!
     * Siapapun yang membuka web Anda dapat melihat API key tersebut di Inspect Elements
     * dan menggunakannya hingga kuota/saldo Anda habis.
     *
     * Pemanggilan AI WAJIB melalui backend atau Serverless Function (misalnya Cloudflare
     * Worker, karena situs ini di-deploy di Cloudflare) yang menyimpan API key sebagai Secret / Environment Variable.
     *
     * CONTOH MENGGANTINYA NANTI DENGAN FETCH KE BACKEND:
     * ```javascript
     * async function getAIReply(messages) {
     *     const response = await fetch('/api/chat', {
     *         method: 'POST',
     *         headers: { 'Content-Type': 'application/json' },
     *         body: JSON.stringify({ messages })
     *     });
     *     if (!response.ok) {
     *         throw new Error(`Server status ${response.status}`);
     *     }
     *     const data = await response.json();
     *     return data.reply;
     * }
     * ```
     *
     * @param {Array<{role: string, content: string, time: number}>} messages - Riwayat pesan
     * @returns {Promise<string>} Balasan teks dari asisten AI
     */
    async function getAIReply(messages) {
        // Ambil pesan terakhir yang dikirim pengunjung
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
        const userText = lastUserMsg ? lastUserMsg.content.trim() : '';

        // Jika flag MOCK_ERROR aktif, simulasikan kegagalan respons untuk pengujian UI
        if (MOCK_ERROR) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            throw new Error("Simulasi error jaringan: Gagal menghubungi server AI.");
        }

        // 1. Coba hubungi Cloudflare Pages Function backend di /api/chat
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, messages }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data && typeof data.reply === 'string' && data.reply.trim()) {
                    return data.reply.trim();
                }
            } else {
                console.warn(`/api/chat mengembalikan status ${response.status}. Menggunakan balasan fallback cerdas.`);
            }
        } catch (apiError) {
            console.info('Endpoint /api/chat belum tersedia atau berjalan lokal tanpa serverless runtime. Menggunakan balasan cerdas lokal.', apiError);
        }

        // 2. Balasan fallback cerdas lokal jika API belum aktif atau saat testing lokal di browser
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
        const text = userText.toLowerCase();

        // Cocokkan dengan bank data mock
        if (text.includes('proyek') || text.includes('project') || text.includes('karya') || text.includes('aplikasi') || text.includes('web')) {
            return MOCK_KNOWLEDGE.proyek;
        } else if (text.includes('pkl') || text.includes('magang') || text.includes('pengalaman') || text.includes('kerja') || text.includes('ip network') || text.includes('madina')) {
            return MOCK_KNOWLEDGE.pkl;
        } else if (text.includes('sertifikat') || text.includes('sertifikasi') || text.includes('bnsp') || text.includes('kompetensi')) {
            return MOCK_KNOWLEDGE.sertifikasi;
        } else if (text.includes('kontak') || text.includes('hubung') || text.includes('email') || text.includes('telepon') || text.includes('linkedin') || text.includes('github')) {
            return MOCK_KNOWLEDGE.kontak;
        }

        return FALLBACK_REPLY;
    }

    /**
     * Helper untuk streaming teks (teks muncul sedikit demi sedikit).
     * Disiapkan agar nanti bisa digunakan dengan Server-Sent Events (SSE) atau fetch stream:
     * @param {string} bubbleId - ID unik dari elemen gelembung pesan
     * @param {string} chunk - Potongan kata/karakter yang baru diterima
     */
    function appendToMessage(bubbleId, chunk) {
        const bubbleEl = document.getElementById(bubbleId);
        if (bubbleEl) {
            const textEl = bubbleEl.querySelector('.chat-msg-text');
            if (textEl) {
                textEl.textContent += chunk;
                scrollChatToBottom();
            }
        }
    }

    // --- Inisialisasi Elemen DOM Chat ---
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatBadge = document.getElementById('chat-badge');
    const chatIconMsg = document.getElementById('chat-icon-msg');
    const chatIconClose = document.getElementById('chat-icon-close');
    const chatPanel = document.getElementById('chat-panel');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatResetBtn = document.getElementById('chat-reset-btn');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatCounter = document.getElementById('chat-counter');

    let isChatOpen = false;
    let isAssistantReplying = false;
    let chatMessages = []; // Format: { id: string, role: 'user' | 'assistant' | 'error', content: string, time: number }
    let showQuickReplies = true;

    // --- Format Jam Mono (HH:MM) ---
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // --- Penyimpanan Riwayat di sessionStorage ---
    const STORAGE_KEY = 'andika_chat_history_v1';

    function saveChatHistory() {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                messages: chatMessages,
                showQuickReplies: showQuickReplies
            }));
        } catch (e) {
            console.warn('Gagal menyimpan riwayat chat ke sessionStorage:', e);
        }
    }

    function loadChatHistory() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
                    // Validasi ketat schema untuk proteksi terhadap modifikasi data lokal
                    chatMessages = parsed.messages
                        .filter(m => m && typeof m.content === 'string' && ['user', 'assistant', 'error'].includes(m.role))
                        .map(m => ({
                            id: String(m.id || `msg-${Date.now()}`),
                            role: m.role,
                            content: String(m.content).slice(0, 2000), // Batas aman konten
                            time: Number(m.time) || Date.now()
                        }));
                    showQuickReplies = parsed.showQuickReplies !== undefined ? Boolean(parsed.showQuickReplies) : false;
                    return chatMessages.length > 0;
                }
            }
        } catch (e) {
            console.warn('Gagal memuat riwayat chat dari sessionStorage:', e);
        }
        return false;
    }

    function scrollChatToBottom() {
        if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    }

    // --- Render Gelembung Pesan ---
    function createMessageElement(msg) {
        const itemWrap = document.createElement('div');
        itemWrap.id = msg.id || `msg-${Date.now()}`;
        itemWrap.className = msg.role === 'user'
            ? 'flex flex-col items-end max-w-[85%] self-end ml-auto message-animate-in'
            : 'flex flex-col items-start max-w-[85%] self-start message-animate-in';

        if (msg.role === 'user') {
            // Gelembung pengunjung (kanan): latar ink teks paper (mode gelap: dibalik ke latar paper teks ink)
            itemWrap.innerHTML = `
                <div class="bg-ink dark:bg-paper text-paper dark:text-ink rounded-2xl rounded-br-sm p-3 shadow-brutal-sm font-body text-sm leading-relaxed break-words overflow-wrap-anywhere select-text">
                    <span class="chat-msg-text whitespace-pre-wrap">${escapeHtml(msg.content)}</span>
                </div>
                <span class="font-mono text-[10px] text-ink/70 dark:text-paper/70 mt-1 pr-1 tabular-nums">${formatTime(msg.time)}</span>
            `;
        } else if (msg.role === 'error') {
            // Gelembung kondisi error (berborder merah dengan tombol coba lagi)
            itemWrap.innerHTML = `
                <div class="border-2 border-red-500 bg-red-500/10 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-2xl rounded-bl-sm p-3 shadow-brutal-sm font-body text-sm leading-relaxed">
                    <div class="flex items-center gap-1.5 font-bold mb-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>Pesan gagal dikirim</span>
                    </div>
                    <p class="text-xs opacity-90 mb-2.5">Terjadi kesalahan saat memproses balasan asisten.</p>
                    <button type="button" class="chat-retry-btn hard-btn bg-red-500 hover:bg-red-600 active:translate-x-[2px] active:translate-y-[2px] text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-ink dark:border-paper shadow-brutal-sm cursor-interact flex items-center gap-1.5" aria-label="Coba lagi kirim pesan">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        <span>Coba lagi</span>
                    </button>
                </div>
                <span class="font-mono text-[10px] text-red-600 dark:text-red-400 mt-1 pl-1 tabular-nums">${formatTime(msg.time)}</span>
            `;

            // Pasang event retry
            const retryBtn = itemWrap.querySelector('.chat-retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    itemWrap.remove();
                    // Hapus pesan error dari state
                    chatMessages = chatMessages.filter(m => m.id !== msg.id);
                    saveChatHistory();
                    generateReply();
                });
            }
        } else {
            // Gelembung asisten (kiri): latar paper/surface, border 2px solid, sudut tumpul satu runcing
            itemWrap.innerHTML = `
                <div class="bg-paper dark:bg-ink border-2 border-ink dark:border-paper rounded-2xl rounded-bl-sm p-3 shadow-brutal-sm font-body text-sm text-ink dark:text-paper leading-relaxed break-words overflow-wrap-anywhere select-text">
                    <span class="chat-msg-text whitespace-pre-wrap">${formatMessageContent(msg.content)}</span>
                </div>
                <span class="font-mono text-[10px] text-ink/70 dark:text-paper/70 mt-1 pl-1 tabular-nums">${formatTime(msg.time)}</span>
            `;
        }

        return itemWrap;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatMessageContent(content) {
        // Otomatis ubah URL aman menjadi hyperlink dengan rel="noopener noreferrer"
        const escaped = escapeHtml(content);
        const urlPattern = /(https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+[a-zA-Z0-9/])/g;
        return escaped.replace(urlPattern, (match) => {
            return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="underline text-ink dark:text-acid font-bold hover:opacity-80 cursor-interact break-all">${match}</a>`;
        });
    }

    // --- Render Seluruh Pesan & Chips ---
    function renderChat() {
        if (!chatMessagesContainer) return;
        chatMessagesContainer.innerHTML = '';

        chatMessages.forEach(msg => {
            chatMessagesContainer.appendChild(createMessageElement(msg));
        });

        // Tampilkan chips jika belum pernah diklik / belum pernah kirim pesan
        if (showQuickReplies) {
            renderQuickReplyChips();
        }

        scrollChatToBottom();
    }

    // --- Render Quick Reply Chips ---
    function renderQuickReplyChips() {
        const chipsContainer = document.createElement('div');
        chipsContainer.id = 'chat-chips';
        chipsContainer.className = 'flex flex-col gap-2 pt-1 pb-2 w-full message-animate-in';

        const label = document.createElement('div');
        label.className = 'font-mono text-[11px] font-bold text-ink/60 dark:text-paper/60 uppercase tracking-wider pl-1';
        label.textContent = 'Pilih topik cepat:';
        chipsContainer.appendChild(label);

        const chipsList = document.createElement('div');
        chipsList.className = 'flex flex-wrap gap-2';

        QUICK_REPLIES.forEach(item => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hard-btn bg-paper dark:bg-ink text-ink dark:text-paper border-2 border-ink dark:border-paper rounded-full px-3.5 py-1.5 font-body text-xs font-bold shadow-brutal-sm hover:bg-acid hover:text-ink dark:hover:bg-acid dark:hover:text-ink transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-interact text-left';
            btn.setAttribute('aria-label', `Tanyakan: ${item.label}`);
            btn.textContent = item.label;

            btn.addEventListener('click', () => {
                removeChips();
                handleSendMessage(item.label);
            });

            chipsList.appendChild(btn);
        });

        chipsContainer.appendChild(chipsList);
        chatMessagesContainer.appendChild(chipsContainer);
    }

    function removeChips() {
        showQuickReplies = false;
        const chipsEl = document.getElementById('chat-chips');
        if (chipsEl) chipsEl.remove();
        saveChatHistory();
    }

    // --- Indikator Mengetik (Typing Indicator) ---
    let typingBubbleEl = null;

    function showTypingIndicator() {
        if (typingBubbleEl) return;
        typingBubbleEl = document.createElement('div');
        typingBubbleEl.id = 'chat-typing';
        typingBubbleEl.className = 'flex flex-col items-start max-w-[85%] self-start message-animate-in';
        typingBubbleEl.innerHTML = `
            <div class="bg-paper dark:bg-ink border-2 border-ink dark:border-paper rounded-2xl rounded-bl-sm px-4 py-3 shadow-brutal-sm flex items-center gap-1.5 font-mono text-xs text-ink dark:text-paper">
                <span class="typing-dot w-2 h-2 rounded-full bg-ink dark:bg-paper inline-block" aria-hidden="true"></span>
                <span class="typing-dot w-2 h-2 rounded-full bg-ink dark:bg-paper inline-block" aria-hidden="true"></span>
                <span class="typing-dot w-2 h-2 rounded-full bg-ink dark:bg-paper inline-block" aria-hidden="true"></span>
                <span class="reduced-typing-text hidden font-mono text-xs font-bold">Mengetik…</span>
                <span class="sr-only">Asisten sedang mengetik...</span>
            </div>
        `;
        chatMessagesContainer.appendChild(typingBubbleEl);
        scrollChatToBottom();
    }

    function hideTypingIndicator() {
        if (typingBubbleEl) {
            typingBubbleEl.remove();
            typingBubbleEl = null;
        }
    }

    // --- Pengiriman Pesan dengan Perlindungan Anti-Spam & Rate-Limiting ---
    let lastUserMessageTime = 0;

    async function handleSendMessage(customText = null) {
        if (isAssistantReplying) return;

        // Anti-flood rate limiting: batasi jeda kirim minimal 800ms
        const now = Date.now();
        if (now - lastUserMessageTime < 800) {
            return;
        }

        const rawText = customText !== null ? customText.trim() : (chatInput ? chatInput.value.trim() : '');
        if (!rawText) return;

        lastUserMessageTime = now;
        // Batasi panjang maksimum secara ketat
        const text = rawText.slice(0, 500);

        // Hilangkan chips setelah pesan pertama
        if (showQuickReplies) {
            removeChips();
        }

        // Reset input textarea & tombol
        if (chatInput && customText === null) {
            chatInput.value = '';
            chatInput.style.height = '44px';
            updateSendButtonState();
        }

        // Tambah pesan pengunjung
        const userMsg = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: text,
            time: Date.now()
        };
        chatMessages.push(userMsg);
        chatMessagesContainer.appendChild(createMessageElement(userMsg));
        scrollChatToBottom();
        saveChatHistory();

        // Mulai proses generate balasan
        await generateReply();
    }

    async function generateReply() {
        isAssistantReplying = true;
        updateSendButtonState();
        showTypingIndicator();

        try {
            const replyText = await getAIReply(chatMessages);
            hideTypingIndicator();

            const assistantMsg = {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: replyText,
                time: Date.now()
            };
            chatMessages.push(assistantMsg);
            chatMessagesContainer.appendChild(createMessageElement(assistantMsg));
            saveChatHistory();
        } catch (error) {
            console.error('Error generating AI reply:', error);
            hideTypingIndicator();

            const errorMsg = {
                id: `err-${Date.now()}`,
                role: 'error',
                content: error.message || 'Pesan gagal dikirim',
                time: Date.now()
            };
            chatMessages.push(errorMsg);
            chatMessagesContainer.appendChild(createMessageElement(errorMsg));
            saveChatHistory();
        } finally {
            isAssistantReplying = false;
            updateSendButtonState();
            scrollChatToBottom();
        }
    }

    // --- Buka / Tutup Panel Chat ---
    function openChat() {
        if (isChatOpen || !chatPanel) return;
        isChatOpen = true;

        // Hilangkan badge baru
        if (chatBadge) chatBadge.classList.add('hidden');

        // Hilangkan animasi goyang pada tombol
        if (chatToggleBtn) {
            chatToggleBtn.classList.remove('chat-wiggle');
            chatToggleBtn.setAttribute('aria-expanded', 'true');
            chatToggleBtn.setAttribute('aria-label', 'Tutup chat');
        }

        // Tukar ikon
        if (chatIconMsg) chatIconMsg.classList.add('hidden');
        if (chatIconClose) chatIconClose.classList.remove('hidden');

        // Tampilkan panel dengan animasi
        chatPanel.classList.remove('hidden');
        chatPanel.classList.add('flex');

        if (!prefersReducedMotion) {
            chatPanel.classList.remove('chat-panel-exit');
            chatPanel.classList.add('chat-panel-enter');
        }

        // Kunci gulir body pada layar mobile (< 640px)
        if (window.innerWidth < 640) {
            document.body.style.overflow = 'hidden';
            handleMobileKeyboard();
        }

        scrollChatToBottom();

        // Fokus ke input textarea
        setTimeout(() => {
            if (chatInput) chatInput.focus();
        }, 150);
    }

    function closeChat() {
        if (!isChatOpen || !chatPanel) return;
        isChatOpen = false;

        // Kembalikan ikon tombol
        if (chatIconClose) chatIconClose.classList.add('hidden');
        if (chatIconMsg) chatIconMsg.classList.remove('hidden');

        if (chatToggleBtn) {
            chatToggleBtn.setAttribute('aria-expanded', 'false');
            chatToggleBtn.setAttribute('aria-label', 'Buka chat dengan asisten Andika');
        }

        // Pulihkan scroll body pada mobile
        if (window.innerWidth < 640) {
            document.body.style.overflow = '';
            chatPanel.style.height = '';
            chatPanel.style.top = '';
        }

        if (!prefersReducedMotion) {
            chatPanel.classList.remove('chat-panel-enter');
            chatPanel.classList.add('chat-panel-exit');
            setTimeout(() => {
                chatPanel.classList.add('hidden');
                chatPanel.classList.remove('flex');
                if (chatToggleBtn) chatToggleBtn.focus();
            }, 200);
        } else {
            chatPanel.classList.add('hidden');
            chatPanel.classList.remove('flex');
            if (chatToggleBtn) chatToggleBtn.focus();
        }
    }

    function toggleChat() {
        if (isChatOpen) closeChat();
        else openChat();
    }

    // --- Mulai Chat Baru (Reset) ---
    function resetChat() {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.warn(e);
        }

        chatMessages = [
            {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: WELCOME_MESSAGE,
                time: Date.now()
            }
        ];
        showQuickReplies = true;
        renderChat();

        if (chatInput) {
            chatInput.value = '';
            chatInput.style.height = '44px';
            updateSendButtonState();
            chatInput.focus();
        }
    }

    // --- Manajemen Textarea Autosize & Send Button State ---
    function updateSendButtonState() {
        if (!chatSendBtn || !chatInput) return;
        const text = chatInput.value.trim();
        const len = chatInput.value.length;

        chatSendBtn.disabled = text.length === 0 || isAssistantReplying;

        // Update counter jika panjang >= 400 karakter
        if (chatCounter) {
            if (len >= 400) {
                chatCounter.classList.remove('hidden');
                chatCounter.textContent = `${len}/500`;
                if (len >= 490) {
                    chatCounter.classList.add('text-red-500');
                } else {
                    chatCounter.classList.remove('text-red-500');
                }
            } else {
                chatCounter.classList.add('hidden');
            }
        }
    }

    function handleInputResize() {
        if (!chatInput) return;
        chatInput.style.height = 'auto';
        // Batasi tinggi otomatis hingga max 110px (sekitar 4 baris)
        const newHeight = Math.min(Math.max(chatInput.scrollHeight, 44), 110);
        chatInput.style.height = `${newHeight}px`;
        updateSendButtonState();
    }

    // --- Dukungan Keyboard Virtual Mobile (visualViewport) ---
    function handleMobileKeyboard() {
        if (window.visualViewport && window.innerWidth < 640 && isChatOpen) {
            const vpHeight = window.visualViewport.height;
            chatPanel.style.height = `${vpHeight - 24}px`;
            chatPanel.style.top = '12px';
            chatPanel.style.bottom = 'auto';
            scrollChatToBottom();
        }
    }

    // --- Pemasangan Event Listeners ---
    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', toggleChat);
    }

    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', closeChat);
    }

    if (chatResetBtn) {
        chatResetBtn.addEventListener('click', resetChat);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', () => handleSendMessage());
    }

    if (chatInput) {
        chatInput.addEventListener('input', handleInputResize);
        chatInput.addEventListener('keydown', (e) => {
            // Enter untuk kirim, Shift+Enter untuk baris baru
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // Tutup dengan Escape jika chat sedang fokus/terbuka
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isChatOpen) {
            closeChat();
        }
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            if (isChatOpen) handleMobileKeyboard();
        });
    }

    // --- Inisialisasi Pesan Awal ---
    const hasHistory = loadChatHistory();
    if (!hasHistory) {
        chatMessages = [
            {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: WELCOME_MESSAGE,
                time: Date.now()
            }
        ];
        showQuickReplies = true;
    }
    renderChat();
    updateSendButtonState();
});
