/**
 * White Goose - Emotional Core State Machine (3D Version)
 * 
 * States:
 * - IDLE: Baseline presence, calm breathing
 * - FLEX: Confidence/achievement acknowledgment
 * - JUDGMENT: Silent accountability stare
 * - BEATEN: Low state reflecting failure/neglect
 */

class WhiteGoose {
    constructor() {
        this.container = document.getElementById('goose-3d-container');
        this.currentState = 'idle';
        this.stateHistory = [];
        this.transitionTimer = null;
        this.decayTimer = null;
        
        // 3D Scene setup
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.gooseModel = null;
        this.mixer = null; // For animations
        this.clock = new THREE.Clock();
        
        // Rotation controls
        this.rotationY = 0;
        this.targetRotationY = 0;
        this.isDragging = false;
        this.lastTouchX = 0;
        this.rotationSpeed = 0.05;
        
        // Personality scale: -100 (cold) to +100 (warm)
        this.personality = 0;
        this.personalityDecayRate = 0.5;
        
        // State timing configuration
        this.config = {
            idle: { duration: Infinity },
            flex: { duration: 1500, cooldown: 5000 },
            judgment: { duration: 3000, cooldown: 8000 },
            beaten: { minDuration: 4000, recoveryTime: 6000 }
        };
        
        this.lastStateChange = Date.now();
        
        // Initialize 3D scene
        this.init3D();
        
        // Start personality decay timer
        this.startPersonalityDecay();
        
        // Setup keyboard controls
        this.setupKeyboardControls();
        
        // Setup touch/swipe controls
        this.setupTouchControls();
        
        // Update UI
        this.updateUI();
        
        // Start render loop
        this.animate();
    }
    
    /**
     * Initialize Three.js scene
     */
    init3D() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xB3E5FC); // Baby blue
        
        // Camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.set(0, 1.5, 4);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Load 3D model
        this.loadModel();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    /**
     * Load 3D model from Sketchfab or fallback
     */
    loadModel() {
        // Wait for GLTFLoader to be available
        if (typeof THREE === 'undefined' || !THREE.GLTFLoader) {
            console.warn('GLTFLoader not available, using placeholder');
            this.createPlaceholderGoose();
            return;
        }
        
        const loader = new THREE.GLTFLoader();
        
        // Try to load from Sketchfab API or use a placeholder
        // For now, we'll create a simple white goose geometry as fallback
        // In production, you'd load the actual GLTF model
        
        // Create a simple goose shape as placeholder
        this.createPlaceholderGoose();
        
        // If you have the GLTF file, uncomment this:
        /*
        loader.load(
            'path/to/goose-model.gltf',
            (gltf) => {
                this.gooseModel = gltf.scene;
                this.gooseModel.scale.set(1, 1, 1);
                this.gooseModel.position.set(0, 0, 0);
                
                // Remove knife if it exists
                this.gooseModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        // Hide knife if name contains "knife"
                        if (child.name && child.name.toLowerCase().includes('knife')) {
                            child.visible = false;
                        }
                    }
                });
                
                this.scene.add(this.gooseModel);
                
                // Setup animations if available
                if (gltf.animations && gltf.animations.length) {
                    this.mixer = new THREE.AnimationMixer(this.gooseModel);
                    gltf.animations.forEach((clip) => {
                        this.mixer.clipAction(clip).play();
                    });
                }
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
                this.createPlaceholderGoose();
            }
        );
        */
    }
    
    /**
     * Create placeholder goose geometry
     */
    createPlaceholderGoose() {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.6, 32, 32);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0.3, 0);
        body.castShadow = true;
        group.add(body);
        
        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1.2, 16);
        const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
        neck.position.set(0, 1.1, -0.2);
        neck.rotation.x = -0.3;
        neck.castShadow = true;
        group.add(neck);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 1.8, -0.3);
        head.castShadow = true;
        group.add(head);
        
        // Beak
        const beakGeometry = new THREE.ConeGeometry(0.08, 0.3, 8);
        const beakMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
        const beak = new THREE.Mesh(beakGeometry, beakMaterial);
        beak.position.set(0, 1.8, -0.5);
        beak.rotation.x = Math.PI;
        beak.castShadow = true;
        group.add(beak);
        
        // Wing
        const wingGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const wing = new THREE.Mesh(wingGeometry, bodyMaterial);
        wing.position.set(0.5, 0.5, 0);
        wing.scale.set(1, 0.3, 0.8);
        wing.rotation.z = 0.3;
        wing.castShadow = true;
        group.add(wing);
        
        // Eye
        const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eye.position.set(0.1, 1.85, -0.45);
        group.add(eye);
        
        this.gooseModel = group;
        this.scene.add(this.gooseModel);
        
        // Store references for animations
        this.bodyPart = body;
        this.neckPart = neck;
        this.headPart = head;
        this.wingPart = wing;
    }
    
    /**
     * Setup touch/swipe controls
     */
    setupTouchControls() {
        const container = this.renderer.domElement;
        let touchStartX = 0;
        let touchStartY = 0;
        let isTouching = false;
        
        // Touch start
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isTouching = true;
            this.isDragging = true;
            
            // Hide swipe hint
            const hint = document.getElementById('swipe-hint');
            if (hint) {
                hint.style.opacity = '0';
            }
        }, { passive: false });
        
        // Touch move
        container.addEventListener('touchmove', (e) => {
            if (!isTouching) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            
            // Rotate based on horizontal swipe
            this.targetRotationY += deltaX * 0.01;
            
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: false });
        
        // Touch end
        container.addEventListener('touchend', (e) => {
            e.preventDefault();
            isTouching = false;
            this.isDragging = false;
        }, { passive: false });
        
        // Mouse controls (for desktop)
        container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastTouchX = e.clientX;
            
            const hint = document.getElementById('swipe-hint');
            if (hint) {
                hint.style.opacity = '0';
            }
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - this.lastTouchX;
            this.targetRotationY += deltaX * 0.01;
            this.lastTouchX = e.clientX;
        });
        
        container.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        container.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update mixer if animations exist
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Smooth rotation
        this.rotationY += (this.targetRotationY - this.rotationY) * 0.1;
        
        if (this.gooseModel) {
            this.gooseModel.rotation.y = this.rotationY;
            
            // Apply state-based animations
            this.applyStateAnimations(delta);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Apply state-based animations to 3D model
     */
    applyStateAnimations(delta) {
        if (!this.gooseModel) return;
        
        const time = this.clock.getElapsedTime();
        
        switch (this.currentState) {
            case 'idle':
                // Slow breathing animation
                if (this.bodyPart) {
                    const breathScale = 1 + Math.sin(time * 0.4) * 0.02;
                    this.bodyPart.scale.y = breathScale;
                }
                if (this.neckPart) {
                    const neckBreath = 1 + Math.sin(time * 0.4) * 0.01;
                    this.neckPart.scale.y = neckBreath;
                }
                break;
                
            case 'flex':
                // Posture straightening
                if (this.gooseModel) {
                    const flexProgress = Math.min(1, (Date.now() - this.lastStateChange) / 1200);
                    const lift = Math.sin(flexProgress * Math.PI) * 0.2;
                    this.gooseModel.position.y = lift;
                    
                    if (this.headPart) {
                        this.headPart.rotation.x = -Math.sin(flexProgress * Math.PI) * 0.1;
                    }
                }
                break;
                
            case 'judgment':
                // Stillness with slight head turn
                if (this.headPart) {
                    const judgmentProgress = Math.min(1, (Date.now() - this.lastStateChange) / 2000);
                    this.headPart.rotation.y = Math.sin(judgmentProgress * Math.PI) * 0.2;
                }
                break;
                
            case 'beaten':
                // Heavy breathing and sway
                if (this.bodyPart) {
                    const heavyBreath = 1 + Math.sin(time * 1.5) * 0.05;
                    this.bodyPart.scale.y = heavyBreath;
                }
                if (this.gooseModel) {
                    const sway = Math.sin(time * 0.8) * 0.05;
                    this.gooseModel.rotation.z = sway;
                    this.gooseModel.position.y = -0.1 + Math.sin(time * 1.2) * 0.05;
                }
                if (this.headPart) {
                    this.headPart.rotation.x = 0.2 + Math.sin(time * 1.0) * 0.1;
                }
                break;
        }
    }
    
    /**
     * Change the goose's emotional state
     */
    setState(newState, options = {}) {
        if (this.currentState === newState && !options.force) {
            return;
        }
        
        if (this.transitionTimer) {
            clearTimeout(this.transitionTimer);
            this.transitionTimer = null;
        }
        
        // Reset model position/rotation for state transitions
        if (this.gooseModel && this.currentState !== newState) {
            // Reset any state-specific transforms
            if (this.bodyPart) {
                this.bodyPart.scale.set(1, 1, 1);
            }
            if (this.gooseModel) {
                this.gooseModel.position.set(0, 0, 0);
                this.gooseModel.rotation.set(0, this.rotationY, 0);
            }
        }
        
        this.stateHistory.push({
            state: newState,
            timestamp: Date.now(),
            previous: this.currentState
        });
        
        if (this.stateHistory.length > 10) {
            this.stateHistory.shift();
        }
        
        this.currentState = newState;
        this.lastStateChange = Date.now();
        
        this.updatePersonality(newState);
        this.handleStateTiming(newState, options);
        this.updateUI();
        
        console.log(`🪿 Goose state: ${this.currentState} | Personality: ${this.personality.toFixed(1)}`);
    }
    
    /**
     * Handle timing and automatic transitions
     */
    handleStateTiming(state, options) {
        const config = this.config[state];
        
        switch (state) {
            case 'flex':
                this.transitionTimer = setTimeout(() => {
                    this.setState('idle');
                }, config.duration);
                break;
                
            case 'judgment':
                this.transitionTimer = setTimeout(() => {
                    this.setState('idle');
                }, config.duration);
                break;
                
            case 'beaten':
                this.transitionTimer = setTimeout(() => {
                    this.recoverFromBeaten();
                }, config.minDuration);
                break;
        }
    }
    
    /**
     * Gradually recover from beaten state
     */
    recoverFromBeaten() {
        this.setState('idle');
    }
    
    /**
     * Update personality based on state
     */
    updatePersonality(state) {
        const personalityChanges = {
            'flex': 5,
            'judgment': -3,
            'beaten': -8,
            'idle': 0
        };
        
        this.personality += personalityChanges[state] || 0;
        this.personality = Math.max(-100, Math.min(100, this.personality));
    }
    
    /**
     * Start personality decay
     */
    startPersonalityDecay() {
        setInterval(() => {
            if (this.personality !== 0) {
                const decay = this.personalityDecayRate / 60;
                const direction = this.personality > 0 ? -1 : 1;
                this.personality += decay * direction;
                
                if (Math.abs(this.personality) < 0.1) {
                    this.personality = 0;
                }
                
                this.updateUI();
            }
        }, 1000);
    }
    
    /**
     * Get personality description
     */
    getPersonalityDescription() {
        if (this.personality > 30) return 'warm';
        if (this.personality > 10) return 'friendly';
        if (this.personality > -10) return 'neutral';
        if (this.personality > -30) return 'distant';
        return 'cold';
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        const stateDisplay = document.getElementById('state-display');
        const personalityDisplay = document.getElementById('personality-display');
        
        if (stateDisplay) {
            stateDisplay.textContent = this.currentState;
        }
        
        if (personalityDisplay) {
            personalityDisplay.textContent = this.getPersonalityDescription();
        }
        
        this.applyPersonalityEffects();
    }
    
    /**
     * Apply personality-based visual effects
     */
    applyPersonalityEffects() {
        if (!this.scene) return;
        
        const brightness = 1 + (this.personality / 1000);
        
        // Adjust ambient light based on personality
        this.scene.children.forEach((child) => {
            if (child instanceof THREE.AmbientLight) {
                child.intensity = 0.8 + (this.personality / 500);
            }
        });
    }
    
    /**
     * Setup keyboard controls
     */
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
                const controls = document.getElementById('controls');
                if (controls) {
                    controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
                }
            }
            
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'f':
                        e.preventDefault();
                        this.flex();
                        break;
                    case 'j':
                        e.preventDefault();
                        this.judge();
                        break;
                    case 'b':
                        e.preventDefault();
                        this.beat();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.idle();
                        break;
                }
            }
        });
    }
    
    /**
     * Public API methods
     */
    flex() {
        if (this.currentState === 'flex') return;
        this.setState('flex');
    }
    
    judge() {
        if (this.currentState === 'judgment') return;
        this.setState('judgment');
    }
    
    beat() {
        this.setState('beaten');
    }
    
    idle() {
        this.setState('idle', { force: true });
    }
    
    getState() {
        return this.currentState;
    }
    
    getHistory() {
        return [...this.stateHistory];
    }
    
    getPersonality() {
        return this.personality;
    }
    
    runDemo() {
        let demoIndex = 0;
        const demoSequence = [
            { state: 'idle', delay: 3000 },
            { state: 'flex', delay: 2000 },
            { state: 'idle', delay: 3000 },
            { state: 'judgment', delay: 4000 },
            { state: 'idle', delay: 3000 },
            { state: 'beaten', delay: 6000 },
            { state: 'idle', delay: 3000 }
        ];
        
        const run = () => {
            if (demoIndex < demoSequence.length) {
                const step = demoSequence[demoIndex];
                setTimeout(() => {
                    this.setState(step.state);
                    demoIndex++;
                    if (demoIndex < demoSequence.length) {
                        run();
                    }
                }, step.delay);
            }
        };
        
        run();
    }
}

// Initialize when DOM is ready
let goose;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        goose = new WhiteGoose();
        window.goose = goose;
    });
} else {
    goose = new WhiteGoose();
    window.goose = goose;
}
