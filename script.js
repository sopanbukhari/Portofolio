document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    document.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
        
        cursorRing.style.left = `${x}px`;
        cursorRing.style.top = `${y}px`;
    });

    const hoverables = document.querySelectorAll('a, button, .project-card, .tech-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu / Hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Tutup menu saat link diklik
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // 4. Typing Animation (Hero Section)
    const typedTextElement = document.getElementById('typedText');
    const words = ["Automation Specialist", "Quality Guardian", "Problem Solver", "SDET"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Berhenti sebentar di akhir kata
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    if (typedTextElement) type();

    // 5. Scroll Reveal & Stats Counter (Intersection Observer)
    // Inilah bagian yang akan memunculkan teks About Bio Anda
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Jalankan animasi angka jika elemen mengandung angka statistik
                const counters = entry.target.querySelectorAll('.stat-num, .achievement-num');
                counters.forEach(counter => animateCounter(counter));

                // Jalankan animasi skill bar
                const fills = entry.target.querySelectorAll('.skill-bar-fill');
                fills.forEach(fill => {
                    const level = fill.closest('.skill-bar-item').getAttribute('data-level');
                    fill.style.width = level + '%';
                });
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right, .skill-category').forEach(el => {
        revealObserver.observe(el);
    });

    function animateCounter(el) {
        if (el.dataset.animated) return;
        el.dataset.animated = "true";
        const target = +el.getAttribute('data-count');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        update();
    }

    // 6. Dark/Light Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    if (themeIcon) updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // 7. Contact Form Handlers
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
            contactForm.reset();
        });
    }

    // 8. Automation Demo Simulator
    const demoModal = document.getElementById('demoModal');
    const runDemoBtns = document.querySelectorAll('.btn-run-demo');
    const closeDemo = document.getElementById('closeDemo');
    const terminalOutput = document.getElementById('terminalOutput');
    const demoVideo = document.getElementById('demoVideo');
    const videoOverlay = document.getElementById('videoOverlay');

    if (runDemoBtns.length > 0 && demoModal) {
        runDemoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                demoModal.classList.add('active');
                startDemoSimulation();
            });
        });

        closeDemo.addEventListener('click', () => {
            demoModal.classList.remove('active');
            demoVideo.pause();
            demoVideo.currentTime = 0;
            terminalOutput.innerHTML = '<span class="t-gray">$ npx cypress run --spec "login.cy.js"</span><br>';
            videoOverlay.style.display = 'flex';
        });
    }

    async function startDemoSimulation() {
        terminalOutput.innerHTML = '<span class="t-gray">Initializing GitHub Actions trigger...</span><br>';

        // Memanggil Serverless Function (Proxy) kita sendiri
        const PROXY_URL = "/.netlify/functions/trigger-demo";
        const OWNER = "sopanbukhari"; 
        const REPO = "Portofolio";

        try {
            const triggerResponse = await fetch(PROXY_URL, {
                method: 'POST'
            });

            if (!triggerResponse.ok) throw new Error("Failed to trigger workflow");

            terminalOutput.innerHTML += `<div style="color:cyan">> Workflow dispatched successfully!</div>`;
            terminalOutput.innerHTML += `<div class="t-gray">> Waiting for runner to pick up the job...</div>`;

            // 2. Polling status (Cek status setiap 3 detik)
            const checkStatus = setInterval(async () => {
                // Polling data publik tidak memerlukan token (jika repo public)
                const statusResponse = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/actions/runs?per_page=1`);
                const data = await statusResponse.json();
                const lastRun = data.workflow_runs[0];

                terminalOutput.innerHTML += `<div class="t-gray">> Status: ${lastRun.status}...</div>`;
                terminalOutput.scrollTop = terminalOutput.scrollHeight;

                if (lastRun.status === 'completed') {
                    clearInterval(checkStatus);
                    const color = lastRun.conclusion === 'success' ? 'green' : 'red';
                    terminalOutput.innerHTML += `<div style="color:${color}">> Finished with conclusion: ${lastRun.conclusion}</div>`;
                    
                    if (lastRun.conclusion === 'success') {
                        videoOverlay.style.display = 'none';
                        demoVideo.play();
                    }
                }
            }, 3000);

            // Hentikan polling jika modal ditutup
            closeDemo.addEventListener('click', () => clearInterval(checkStatus));
            
        } catch (error) {
            terminalOutput.innerHTML += `<div style="color:red">> Error: ${error.message}</div>`;
        }
    }
});