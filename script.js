document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing space portfolio...');
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero Section Animation
    gsap.fromTo('#hero h1', 
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
    );
    
    gsap.fromTo('#hero p', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
    );
    
    gsap.fromTo('#hero .btn-primary, #hero .btn-secondary', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 1, stagger: 0.2, ease: 'back.out(1.7)' }
    );
    
    // Section Animations on Scroll
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (section.id !== 'hero') {
            gsap.fromTo(section, 
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'bottom 15%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    });
    
    // Project Cards Animation
    gsap.fromTo('.project-card', 
        { opacity: 0, y: 50, scale: 0.9 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Timeline Items Animation
    gsap.fromTo('.timeline-item', 
        { opacity: 0, x: -50 },
        {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#experience',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Skills Animation
    gsap.fromTo('.skill-icon', 
        { opacity: 0, scale: 0, rotation: 180 },
        {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '#skills',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Three.js Advanced Space Background Setup
    console.log('Setting up Three.js scene...');
    
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded!');
        return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    
    // Check if canvas element exists
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) {
        console.error('ERROR: Canvas element not found!');
        return;
    }
    console.log('Canvas element found');
    
    console.log('Initializing WebGL renderer...');
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: false,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0304, 1.0); // Dark reddish background
    console.log('Renderer configured');

    // Create rounded star texture
    function createRoundStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create circular gradient for rounded stars - natural white/blue
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // White center
        gradient.addColorStop(0.2, 'rgba(240, 240, 255, 0.8)'); // Slightly blue-white
        gradient.addColorStop(0.5, 'rgba(220, 220, 255, 0.4)'); // Faint blue
        gradient.addColorStop(1, 'rgba(200, 200, 255, 0)'); // Fade to transparent
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        return new THREE.CanvasTexture(canvas);
    }

    // Enhanced starfield with rounded stars
    function createEnhancedStarfield() {
        console.log('Creating enhanced starfield...');
        const starTexture = createRoundStarTexture();
        
        // Layer 1: Distant small stars
        const distantStars = new THREE.BufferGeometry();
        const distantVertices = [];
        for (let i = 0; i < 3000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            distantVertices.push(x, y, z);
        }
        distantStars.setAttribute('position', new THREE.Float32BufferAttribute(distantVertices, 3));
        
        const distantStarMaterial = new THREE.PointsMaterial({
            color: 0xffffff, // Natural white
            size: 1.5,
            transparent: true,
            opacity: 0.7,
            map: starTexture,
            alphaTest: 0.1,
            sizeAttenuation: true
        });
        
        const distantStarField = new THREE.Points(distantStars, distantStarMaterial);
        scene.add(distantStarField);
        
        // Layer 2: Medium bright stars
        const mediumStars = new THREE.BufferGeometry();
        const mediumVertices = [];
        for (let i = 0; i < 1500; i++) {
            const x = (Math.random() - 0.5) * 1500;
            const y = (Math.random() - 0.5) * 1500;
            const z = (Math.random() - 0.5) * 1500;
            mediumVertices.push(x, y, z);
        }
        mediumStars.setAttribute('position', new THREE.Float32BufferAttribute(mediumVertices, 3));
        
        const mediumStarMaterial = new THREE.PointsMaterial({
            color: 0x87ceeb, // Natural blue-white (sky blue)
            size: 2.5,
            transparent: true,
            opacity: 0.8,
            map: starTexture,
            alphaTest: 0.1,
            sizeAttenuation: true
        });
        
        const mediumStarField = new THREE.Points(mediumStars, mediumStarMaterial);
        scene.add(mediumStarField);
        
        // Layer 3: Close bright stars
        const closeStars = new THREE.BufferGeometry();
        const closeVertices = [];
        for (let i = 0; i < 600; i++) {
            const x = (Math.random() - 0.5) * 1000;
            const y = (Math.random() - 0.5) * 1000;
            const z = (Math.random() - 0.5) * 1000;
            closeVertices.push(x, y, z);
        }
        closeStars.setAttribute('position', new THREE.Float32BufferAttribute(closeVertices, 3));
        
        const closeStarMaterial = new THREE.PointsMaterial({
            color: 0xffffff, // Bright white
            size: 4.0,
            transparent: true,
            opacity: 0.9,
            map: starTexture,
            alphaTest: 0.1,
            sizeAttenuation: true
        });
        
        const closeStarField = new THREE.Points(closeStars, closeStarMaterial);
        scene.add(closeStarField);
        
        return [distantStarField, mediumStarField, closeStarField];
    }

    // Create galaxy/nebula background
    function createGalaxyBackground() {
        console.log('Creating galaxy background...');
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');
        
        // Base natural space gradient
        const baseGradient = ctx.createLinearGradient(0, 0, 2048, 2048);
        baseGradient.addColorStop(0, '#1a1a2e'); // Dark blue
        baseGradient.addColorStop(0.3, '#0f0f1a'); // Very dark blue
        baseGradient.addColorStop(0.7, '#050508'); // Nearly black
        baseGradient.addColorStop(1, '#000000'); // Black
        
        ctx.fillStyle = baseGradient;
        ctx.fillRect(0, 0, 2048, 2048);
        
        // Add reddish nebulae
        const nebulae = [
            { x: 400, y: 400, radius: 350, color: '#cc4400' }, // Deep red-orange
            { x: 1600, y: 300, radius: 400, color: '#ff6622' }, // Bright orange
            { x: 300, y: 1500, radius: 320, color: '#aa3300' }, // Dark red
            { x: 1700, y: 1600, radius: 380, color: '#ff8844' }, // Light orange
            { x: 1000, y: 800, radius: 450, color: '#dd5511' }, // Medium orange
            { x: 800, y: 200, radius: 300, color: '#bb2200' }, // Deep red
            { x: 1200, y: 1400, radius: 360, color: '#ff7733' }, // Bright orange
            { x: 600, y: 1200, radius: 330, color: '#cc3300' }, // Red
            { x: 1400, y: 600, radius: 370, color: '#ff9955' }, // Yellow-orange
            { x: 200, y: 800, radius: 290, color: '#aa4400' }  // Brown-orange
        ];
        
        nebulae.forEach(nebula => {
            const nebulaGradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
            nebulaGradient.addColorStop(0, nebula.color + '40'); // More opaque center
            nebulaGradient.addColorStop(0.3, nebula.color + '25');
            nebulaGradient.addColorStop(0.7, nebula.color + '10');
            nebulaGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = nebulaGradient;
            ctx.fillRect(0, 0, 2048, 2048);
        });
        
        // Add three large prominent galaxies
        const largeGalaxies = [
            { x: 300, y: 300, radius: 200, intensity: 0.4 },
            { x: 1600, y: 800, radius: 250, intensity: 0.5 },
            { x: 800, y: 1500, radius: 220, intensity: 0.45 }
        ];
        
        largeGalaxies.forEach(galaxy => {
            const galaxyGradient = ctx.createRadialGradient(galaxy.x, galaxy.y, 0, galaxy.x, galaxy.y, galaxy.radius);
            galaxyGradient.addColorStop(0, `rgba(200, 220, 255, ${galaxy.intensity})`); // Bright blue-white center
            galaxyGradient.addColorStop(0.3, `rgba(180, 200, 255, ${galaxy.intensity * 0.6})`); // Medium glow
            galaxyGradient.addColorStop(0.7, `rgba(160, 180, 255, ${galaxy.intensity * 0.3})`); // Outer glow
            galaxyGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = galaxyGradient;
            ctx.fillRect(0, 0, 2048, 2048);
        });
        
        // Add some smaller scattered bright spots (distant galaxies)
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * 2048;
            const y = Math.random() * 2048;
            const radius = Math.random() * 60 + 30;
            
            const galaxyGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            galaxyGradient.addColorStop(0, 'rgba(200, 220, 255, 0.25)'); // Blue-white
            galaxyGradient.addColorStop(0.5, 'rgba(180, 200, 255, 0.12)'); // Faint blue
            galaxyGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = galaxyGradient;
            ctx.fillRect(0, 0, 2048, 2048);
        }
        
        const spaceTexture = new THREE.CanvasTexture(canvas);
        const spaceMaterial = new THREE.MeshBasicMaterial({
            map: spaceTexture,
            side: THREE.BackSide,
            transparent: false,
            opacity: 1.0
        });
        
        const spaceGeometry = new THREE.SphereGeometry(1500, 32, 32);
        const spaceBackground = new THREE.Mesh(spaceGeometry, spaceMaterial);
        spaceBackground.position.set(0, 0, 0);
        
        scene.add(spaceBackground);
        console.log('Galaxy background added');
        return spaceBackground;
    }

    // Create floating asteroids
    function createAsteroids() {
        console.log('Creating asteroids...');
        const asteroids = [];
        const asteroidGroup = new THREE.Group();
        
        for (let i = 0; i < 20; i++) {
            const asteroidGeometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 0.5, 0);
            const asteroidMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0.1, 0.3, 0.2 + Math.random() * 0.4), // Natural brown-gray tones
                transparent: true,
                opacity: 0.7
            });
            
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            
            asteroid.position.set(
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 600
            );
            
            asteroid.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            asteroid.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.001 + 0.0005
            };
            
            asteroidGroup.add(asteroid);
            asteroids.push(asteroid);
        }
        
        scene.add(asteroidGroup);
        console.log('Asteroids added');
        return asteroids;
    }

    // Add some lighting for the asteroids - natural lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Neutral gray ambient
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // White directional
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create all elements
    const starFields = createEnhancedStarfield();
    const galaxyBg = createGalaxyBackground();
    const asteroids = createAsteroids();

    // Position camera
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    console.log('Camera positioned');

    // Enhanced Animation Loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Rotate the star fields at different speeds
        starFields.forEach((starField, index) => {
            starField.rotation.y += 0.0003 * (index + 1);
            starField.rotation.x += 0.0001 * (index + 1);
        });
        
        // Rotate galaxy background slowly
        if (galaxyBg) {
            galaxyBg.rotation.y += 0.0002;
            galaxyBg.rotation.x += 0.0001;
        }
        
        // Animate asteroids
        asteroids.forEach((asteroid) => {
            asteroid.rotation.x += asteroid.userData.rotationSpeed.x;
            asteroid.rotation.y += asteroid.userData.rotationSpeed.y;
            asteroid.rotation.z += asteroid.userData.rotationSpeed.z;
            
            // Gentle floating motion
            asteroid.position.y += Math.sin(time * asteroid.userData.floatSpeed) * 0.05;
        });
        
        // Subtle camera movement
        camera.position.x = Math.sin(time * 0.05) * 0.5;
        camera.position.y = Math.cos(time * 0.03) * 0.3;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }

    animate();
    console.log('Animation loop started');

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log('Renderer resized');
    });
    
    // Mouse Movement for Parallax Effect
    window.mouseX = 0;
    window.mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        window.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        window.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });
    
    // Enhanced Form Submission Handler with Database Integration
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = '🚀 Sending...';
            submitBtn.classList.add('opacity-75');
            
            try {
                // Get form data
                const formData = new FormData(contactForm);
                const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
                const email = formData.get('email') || contactForm.querySelector('input[type="email"]').value;
                const message = formData.get('message') || contactForm.querySelector('textarea').value;
                
                // Client-side validation
                if (!name || !email || !message) {
                    throw new Error('Please fill in all fields.');
                }
                
                if (name.length < 2 || name.length > 100) {
                    throw new Error('Name must be between 2 and 100 characters.');
                }
                
                if (message.length < 10 || message.length > 1000) {
                    throw new Error('Message must be between 10 and 1000 characters.');
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error('Please enter a valid email address.');
                }
                
                // Send to backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        message: message.trim()
                    })
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.errors ? result.errors.join(', ') : result.error || 'Failed to send message');
                }
                
                // Success animation
                submitBtn.textContent = '✅ Sent!';
                submitBtn.classList.remove('opacity-75');
                submitBtn.classList.add('bg-green-600');
                
                // Show success message
                showNotification(result.message || 'Thank you for your message! I\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.classList.remove('bg-green-600');
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Contact form error:', error);
                
                // Error state
                submitBtn.textContent = '❌ Error';
                submitBtn.classList.remove('opacity-75');
                submitBtn.classList.add('bg-red-600');
                
                // Show error message
                showNotification(error.message || 'Failed to send message. Please try again.', 'error');
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.classList.remove('bg-red-600');
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full z-50 max-w-md`;
        
        // Style based on type
        if (type === 'success') {
            notification.classList.add('bg-green-600', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-600', 'text-white');
        } else {
            notification.classList.add('bg-blue-600', 'text-white');
        }
        
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <span class="mr-2">
                        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <span>${message}</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    ✕
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // Add floating animation to hero buttons
    gsap.to('#hero .btn-primary', {
        y: -10,
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
    });
    
    gsap.to('#hero .btn-secondary', {
        y: -8,
        duration: 2.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.5
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const scrollProgress = Math.min(scrolled / (document.documentElement.scrollHeight - window.innerHeight), 1);
        
        if (scrolled > 100) {
            const opacity = 0.95 + (scrollProgress * 0.05);
            navbar.style.background = `rgba(15, 23, 42, ${opacity})`;
            navbar.style.backdropFilter = `blur(${20 + scrollProgress * 10}px)`;
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Add universe expansion sound effect (optional)
    function playBigBangSound() {
        // Create audio context for cosmic sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create a cosmic whoosh sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Start high and sweep down (like a cosmic expansion)
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 2);
            
            // Fade in and out
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            
            oscillator.type = 'sine';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 2);
        } catch (e) {
            // Silently fail if audio context not supported
            console.log('Audio context not supported');
        }
    }
    
    // Trigger Big Bang sound on load (user gesture required for audio)
    document.addEventListener('click', () => {
        if (!window.bigBangSoundPlayed) {
            playBigBangSound();
            window.bigBangSoundPlayed = true;
        }
    }, { once: true });
    
    // Handle form submissions
    const formSubmitContactForm = document.getElementById('contactForm');
    if (formSubmitContactForm) {
        formSubmitContactForm.addEventListener('submit', function(event) {
            // Don't prevent default form submission - let the native action work for production
            // This is just to provide better feedback when testing locally
            
            const submitBtn = formSubmitContactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Check if we're in a local environment
            const isLocal = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' || 
                           window.location.protocol === 'file:';
                           
            if (isLocal) {
                event.preventDefault(); // Only prevent default on local
                
                // Show processing state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
                submitBtn.disabled = true;
                
                // Simulate submission locally
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Message Sent!';
                    submitBtn.classList.add('bg-green-600');
                    
                    // Show local test message
                    alert('Local Testing Mode: In production, your message will be sent via FormSubmit to your email address. The form has been configured correctly.');
                    
                    // Reset form
                    formSubmitContactForm.reset();
                    
                    // Restore button after delay
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('bg-green-600');
                    }, 3000);
                }, 1500);
            }
        });
    }
});