// Initialize Lucide Icons
lucide.createIcons();

// Matrix Rain Effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix characters
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = [];

// Initialize drops
function initDrops() {
    drops = [];
    columns = canvas.width / fontSize;
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
}
initDrops();

function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#059669';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Animation loop
let matrixInterval;
function startMatrix() {
    matrixInterval = setInterval(drawMatrix, 25);
}

// Pause matrix when tab is hidden to save resources
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(matrixInterval);
    } else {
        startMatrix();
    }
});

startMatrix();

// Particle Network Animation
const particleCanvas = document.getElementById('particleCanvas');
const pCtx = particleCanvas.getContext('2d');
let particles = [];
let animationId;

function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', () => {
    resizeParticleCanvas();
    initDrops();
    initParticles();
});

class Particle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;
    }

    draw() {
        pCtx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.min(100, (particleCanvas.width * particleCanvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((a, index) => {
        particles.slice(index + 1).forEach(b => {
            const distance = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
            if (distance < 150) {
                pCtx.strokeStyle = `rgba(16, 185, 129, ${0.2 * (1 - distance / 150)})`;
                pCtx.lineWidth = 1;
                pCtx.beginPath();
                pCtx.moveTo(a.x, a.y);
                pCtx.lineTo(b.x, b.y);
                pCtx.stroke();
            }
        });
    });

    animationId = requestAnimationFrame(animateParticles);
}
animateParticles();

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: 'forwards' });
});

// Cursor hover effect
document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover');
    });
});

// Text Scramble Effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="text-emerald-400">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect on hover
document.querySelectorAll('.scramble-text').forEach(el => {
    const fx = new TextScramble(el);
    const originalText = el.getAttribute('data-value') || el.innerText;
    
    el.addEventListener('mouseenter', () => {
        fx.setText(originalText);
    });
});

// Counter Animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 1000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + '+';
                }
            };
            
            updateCounter();
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});

// Skill Progress Bar Animation
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target.querySelector('.skill-progress-bar');
            const progress = bar.style.getPropertyValue('--progress');
            setTimeout(() => {
                bar.style.width = progress;
            }, 100);
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-progress').forEach(progress => {
    progressObserver.observe(progress);
});

// Binary Particles
function createBinaryParticle() {
    const particle = document.createElement('div');
    particle.className = 'binary-particle';
    particle.textContent = Math.random() > 0.5 ? '1' : '0';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = '-20px';
    particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
    particle.style.fontSize = (Math.random() * 10 + 10) + 'px';
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

setInterval(createBinaryParticle, 1000);

// Typewriter Effect
const typewriterText = [
    'Cybersecurity Enthusiast',
    'Full Stack Developer',
    'Ethical Hacker',
    'Problem Solver'
];
let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function typeWriter() {
    const currentText = typewriterText[typewriterIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 25 : 50;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 1000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typewriterIndex = (typewriterIndex + 1) % typewriterText.length;
        typeSpeed = 250;
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter after page load
window.addEventListener('load', typeWriter);

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
});

// Smooth Scroll with Offset for Fixed Header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all skill cards and project cards
document.querySelectorAll('.skill-card, .project-card').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Active Navigation Highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-emerald-400', 'active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('text-emerald-400', 'active');
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-emerald-500 text-slate-950 px-6 py-3 rounded-lg shadow-lg transform translate-y-20 transition-transform duration-300 font-mono font-bold z-50 flex items-center gap-2';
    notification.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5"></i><span>Message transmitted successfully!</span>';
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-y-20');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-y-20');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Reset form
    contactForm.reset();
});

// Add parallax effect to hero image
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('#home .relative.w-64');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Dynamic Year in Footer
const yearElement = document.getElementById('footer-year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Skill card 3D tilt effect
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Skill Tooltip Functionality
const skillTooltip = document.getElementById('skill-tooltip');
const skillName = document.getElementById('skill-name');
const skillLevel = document.getElementById('skill-level');

document.querySelectorAll('.skill-orb').forEach(orb => {
    orb.addEventListener('mouseenter', (e) => {
        const skill = orb.getAttribute('data-skill');
        const level = orb.getAttribute('data-level');

        skillName.textContent = skill;
        skillLevel.textContent = `Proficiency: ${level}%`;

        skillTooltip.style.left = e.pageX + 10 + 'px';
        skillTooltip.style.top = e.pageY - 10 + 'px';
        skillTooltip.classList.remove('opacity-0');
        skillTooltip.classList.add('opacity-100');
    });

    orb.addEventListener('mousemove', (e) => {
        skillTooltip.style.left = e.pageX + 10 + 'px';
        skillTooltip.style.top = e.pageY - 10 + 'px';
    });

    orb.addEventListener('mouseleave', () => {
        skillTooltip.classList.remove('opacity-100');
        skillTooltip.classList.add('opacity-0');
    });
});

// Enhanced Skill Progress Bar Animation
const skillProgressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress-bar');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    const progress = bar.style.getPropertyValue('--progress');
                    bar.style.width = progress;
                }, index * 200);
            });
            skillProgressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-detail-card').forEach(card => {
    skillProgressObserver.observe(card);
});

// Skill Orb Hover Effects
document.querySelectorAll('.skill-orb').forEach(orb => {
    orb.addEventListener('mouseenter', () => {
        // Pause orbital animation
        const parentOrbit = orb.closest('[class*="animate-spin"]');
        if (parentOrbit) {
            parentOrbit.style.animationPlayState = 'paused';
        }
    });

    orb.addEventListener('mouseleave', () => {
        // Resume orbital animation
        const parentOrbit = orb.closest('[class*="animate-spin"]');
        if (parentOrbit) {
            parentOrbit.style.animationPlayState = 'running';
        }
    });
});

// Contact Typewriter Effect
const contactMessages = [
    "Ready to collaborate on your next cybersecurity project?",
    "Let's build something secure and innovative together.",
    "Have a security challenge? I'm here to help solve it.",
    "Connect with me to discuss your cyber defense needs."
];

let contactMessageIndex = 0;
let contactCharIndex = 0;
let contactIsDeleting = false;
const contactTypewriterElement = document.getElementById('contact-typewriter');

function contactTypeWriter() {
    const currentMessage = contactMessages[contactMessageIndex];
    
    if (contactIsDeleting) {
        contactTypewriterElement.textContent = currentMessage.substring(0, contactCharIndex - 1);
        contactCharIndex--;
    } else {
        contactTypewriterElement.textContent = currentMessage.substring(0, contactCharIndex + 1);
        contactCharIndex++;
    }

    let typeSpeed = contactIsDeleting ? 15 : 30;

    if (!contactIsDeleting && contactCharIndex === currentMessage.length) {
        typeSpeed = 1500;
        contactIsDeleting = true;
    } else if (contactIsDeleting && contactCharIndex === 0) {
        contactIsDeleting = false;
        contactMessageIndex = (contactMessageIndex + 1) % contactMessages.length;
        typeSpeed = 250;
    }

    setTimeout(contactTypeWriter, typeSpeed);
}

// Start contact typewriter after page load
window.addEventListener('load', () => {
    setTimeout(contactTypeWriter, 1000);
});

// Terminal Interface
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalSubmit = document.getElementById('terminal-submit');

const terminalCommands = {
    help: () => {
        return `Available commands:
• help - Show this help message
• email - Get contact email
• github - Open GitHub profile
• linkedin - Open LinkedIn profile
• twitter - Open Twitter profile
• clear - Clear terminal
• about - Learn more about me
• skills - View my skills
• projects - View my projects`;
    },
    email: () => 'tanvikapadole@example.com',
    github: () => {
        window.open('https://github.com', '_blank');
        return 'Opening GitHub profile...';
    },
    linkedin: () => {
        window.open('https://linkedin.com', '_blank');
        return 'Opening LinkedIn profile...';
    },
    twitter: () => {
        window.open('https://twitter.com', '_blank');
        return 'Opening Twitter profile...';
    },
    clear: () => {
        terminalOutput.innerHTML = '<div class="text-cyan-400">tanvika@contact:~$ <span class="animate-pulse">_</span></div>';
        return '';
    },
    about: () => 'I\'m Tanvika Padole, a passionate cybersecurity enthusiast and full-stack developer. I specialize in creating secure, innovative solutions and love tackling complex security challenges.',
    skills: () => 'My expertise includes: Cybersecurity, Ethical Hacking, Web Development, Python, JavaScript, Network Security, Penetration Testing, and Security Auditing.',
    projects: () => 'Check out my projects section above to see my latest work in cybersecurity and development!'
};

function executeCommand(command) {
    const cmd = command.toLowerCase().trim();
    
    if (terminalCommands[cmd]) {
        return terminalCommands[cmd]();
    } else {
        return `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
}

function addToTerminal(text, isCommand = false) {
    const line = document.createElement('div');
    line.className = isCommand ? 'mb-2 text-cyan-400' : 'mb-2';
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function processTerminalCommand() {
    const command = terminalInput.value;
    if (!command) return;
    
    // Add command to output
    addToTerminal(`tanvika@contact:~$ ${command}`, true);
    
    // Execute command
    const result = executeCommand(command);
    if (result) {
        addToTerminal(result);
    }
    
    // Add new prompt
    addToTerminal('tanvika@contact:~$ <span class="animate-pulse">_</span>', true);
    
    // Clear input
    terminalInput.value = '';
}

terminalSubmit.addEventListener('click', processTerminalCommand);
terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        processTerminalCommand();
    }
});

// Contact card 3D tilt effect
document.querySelectorAll('.contact-card, .contact-info-card, .terminal-card, .social-links-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Observe contact section elements for scroll reveal
document.querySelectorAll('.contact-card, .contact-info-card, .terminal-card, .social-links-card').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Floating blob animations
function initFloatingBlobs() {
    const blobs = document.querySelectorAll('.floating-blob');
    blobs.forEach((blob, index) => {
        // Random animation delays and durations
        const delay = Math.random() * 5;
        const duration = 15 + Math.random() * 10;
        
        blob.style.animationDelay = `${delay}s`;
        blob.style.animationDuration = `${duration}s`;
        
        // Random movement pattern
        const keyframes = `
            @keyframes float${index} {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        blob.style.animationName = `float${index}`;
    });
}

// Initialize floating blobs when contact section is visible
const contactSection = document.getElementById('contact');
if (contactSection) {
    const blobObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initFloatingBlobs();
                blobObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    blobObserver.observe(contactSection);
}

// Achievement Stat Counters
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statCard = entry.target;
            const statNumber = statCard.querySelector('.stat-card div:first-child');
            const target = parseInt(statNumber.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateStat = () => {
                current += increment;
                if (current < target) {
                    statNumber.innerText = Math.ceil(current);
                    requestAnimationFrame(updateStat);
                } else {
                    statNumber.innerText = target;
                }
            };
            
            updateStat();
            statObserver.unobserve(statCard);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// GitHub Stat Counters
const githubStatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statCard = entry.target;
            const statNumber = statCard.querySelector('div:first-child');
            const target = parseInt(statNumber.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateStat = () => {
                current += increment;
                if (current < target) {
                    statNumber.innerText = Math.ceil(current);
                    requestAnimationFrame(updateStat);
                } else {
                    statNumber.innerText = target;
                }
            };
            
            updateStat();
            githubStatObserver.unobserve(statCard);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.github-stat').forEach(card => {
    githubStatObserver.observe(card);
});

// Performance Monitoring
let fps = 60;
let lastTime = performance.now();
let frameCount = 0;

function updateFPS() {
    const currentTime = performance.now();
    frameCount++;
    
    if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        const fpsCounter = document.getElementById('fps-counter');
        if (fpsCounter) {
            fpsCounter.textContent = fps;
        }
    }
    
    requestAnimationFrame(updateFPS);
}

updateFPS();

// Page Load Time
const loadTime = (performance.getEntriesByType('navigation')[0].loadEventEnd - 
                  performance.getEntriesByType('navigation')[0].fetchStart) / 1000;
const loadTimeElement = document.getElementById('load-time');
if (loadTimeElement) {
    loadTimeElement.textContent = loadTime.toFixed(2) + 's';
}

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide button based on scroll position
    if (scrollTop > 300) {
        backToTopBtn.classList.remove('opacity-0', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
        backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        backToTopBtn.classList.add('opacity-0', 'translate-y-4');
    }
    
    lastScrollTop = scrollTop;
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Achievement Card Hover Effects
document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Activity Card Hover Effects
document.querySelectorAll('.activity-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Stagger Reveal Animation for New Sections
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.stagger-reveal').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    staggerObserver.observe(el);
});