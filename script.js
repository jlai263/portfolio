function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Don't apply fade-in to text elements
            if (!entry.target.classList.contains('section__text__p1') && 
                !entry.target.classList.contains('title') &&
                !entry.target.classList.contains('section__text__p2')) {
                entry.target.classList.add('fade-in');
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and article elements except text elements
document.querySelectorAll('section:not(#profile), article, .details-container').forEach((el) => {
    // Don't add fade-in-element to text containers
    if (!el.classList.contains('section__text__p1') && 
        !el.classList.contains('title') &&
        !el.classList.contains('section__text__p2')) {
        el.classList.add('fade-in-element');
        observer.observe(el);
    }
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add parallax effect to profile picture
const profilePic = document.querySelector('.profile-pic-img');
window.addEventListener('scroll', () => {
    const offset = window.pageYOffset;
    profilePic.style.transform = `translateY(${offset * 0.3}px)`;
});

// Initialize Three.js Scene with enhanced settings
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.querySelector('.canvas-container').appendChild(renderer.domElement);

// Create TorusKnot for background effect
const torusKnotGeometry = new THREE.TorusKnotGeometry(15, 1.5, 128, 32);
const torusKnotMaterial = new THREE.MeshPhongMaterial({
    color: 0x2563eb,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    shininess: 100
});
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
scene.add(torusKnot);

// Add particle system
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;
    
    colors[i] = Math.random();
    colors[i + 1] = Math.random();
    colors[i + 2] = Math.random();
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.5
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x2563eb, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff0066, 1);
pointLight2.position.set(-20, -20, -20);
scene.add(pointLight2);

camera.position.z = 30;

// Glitch effect for text
function enhancedGlitchText(element, finalText, iterations) {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let currentIteration = 0;
    
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.textShadow = '2px 2px #ff0066, -2px -2px #2563eb';
    
    const glitchInterval = setInterval(() => {
        if (currentIteration >= iterations) {
            element.textContent = finalText;
            element.style.textShadow = '2px 2px #ff0066, -2px -2px #2563eb';
            clearInterval(glitchInterval);
            return;
        }

        let glitchedText = '';
        for (let i = 0; i < finalText.length; i++) {
            if (Math.random() < currentIteration/iterations) {
                glitchedText += finalText[i];
            } else {
                glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
        }
        
        // Add random color shifts during glitch
        if (Math.random() < 0.3) {
            element.style.textShadow = `${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px #ff0066, 
                                      ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px #2563eb`;
        }
        
        element.textContent = glitchedText;
        currentIteration++;
    }, 50);
}

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Animate sections on scroll (excluding text elements and buttons)
document.querySelectorAll('section:not(.btn-container):not(#profile)').forEach(section => {
    // Skip animation for text elements
    if (section.classList.contains('section__text__p1') || 
        section.classList.contains('title') ||
        section.classList.contains('section__text__p2')) {
        return;
    }
    
    gsap.fromTo(section, {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 1
        }
    });
});

// Animate project cards
document.querySelectorAll('.color-container').forEach(card => {
    gsap.fromTo(card, {
        opacity: 0,
        scale: 0.8
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 50%",
            scrub: 1
        }
    });
});

// Enhanced Three.js Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate torus knot
    torusKnot.rotation.x += 0.001;
    torusKnot.rotation.y += 0.002;
    
    // Animate particles
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    
    // Dynamic camera movement based on mouse
    const mouseX = (window.innerWidth / 2 - (window.mouseX || 0)) * 0.001;
    const mouseY = (window.innerHeight / 2 - (window.mouseY || 0)) * 0.001;
    
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Pulse effect for lights
    const time = Date.now() * 0.001;
    pointLight.intensity = 1 + Math.sin(time) * 0.5;
    pointLight2.intensity = 1 + Math.cos(time) * 0.5;
    
    renderer.render(scene, camera);
}

// Track mouse position
window.addEventListener('mousemove', (e) => {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
    
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        // Prevent click event from bubbling up
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when scrolling
        window.addEventListener('scroll', () => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    
    // Make project buttons and contact links visible immediately
    document.querySelectorAll('.project-btn, .contact-info-container a').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto'; // Ensure elements are clickable
    });
    
    // Prevent any scroll during initial animation
    document.body.style.overflow = 'hidden';
    
    // Hide all content initially except project buttons and contact links
    document.querySelectorAll('section:not(#profile):not(.project-btn), .section__pic-container, .details-container')
        .forEach(el => {
            if (!el.classList.contains('project-btn') && 
                !el.closest('.project-btn') && 
                !el.classList.contains('contact-info-container') &&
                !el.closest('.contact-info-container')) {
                el.classList.add('content-hidden');
            }
        });

    // Hide profile content initially
    const profileContent = document.querySelectorAll('.section__text__p1, .title, .section__text__p2, .section__text > p:not(.section__text__p1):not(.section__text__p2), .btn-container, .section__pic-container');
    profileContent.forEach(el => {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
    });

    // Start animations
    startContentAnimations();
    
    // Re-enable scrolling after initial animation
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 2000);
});

// Content animations
function startContentAnimations() {
    const profile = document.querySelector('#profile');
    
    // Wait for split animation to complete
    setTimeout(() => {
        profile.classList.add('content-loaded');
        
        // Start the rest of the animations
        const timeline = anime.timeline({
            easing: 'easeOutExpo'
        });

        // Profile picture flip
        timeline
        .add({
            targets: '.section__pic-container',
            opacity: [0, 1],
            scale: [0.8, 1],
            rotateY: [-180, 0],
            duration: 1200,
            begin: () => {
                const picContainer = document.querySelector('.section__pic-container');
                picContainer.style.visibility = 'visible';
            }
        })
        // Hello I'm text
        .add({
            targets: '.section__text__p1',
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 800,
            begin: () => {
                const element = document.querySelector('.section__text__p1');
                element.style.visibility = 'visible';
                element.textContent = "Hello, I'm";
            }
        }, '-=400')
        // Name with glitch effect
        .add({
            targets: '.title',
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 800,
            begin: () => {
                const title = document.querySelector('.title');
                const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                let scrambledText = '';
                for (let i = 0; i < 'Justin Lai'.length; i++) {
                    scrambledText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
                title.textContent = scrambledText; // Start with scrambled text
                title.style.visibility = 'visible';
                title.style.opacity = '1';
                enhancedGlitchText(title, 'Justin Lai', 20);
            }
        }, '-=400')
        // Software Engineer text
        .add({
            targets: '.section__text__p2',
            opacity: [0, 1],
            duration: 800,
            begin: () => {
                const titleElement = document.querySelector('.section__text__p2');
                titleElement.style.visibility = 'visible';
                startTypingAnimation();
            }
        }, '-=200')
        // Description paragraph typing effect
        .add({
            duration: 800,
            begin: () => {
                const paragraph = document.querySelector('.section__text > p:not(.section__text__p1):not(.section__text__p2)');
                if (paragraph) {
                    paragraph.style.visibility = 'visible';
                    paragraph.style.opacity = '1';
                    typeDescription(paragraph);
                }
            }
        }, '+=400')
        // Buttons fade in
        .add({
            targets: '.btn-container',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            begin: () => {
                const btnContainer = document.querySelector('.btn-container');
                btnContainer.style.visibility = 'visible';
            }
        }, '+=400');
    }, 2000); // Wait for split animation
}

// Updated typing animation with glitch effect
function startTypingAnimation() {
    const titleElement = document.querySelector('.section__text__p2');
    const finalText = 'Software Engineer';
    titleElement.style.opacity = '1';
    
    let currentText = '';
    let i = 0;
    let cursorVisible = true;
    let blinkCount = 0;
    const maxBlinks = 3; // Number of times to blink after typing
    
    // Add blinking cursor
    function toggleCursor() {
        if (i < finalText.length || blinkCount < maxBlinks) {
            titleElement.textContent = currentText + (cursorVisible ? '█' : '');
            cursorVisible = !cursorVisible;
            
            if (i >= finalText.length && !cursorVisible) {
                blinkCount++;
            }
            
            setTimeout(toggleCursor, 400);
        } else {
            // Final state without cursor
            titleElement.textContent = finalText;
        }
    }
    
    function typeWriter() {
        if (i < finalText.length) {
            currentText += finalText[i];
            titleElement.textContent = currentText + '█';
            i++;
            
            // Random delay between 50-150ms for more natural typing
            setTimeout(typeWriter, 50 + Math.random() * 100);
        }
    }
    
    toggleCursor(); // Start cursor blinking
    typeWriter(); // Start typing
}

// Add new function for paragraph typing effect
function typeDescription(element) {
    const text = "Driven to create efficient, user-centric solutions through clean code and innovative problem-solving. Combining technical expertise with a strong focus on delivering measurable results.";
    
    // Pre-calculate the space needed
    element.style.opacity = '0';
    element.textContent = text;
    element.style.visibility = 'visible';
    
    // Start typing animation
    element.textContent = '';
    element.style.opacity = '1';
    let index = 0;
    
    function typeNextChar() {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            // Reduced typing speed by 50% (from 20-40ms to 10-20ms)
            setTimeout(typeNextChar, 10 + Math.random() * 10);
        }
    }
    
    typeNextChar();
}

// Start animation loop
animate();