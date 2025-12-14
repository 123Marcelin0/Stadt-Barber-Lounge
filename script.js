document.addEventListener('DOMContentLoaded', () => {

    // Sidebar to Topbar Scroll Effect
    const sidebar = document.querySelector('.sidebar');
    const shrinkTrigger = window.innerHeight * 0.4; // Start shrinking earlier
    const expandTrigger = window.innerHeight * 0.9; // Expand just before leaving/as leaving

    const barberPoles = document.getElementById('barberPoles');

    window.addEventListener('scroll', () => {
        // Disable scroll effects on mobile (< 900px) where sidebar is fullscreen overlay
        if (window.innerWidth <= 900) {
            // Ensure classes are removed if we switched from desktop to mobile while scrolled
            sidebar.classList.remove('shrinking');
            sidebar.classList.remove('topbar-mode');
            return;
        }

        const scrollY = window.scrollY;

        // Stage 1: Shrinking
        if (scrollY > shrinkTrigger && scrollY < expandTrigger) {
            sidebar.classList.add('shrinking');
            sidebar.classList.remove('topbar-mode');
        }
        // Stage 2: Topbar Expansion
        else if (scrollY >= expandTrigger) {
            sidebar.classList.remove('shrinking');
            sidebar.classList.add('topbar-mode');
        }
        // Reset
        else {
            sidebar.classList.remove('shrinking');
            sidebar.classList.remove('topbar-mode');
        }
    });

    // Mobile Navigation
    const mobileToggle = document.getElementById('mobileToggle');
    // sidebar is already defined at the top scope
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');

            // Toggle Icon
            const icon = mobileToggle.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close sidebar when a link is clicked
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Custom Cursor logic removal check: user didn't ask to remove, but standard script was overwritten before.
    // Keeping simple slideshow logic primarily.

    // Slideshow Logic
    const initSlideshow = () => {
        const slides = document.querySelectorAll('.lounge-slideshow .slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        const intervalTime = 2000; // 2 seconds

        setInterval(() => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');

            // Move to next
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active to next
            slides[currentSlide].classList.add('active');
        }, intervalTime);
    };

    initSlideshow();

    // Hero Background Slideshow Logic
    const initHeroSlideshow = () => {
        const heroSlides = document.querySelectorAll('#heroSlideshow .hero-slide');
        if (heroSlides.length === 0) return;

        let currentHeroSlide = 0;
        const heroIntervalTime = 4000; // 4 seconds

        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, heroIntervalTime);
    };

    initHeroSlideshow();

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .reveal-up, .reveal-left, .reveal-right, .anim-up, .anim-left, .anim-right, .anim-zoom');
    animatedElements.forEach(el => observer.observe(el));

    // Service Menu Interaction (Image Click)
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceDetails = document.querySelectorAll('.service-detail');

    if (serviceItems.length > 0) {
        serviceItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active from all items
                serviceItems.forEach(i => i.classList.remove('active'));
                // Add active to clicked item
                item.classList.add('active');

                // Get target id
                const targetId = item.getAttribute('data-target');

                // Hide all details
                serviceDetails.forEach(detail => detail.classList.remove('active'));

                // Show target detail
                const targetDetail = document.getElementById(targetId);
                if (targetDetail) {
                    targetDetail.classList.add('active');
                }
            });
        });

        // Navigation Arrows Logic
        const prevBtn = document.querySelector('.prev-service');
        const nextBtn = document.querySelector('.next-service');

        const getActiveIndex = () => {
            let activeIndex = 0;
            serviceItems.forEach((item, index) => {
                if (item.classList.contains('active')) {
                    activeIndex = index;
                }
            });
            return activeIndex;
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const currentIndex = getActiveIndex();
                const newIndex = (currentIndex - 1 + serviceItems.length) % serviceItems.length;
                serviceItems[newIndex].click();
            });

            nextBtn.addEventListener('click', () => {
                const currentIndex = getActiveIndex();
                const newIndex = (currentIndex + 1) % serviceItems.length;
                serviceItems[newIndex].click();
            });
        }
    }

    // Video Loop Delay Logic
    const promoVideo = document.getElementById('promoVideo');
    if (promoVideo) {
        promoVideo.addEventListener('ended', () => {
            setTimeout(() => {
                promoVideo.currentTime = 0;
                promoVideo.play();
            }, 5000); // 5 seconds delay
        });
    }
});
