/* --- Configuration Tailwind --- */
tailwind.config = {
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["Mulish", "sans-serif"],
                serif: ["Inter Tight", "serif"],
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
            }
        },
    },
};

/* --- Logique UI et DOM --- */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- GESTION DU HEADER AU SCROLL (VERSION GLASSMORPHISM) ---
    const header = document.getElementById('main-header');
    const headerTitle = document.querySelector('.header-title');
    const headerSubtitle = document.querySelector('.header-subtitle');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerPhone = document.querySelector('.header-phone');
    const mobileBtnIcon = document.querySelector('.mobile-menu-btn-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    function updateHeaderStyle() {
        if (!header) return;

        const isScrolled = window.scrollY > 20;
        const isMobileMenuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');

        if (isScrolled || isMobileMenuOpen) {
            // --- ÉTAT SCROLLÉ : EFFET VERRE GIVRÉ ---
            header.classList.remove('bg-transparent');
            
            // On retire les anciennes classes 'opaques' si elles existent
            header.classList.remove('bg-background/95', 'shadow-sm');
            
            // On ajoute notre classe CSS personnalisée Glassmorphism
            header.classList.add('glass-header-scroll'); 
            
            // Gestion des couleurs du texte (passage au sombre pour lisibilité sur le verre blanc)
            if(headerSubtitle) {
                headerSubtitle.classList.remove('text-white/80');
                headerSubtitle.classList.add('text-muted-foreground');
            }
            if(headerPhone) {
                headerPhone.classList.remove('text-white/90');
                headerPhone.classList.add('text-[#153e2e]'); // Vert sombre pour le téléphone
            }
            if(mobileBtnIcon) {
                mobileBtnIcon.classList.remove('text-white');
                mobileBtnIcon.classList.add('text-foreground');
            }
            
            navLinks.forEach(link => {
                link.classList.remove('text-white/90');
                link.classList.add('text-[#153e2e]', 'font-semibold'); // Texte plus lisible
            });

        } else {
            // --- ÉTAT HAUT DE PAGE : TRANSPARENT ---
            header.classList.add('bg-transparent');
            
            // On retire l'effet verre
            header.classList.remove('glass-header-scroll');
            header.classList.remove('bg-background/95', 'backdrop-blur-md', 'border-b', 'border-border', 'shadow-sm');
            
            // Retour aux couleurs blanches
            if(headerSubtitle) {
                headerSubtitle.classList.add('text-white/80');
                headerSubtitle.classList.remove('text-muted-foreground');
            }
            if(headerPhone) {
                headerPhone.classList.add('text-white/90');
                headerPhone.classList.remove('text-[#153e2e]');
            }
            if(mobileBtnIcon) {
                mobileBtnIcon.classList.add('text-white');
                mobileBtnIcon.classList.remove('text-foreground');
            }

            navLinks.forEach(link => {
                link.classList.add('text-white/90');
                link.classList.remove('text-[#153e2e]', 'font-semibold');
            });
        }
    }

    // Écouteur de scroll
    window.addEventListener('scroll', updateHeaderStyle);
    // Appel initial
    updateHeaderStyle();

    // --- GESTION DU MENU MOBILE ---
    const mobileBtn = document.getElementById('mobile-menu-btn');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            updateHeaderStyle();
        });
    }

    // --- DÉFILEMENT FLUIDE (SMOOTH SCROLL) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Gestion des liens depuis d'autres pages (ex: faq.html vers index.html#contact)
            if (targetId.includes('.html')) return; 

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    setTimeout(updateHeaderStyle, 10);
                }
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ---------------------------------------------------------
       --- AJOUT RGPD : BANDEAU COOKIES & GESTION ---
       --------------------------------------------------------- */
    initCookieConsent();






     // --- ACCORDÉON FAQ PREMIUM (Animation JS) ---
    const accordions = document.querySelectorAll("details");

    accordions.forEach((acc) => {
        const summary = acc.querySelector("summary");
        const content = acc.querySelector(".faq-content");

        summary.addEventListener("click", (e) => {
            e.preventDefault(); // On empêche l'ouverture instantanée par défaut

            // 1. Fermer les autres accordéons ouverts
            accordions.forEach((otherAcc) => {
                if (otherAcc !== acc && otherAcc.hasAttribute("open")) {
                    closeAccordion(otherAcc);
                }
            });

            // 2. Basculer l'état de l'accordéon actuel
            if (acc.hasAttribute("open")) {
                closeAccordion(acc);
            } else {
                openAccordion(acc);
            }
        });
    });

    function openAccordion(acc) {
        const content = acc.querySelector(".faq-content");
        
        // On ajoute l'attribut open pour que le navigateur affiche le contenu
        acc.setAttribute("open", "");
        acc.classList.add("is-expanded");

        // On calcule la hauteur réelle du contenu
        const startHeight = 0;
        const endHeight = content.scrollHeight;

        // On annule toute animation précédente
        if (acc.animation) acc.animation.cancel();

        // Animation via Web Animations API (très performant)
        acc.animation = content.animate(
            { height: [`${startHeight}px`, `${endHeight}px`] },
            { duration: 400, easing: "cubic-bezier(0.25, 1, 0.5, 1)" } // Courbe "Premium"
        );

        // À la fin de l'animation, on fixe la hauteur à "auto" pour le responsive
        acc.animation.onfinish = () => {
            content.style.height = "auto";
            acc.animation = null;
        };
    }

    function closeAccordion(acc) {
        const content = acc.querySelector(".faq-content");
        acc.classList.remove("is-expanded");

        const startHeight = content.scrollHeight;
        const endHeight = 0;

        if (acc.animation) acc.animation.cancel();

        acc.animation = content.animate(
            { height: [`${startHeight}px`, `${endHeight}px`] },
            { duration: 300, easing: "cubic-bezier(0.25, 1, 0.5, 1)" }
        );

        acc.animation.onfinish = () => {
            content.style.height = "0";
            acc.removeAttribute("open"); // On retire l'attribut seulement à la fin
            acc.animation = null;
        };
    }


    





    // --- ANIMATION DES CHIFFRES (COUNT UP) ---
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.getElementById('stats-section');
    let hasCounted = false; // Pour ne jouer l'animation qu'une seule fois

    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true; // Empêche de relancer si on scroll haut/bas
                    
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target'); // Le nombre final
                        const duration = 2000; // Durée en ms (2 secondes)
                        const start = 0;
                        const startTime = performance.now();

                        function updateCount(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            // Easing (effet de ralentissement à la fin)
                            // Formule : easeOutQuart
                            const ease = 1 - Math.pow(1 - progress, 4);
                            
                            const current = Math.floor(start + (target - start) * ease);
                            counter.innerText = current;

                            if (progress < 1) {
                                requestAnimationFrame(updateCount);
                            } else {
                                counter.innerText = target; // Assure le chiffre exact à la fin
                            }
                        }

                        requestAnimationFrame(updateCount);
                    });
                    
                    // On arrête d'observer une fois lancé
                    statsObserver.unobserve(statsSection);
                }
            });
        }, { threshold: 0.5 }); // Déclenche quand 50% de la section est visible

        statsObserver.observe(statsSection);
    }

});

/**
 * Logique du bandeau de consentement RGPD
 */
function initCookieConsent() {
    const consentKey = 'ecoToit_cookie_consent';
    // Vérifie si un choix a déjà été fait
    const hasConsented = localStorage.getItem(consentKey);

    // Si pas de choix, on affiche le bandeau
    if (!hasConsented) {
        showCookieBanner();
    } else if (hasConsented === 'accepted') {
        loadAnalyticsScripts(); // Charge les scripts si déjà accepté
    }

    // Fonction pour afficher le HTML du bandeau
    function showCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'fixed bottom-0 left-0 right-0 z-[60] bg-card border-t border-border shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] p-4 md:p-6 transform transition-transform duration-500 translate-y-full';
        
        banner.innerHTML = `
            <div class="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="text-sm text-muted-foreground md:pr-8 text-center md:text-left">
                    <p class="font-semibold text-foreground mb-1">Nous respectons votre vie privée</p>
                    <p>Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic. 
                    Vous pouvez accepter ou refuser ces traceurs. Pour en savoir plus, consultez notre 
                    <a href="privacy.html" class="underline hover:text-primary">politique de confidentialité</a>.</p>
                </div>
                <div class="flex gap-3 shrink-0">
                    <button id="btn-refuse" class="px-4 py-2 rounded-md border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors">
                        Refuser
                    </button>
                    <button id="btn-accept" class="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                        Accepter
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Animation d'entrée
        requestAnimationFrame(() => {
            banner.classList.remove('translate-y-full');
        });

        // Listeners
        document.getElementById('btn-accept').addEventListener('click', () => {
            localStorage.setItem(consentKey, 'accepted');
            loadAnalyticsScripts();
            closeBanner(banner);
        });

        document.getElementById('btn-refuse').addEventListener('click', () => {
            localStorage.setItem(consentKey, 'refused');
            closeBanner(banner);
        });
    }

    function closeBanner(banner) {
        banner.classList.add('translate-y-full');
        setTimeout(() => {
            banner.remove();
        }, 500);
    }
}

/**
 * Charge les scripts tiers (Google Analytics, Pixel, etc.)
 * UNIQUEMENT si l'utilisateur a accepté.
 */
function loadAnalyticsScripts() {
    console.log("Consentement accordé : Chargement des scripts d'analyse...");
    
    // EXEMPLE pour Google Analytics (GA4)
    // Décommentez et remplacez 'G-XXXXXXXXXX' par votre ID réel
    /*
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
    */
}
