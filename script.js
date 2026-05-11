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
        terminalOutput.innerHTML = '<div class="t-gray">> Initializing remote trigger via Vercel...</div>';
        const OWNER = "sopanbukhari";
        const REPO = "Portofolio";
        const WORKFLOW_ID = "cypress-demo.yml";

        try {
            // 1. Trigger Workflow via Serverless Function
            // Menggunakan path relatif agar lebih aman di berbagai environment
            const response = await fetch('api/trigger-demo', { method: 'POST' });
            
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Failed to trigger";
                
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // Menampilkan status jika Vercel mengembalikan HTML (404/500)
                    errorMessage = `Server Error (${response.status}): Endpoint not found or crashed.`;
                }
                throw new Error(errorMessage);
            }

            terminalOutput.innerHTML += '<div style="color:cyan">> GitHub Action triggered successfully!</div>';
            terminalOutput.innerHTML += '<div class="t-gray">> Waiting for runner to start...</div>';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;

            // 2. Polling Status (setiap 5 detik)
            let lastStatus = null;
            const checkStatus = setInterval(async () => {
                try {
                    const statusRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/actions/runs?workflow_id=${WORKFLOW_ID}&per_page=1`);
                    const data = await statusRes.json();
                    const lastRun = data.workflow_runs[0];

                    if (!lastRun || lastRun.status === lastStatus) return;
                    
                    // Simpan status saat ini agar tidak spam di iterasi berikutnya
                    lastStatus = lastRun.status;

                    // Update UI berdasarkan status GitHub
                    if (lastRun.status === 'queued') {
                        terminalOutput.innerHTML += '<div class="t-gray">> Status: Queued in GitHub Queue...</div>';
                    } else if (lastRun.status === 'in_progress') {
                        terminalOutput.innerHTML += '<div style="color:yellow">> Status: In Progress (Running Cypress Tests)...</div>';
                    }
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;

                    // Jika selesai
                    if (lastRun.status === 'completed') {
                        clearInterval(checkStatus);
                        if (lastRun.conclusion === 'success') {
                            terminalOutput.innerHTML += '<div style="color:#2ea043">> Run Finished: SUCCESS. Playing Recording...</div>';
                            
                            // Mengambil video 'latest_demo' dari Cloudinary Anda
                            // Ganti 'YOUR_CLOUD_NAME' dengan Cloud Name yang Anda masukkan di GitHub Secret
                            // Pastikan ini diisi Cloud Name (ID Akun), bukan nama preset.
                            const cloudName = "dbchkahnw"; 
                            const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/latest_demo.mp4?t=${Date.now()}`;

                            terminalOutput.innerHTML += '<div class="t-gray">> Finalizing video stream...</div>';

                            // Fungsi pembantu untuk mengecek apakah video sudah benar-benar siap di Cloudinary
                            const checkVideoAvailability = async (url, retries = 5) => {
                                for (let i = 0; i < retries; i++) {
                                    try {
                                        // Menggunakan mode no-cors untuk menghindari masalah preflight CORS
                                        // dan mengabaikan kesalahan DNS sementara
                                        const res = await fetch(url, { method: 'GET', mode: 'no-cors' });
                                        // Pada mode no-cors, kita tidak bisa cek res.ok, 
                                        // tapi jika tidak masuk ke catch, berarti server merespon.
                                        return true;
                                    } catch (e) {
                                        console.log(`Video not ready yet (Attempt ${i + 1}), retrying...`, e);
                                    }
                                    await new Promise(resolve => setTimeout(resolve, 2000)); // Tunggu 2 detik
                                }
                                return false;
                            };

                            const isReady = await checkVideoAvailability(videoUrl);

                            if (isReady) {
                                videoOverlay.style.display = 'none';
                                demoVideo.src = videoUrl;
                                demoVideo.load();
                                demoVideo.play().catch(err => {
                                    console.warn("Playback failed:", err);
                                    terminalOutput.innerHTML += '<div style="color:orange">> Click video to play manually.</div>';
                                });
                            } else {
                                terminalOutput.innerHTML += '<div style="color:#ef4444">> Error: Video processing timeout.</div>';
                            }
                        } else {
                            terminalOutput.innerHTML += `<div style="color:#ef4444">> Run Finished: ${lastRun.conclusion ? lastRun.conclusion.toUpperCase() : 'FAILED'}</div>`;
                            clearInterval(checkStatus);
                        }
                    }
                } catch (pollError) {
                    console.error("Polling error:", pollError);
                }
            }, 5000);

            // Stop polling jika modal ditutup
            closeDemo.addEventListener('click', () => clearInterval(checkStatus), { once: true });

        } catch (error) {
            terminalOutput.innerHTML += `<div style="color:#ef4444">> Error: ${error.message}</div>`;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }
});