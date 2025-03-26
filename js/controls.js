class Controls {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.touchControls = {
            left: false,
            right: false,
            jump: false
        };
        
        // Mobile detection
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Initialize controls
        this.setupKeyboardControls();
        
        // Add touch controls if on mobile
        if (this.isMobile) {
            this.setupTouchControls();
        } else {
            // Add mouse controls for desktop
            this.setupMouseControls();
        }
    }
    
    setupKeyboardControls() {
        // Key down event
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent default action for arrow keys and space to avoid scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            
            // Pause game on Escape key
            if (e.code === 'Escape' && this.game.state.current === 'playing') {
                this.game.pauseGame();
            } else if (e.code === 'Escape' && this.game.state.current === 'paused') {
                this.game.resumeGame();
            }
        });
        
        // Key up event
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            
            // Handle jump release for variable jump height
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.game.player.releaseJump();
            }
        });
    }
    
    setupTouchControls() {
        // Create mobile control elements if they don't exist
        if (!document.getElementById('mobile-controls')) {
            const controlsContainer = document.createElement('div');
            controlsContainer.id = 'mobile-controls';
            
            // Left button
            const leftBtn = document.createElement('div');
            leftBtn.className = 'control-btn';
            leftBtn.id = 'control-left';
            leftBtn.innerHTML = '◀';
            
            // Right button
            const rightBtn = document.createElement('div');
            rightBtn.className = 'control-btn';
            rightBtn.id = 'control-right';
            rightBtn.innerHTML = '▶';
            
            // Jump button
            const jumpBtn = document.createElement('div');
            jumpBtn.className = 'control-btn';
            jumpBtn.id = 'control-jump';
            jumpBtn.innerHTML = '▲';
            
            // Add buttons to container
            controlsContainer.appendChild(leftBtn);
            controlsContainer.appendChild(jumpBtn);
            controlsContainer.appendChild(rightBtn);
            
            // Add container to game
            document.getElementById('game-container').appendChild(controlsContainer);
            
            // Add touch event listeners
            this.setupTouchEvents();
        }
    }
    
    setupTouchEvents() {
        // Left button
        const leftBtn = document.getElementById('control-left');
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.left = true;
        });
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.left = false;
        });
        
        // Right button
        const rightBtn = document.getElementById('control-right');
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.right = true;
        });
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.right = false;
        });
        
        // Jump button
        const jumpBtn = document.getElementById('control-jump');
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.jump = true;
        });
        jumpBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.jump = false;
            this.game.player.releaseJump();
        });
        
        // Add swipe up for jump on the game canvas
        const canvas = this.game.canvas;
        let touchStartY = 0;
        
        canvas.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        canvas.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const diff = touchStartY - touchY;
            
            // If swiped up by more than 30px, trigger jump
            if (diff > 30) {
                this.touchControls.jump = true;
                touchStartY = touchY; // Reset to prevent multiple jumps
            }
        });
        
        canvas.addEventListener('touchend', () => {
            this.game.player.releaseJump();
        });
    }
    
    setupMouseControls() {
        // Add click event for jump
        this.game.canvas.addEventListener('mousedown', (e) => {
            // Left click for jump
            if (e.button === 0) {
                this.keys['Space'] = true;
            }
        });
        
        this.game.canvas.addEventListener('mouseup', (e) => {
            // Left click release
            if (e.button === 0) {
                this.keys['Space'] = false;
                this.game.player.releaseJump();
            }
        });
        
        // Add mouse movement for left/right control
        this.game.canvas.addEventListener('mousemove', (e) => {
            // Get canvas center
            const canvasRect = this.game.canvas.getBoundingClientRect();
            const canvasCenterX = canvasRect.left + canvasRect.width / 2;
            
            // Determine movement based on mouse position relative to center
            const mouseX = e.clientX;
            const deadZone = 50; // Center dead zone where no movement occurs
            
            if (mouseX < canvasCenterX - deadZone) {
                this.keys['ArrowLeft'] = true;
                this.keys['ArrowRight'] = false;
            } else if (mouseX > canvasCenterX + deadZone) {
                this.keys['ArrowLeft'] = false;
                this.keys['ArrowRight'] = true;
            } else {
                this.keys['ArrowLeft'] = false;
                this.keys['ArrowRight'] = false;
            }
        });
        
        // Clear movement when mouse leaves canvas
        this.game.canvas.addEventListener('mouseleave', () => {
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
        });
    }
    
    update() {
        // Only process controls when in playing state
        if (this.game.state.current !== 'playing') {
            return;
        }
        
        const player = this.game.player;
        
        // Process keyboard input
        // Left movement
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            player.moveLeft();
        }
        
        // Right movement
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            player.moveRight();
        }
        
        // Jump
        if ((this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['Space']) && !player.jumpPressed) {
            player.jump();
        }
        
        // Process touch controls for mobile
        if (this.isMobile) {
            if (this.touchControls.left) {
                player.moveLeft();
            }
            
            if (this.touchControls.right) {
                player.moveRight();
            }
            
            if (this.touchControls.jump && !player.jumpPressed) {
                player.jump();
            }
        }
    }
} 