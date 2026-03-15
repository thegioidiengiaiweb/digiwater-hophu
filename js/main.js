document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mobile-menu .btn');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('translate-x-full');
        if (mobileMenu.classList.contains('translate-x-full')) {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    };

    menuToggle?.addEventListener('click', toggleMenu);
    menuClose?.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Vietnam Map Interactivity
    const markers = document.querySelectorAll('.map-marker');
    const regionInfos = document.querySelectorAll('.region-info');
    const regions = ['north', 'central', 'south'];
    let currentRegionIdx = 0;
    let mapInterval;

    const activateRegion = (regionId) => {
        // Update index
        currentRegionIdx = regions.indexOf(regionId);
        
        // Reset
        markers.forEach(m => m.classList.remove('active'));
        regionInfos.forEach(info => info.classList.remove('is-active'));

        // Activate
        const marker = document.querySelector(`.map-marker.${regionId}`);
        const info = document.getElementById(`info-${regionId}`);
        
        marker?.classList.add('active');
        info?.classList.add('is-active');
    };

    const startMapRotation = () => {
        clearInterval(mapInterval);
        mapInterval = setInterval(() => {
            currentRegionIdx = (currentRegionIdx + 1) % regions.length;
            activateRegion(regions[currentRegionIdx]);
        }, 4000);
    };

    const stopMapRotation = () => {
        clearInterval(mapInterval);
    };

    // Event listeners for markers
    markers.forEach(marker => {
        marker.addEventListener('click', () => {
            const region = marker.getAttribute('data-region');
            activateRegion(region);
            startMapRotation(); // Reset timer
        });
        
        marker.addEventListener('mouseenter', () => {
            const region = marker.getAttribute('data-region');
            activateRegion(region);
            stopMapRotation();
        });
        
        marker.addEventListener('mouseleave', () => {
            startMapRotation();
        });
    });

    // Event listeners for info boxes
    regionInfos.forEach(info => {
        const regionId = info.id.replace('info-', '');
        
        info.addEventListener('click', () => {
            activateRegion(regionId);
            startMapRotation(); // Reset timer
        });
        
        info.addEventListener('mouseenter', () => {
            activateRegion(regionId);
            stopMapRotation();
        });
        
        info.addEventListener('mouseleave', () => {
            startMapRotation();
        });
    });

    // Initial start
    activateRegion(regions[0]);
    startMapRotation();

    // Form Handling
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Simple UI feedback
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Đang gửi...';
        btn.disabled = true;

        setTimeout(() => {
            // Replace alert with a custom toast
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] animate-bounce-in';
            toast.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-emerald-400 text-xl">✓</span>
                    <p class="font-medium">Cảm ơn bạn đã liên hệ! DigiWater sẽ phản hồi sớm nhất có thể.</p>
                </div>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('animate-bounce-out');
                setTimeout(() => toast.remove(), 500);
            }, 4000);

            contactForm.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    });

    // Particle/Water Effect in Hero (Simple Canvas)
    const initHeroParticles = () => {
        const container = document.getElementById('hero-canvas-container');
        if (!container) return;

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height, particles;

        const resize = () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw() {
                ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();
    };

    initHeroParticles();

    // Scientific Section Particles
    const initScientificParticles = () => {
        const container = document.getElementById('scientific-canvas-container');
        if (!container) return;

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width, height, particles;

        const resize = () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw() {
                ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = [];
            for (let i = 0; i < 60; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();
    };

    initScientificParticles();

    // Mobile Interaction: Scroll to center & Tap toggle
    const interactiveElementsSelector = '.capability-card, .scientific-card, .dashboard-card, .ecosystem-tgdg, .ecosystem-tglt, .ecosystem-digiwater, .why-card, .glass-card, .region-info, .process-step, .process-card, .group, .ecosystem-block, .ecosystem-card-mobile';
    const interactiveElements = document.querySelectorAll(interactiveElementsSelector);
    
    const handleMobileInteractions = () => {
        if (window.innerWidth >= 1024) {
            return;
        }

        const viewportCenter = window.innerHeight / 2;
        const sections = new Set();
        
        // Refresh elements in case of dynamic content
        const currentElements = document.querySelectorAll(interactiveElementsSelector);
        
        currentElements.forEach(el => {
            const section = el.closest('section') || el.parentElement;
            if (section) sections.add(section);
        });

        sections.forEach(section => {
            const sectionElements = Array.from(section.querySelectorAll(interactiveElementsSelector));
            let centeredElement = null;
            let minDistance = Infinity;

            sectionElements.forEach(el => {
                // Skip if manually toggled
                if (el.dataset.manuallyToggled === 'true') return;

                const rect = el.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const distance = Math.abs(viewportCenter - elementCenter);

                const isOverlapping = rect.top < viewportCenter && rect.bottom > viewportCenter;
                if (distance < minDistance && (isOverlapping || distance < window.innerHeight / 3)) {
                    minDistance = distance;
                    centeredElement = el;
                }
            });

            // Identify active group if centered element belongs to one
            const activeGroup = centeredElement?.dataset.group;

            sectionElements.forEach(el => {
                if (el.dataset.manuallyToggled === 'true') return;
                
                const isInActiveGroup = activeGroup && el.dataset.group === activeGroup;
                
                if (el === centeredElement || isInActiveGroup) {
                    el.classList.add('is-active');
                } else {
                    el.classList.remove('is-active');
                }
            });
        });
    };

    // Manual Tap Toggle
    document.addEventListener('click', (e) => {
        if (window.innerWidth >= 1024) return;
        
        const el = e.target.closest(interactiveElementsSelector);
        if (!el) return;

        // Toggle state and mark as manually controlled
        const isActive = el.classList.contains('is-active');
        if (isActive) {
            el.classList.remove('is-active');
        } else {
            el.classList.add('is-active');
        }
        el.dataset.manuallyToggled = 'true';
        handleMobileInteractions();
    });

    window.addEventListener('scroll', handleMobileInteractions);
    window.addEventListener('resize', handleMobileInteractions);
    handleMobileInteractions();

    // Testimonial Slider Logic (Enhanced with Drag/Swipe and 3s Auto-slide)
    const initTestimonialSlider = () => {
        const container = document.querySelector('.testimonial-slider-container');
        const track = document.getElementById('testimonial-track');
        const dotsContainer = document.getElementById('testimonial-dots');
        
        if (!track || !container) return;

        const slides = Array.from(track.children);
        const slideCount = slides.length;
        
        let currentIndex = 0;
        let isPaused = false;
        let interval;
        let isTransitioning = false;

        // Drag/Swipe variables
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;

        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = `w-2 h-2 rounded-full bg-slate-300 transition-all duration-300 hover:bg-sky-400`;
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    currentIndex = i;
                    setPositionByIndex();
                    stopAutoSlide();
                    startAutoSlide();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const setPositionByIndex = () => {
            if (!slides.length || !container) return;
            const containerWidth = container.offsetWidth;
            const slideWidth = slides[0].offsetWidth;
            if (!slideWidth) return;
            
            currentTranslate = (containerWidth / 2) - (slideWidth / 2) - (currentIndex * slideWidth);
            prevTranslate = currentTranslate;
            setSliderPosition();
            updateActiveStates();
        };

        const setSliderPosition = () => {
            track.style.transform = `translateX(${currentTranslate}px)`;
        };

        const updateActiveStates = () => {
            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    slide.classList.add('is-active');
                } else {
                    slide.classList.remove('is-active');
                }
            });

            if (dotsContainer) {
                const dots = dotsContainer.children;
                Array.from(dots).forEach((dot, i) => {
                    if (i === currentIndex) {
                        dot.classList.add('bg-sky-500', 'w-6');
                        dot.classList.remove('bg-slate-300', 'w-2');
                    } else {
                        dot.classList.remove('bg-sky-500', 'w-6');
                        dot.classList.add('bg-slate-300', 'w-2');
                    }
                });
            }
        };

        const animation = () => {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        };

        const touchStart = (index) => {
            return (event) => {
                isDragging = true;
                isPaused = true;
                startX = getPositionX(event);
                animationID = requestAnimationFrame(animation);
                track.style.transition = 'none';
            };
        };

        const touchMove = (event) => {
            if (isDragging) {
                const currentX = getPositionX(event);
                const diff = currentX - startX;
                currentTranslate = prevTranslate + diff;
            }
        };

        const touchEnd = () => {
            isDragging = false;
            isPaused = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
            if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

            track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            setPositionByIndex();
        };

        const getPositionX = (event) => {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        };

        // Event Listeners
        slides.forEach((slide, index) => {
            const slideImage = slide.querySelector('img');
            if (slideImage) slideImage.addEventListener('dragstart', (e) => e.preventDefault());

            // Touch events
            slide.addEventListener('touchstart', touchStart(index));
            slide.addEventListener('touchend', touchEnd);
            slide.addEventListener('touchmove', touchMove);

            // Mouse events
            slide.addEventListener('mousedown', touchStart(index));
            slide.addEventListener('mouseup', touchEnd);
            slide.addEventListener('mouseleave', () => {
                if (isDragging) touchEnd();
            });
            slide.addEventListener('mousemove', touchMove);

            // Click to switch slide
            slide.addEventListener('click', () => {
                // Only switch if we weren't dragging and it's not the current slide
                const movedBy = Math.abs(currentTranslate - prevTranslate);
                if (movedBy < 5 && currentIndex !== index) {
                    currentIndex = index;
                    track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                    setPositionByIndex();
                    stopAutoSlide();
                    startAutoSlide();
                }
            });
        });

        const nextSlide = () => {
            if (isPaused || isDragging) return;
            currentIndex = (currentIndex + 1) % slideCount;
            track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            setPositionByIndex();
        };

        const startAutoSlide = () => {
            clearInterval(interval);
            interval = setInterval(nextSlide, 3000);
        };

        const stopAutoSlide = () => {
            clearInterval(interval);
        };

        // Initial setup
        setTimeout(() => {
            setPositionByIndex();
            startAutoSlide();
        }, 100);

        window.addEventListener('resize', setPositionByIndex);
    };

    initTestimonialSlider();

    // Why DigiWater Card Rotation
    const initWhyDigiWaterRotation = () => {
        const cards = document.querySelectorAll('.why-card');
        const grid = document.getElementById('why-digiwater-grid');
        if (!cards.length || !grid) return;

        let currentIndex = -1;
        let interval;
        let isPaused = false;

        const highlightNext = () => {
            if (isPaused) return;
            
            // Remove active from all
            cards.forEach(card => card.classList.remove('is-active'));
            
            // Increment and highlight
            currentIndex = (currentIndex + 1) % cards.length;
            cards[currentIndex].classList.add('is-active');
        };

        const startRotation = () => {
            clearInterval(interval);
            interval = setInterval(highlightNext, 4000);
            highlightNext(); // Immediate first highlight
        };

        grid.addEventListener('mouseenter', () => {
            isPaused = true;
            clearInterval(interval);
            cards.forEach(card => card.classList.remove('is-active'));
        });

        grid.addEventListener('mouseleave', () => {
            isPaused = false;
            // Reset index so it starts from the beginning or continues?
            // User said "tiếp tục", so let's just restart the interval.
            startRotation();
        });

        // Start initially
        startRotation();
    };

    initWhyDigiWaterRotation();
});
