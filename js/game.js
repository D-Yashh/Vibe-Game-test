class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;
        this.accumulator = 0;
        this.deltaTime = 1/60; // Target: 60 FPS
        
        this.state = {
            current: 'menu', // menu, playing, gameOver, levelComplete
            score: 0,
            lives: 10,
            currentLevel: 0,
            levelTime: 0,
            startTime: 0
        };

        // Game dimensions
        this.width = 800;
        this.height = 600;
        
        // Debug mode
        this.debugMode = false;
        
        // Initialize components
        this.ui = new UI(this);
        this.physics = new Physics();
        this.player = new Player(this);
        this.levels = new Levels(this);
        this.controls = new Controls(this);
        this.renderer = new Renderer(this);
        this.audio = new Audio(this);
        
        // Initialize the game
        this.init();
    }
    
    init() {
        // Set canvas dimensions
        this.resizeCanvas();
        
        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Start the game loop
        this.gameLoop(0);
        
        // Load first level data
        this.loadLevel(0);
        
        console.log('Game initialized');
    }
    
    resizeCanvas() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Update game dimensions based on canvas
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Scale game elements if needed
        this.renderer.calculateScale();
    }
    
    gameLoop(timestamp) {
        // Calculate delta time
        if (!this.lastTime) this.lastTime = timestamp;
        const frameTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // Avoid spiral of death with maximum frame time
        const maxFrameTime = 0.25;
        const clampedFrameTime = Math.min(frameTime, maxFrameTime);
        
        // Accumulate time since last frame
        this.accumulator += clampedFrameTime;
        
        // Update game at fixed time steps for consistent physics
        while (this.accumulator >= this.deltaTime) {
            this.update();
            this.accumulator -= this.deltaTime;
        }
        
        // Render the game
        this.render();
        
        // Continue the game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        // Update game based on current state
        if (this.state.current === 'playing') {
            // Update controls - process user input
            this.controls.update();
            
            // Update moving platforms
            this.levels.updateLevel();
            
            // Update level timer
            this.state.levelTime = (Date.now() - this.state.startTime) / 1000;
            
            // Update player
            this.player.update();
            
            // Check collisions
            this.physics.checkCollisions(this.player, this.levels.getCurrentLevel());
            
            // Check win condition
            if (this.player.position.x >= this.levels.getCurrentLevel().goal.x &&
                this.player.position.y >= this.levels.getCurrentLevel().goal.y &&
                this.player.position.y <= this.levels.getCurrentLevel().goal.y + this.levels.getCurrentLevel().goal.height) {
                this.completeLevel();
            }
            
            // Check if player fell out of the level
            if (this.player.position.y > this.height) {
                this.loseLife();
            }
        }
    }
    
    render() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Render based on game state
        if (this.state.current === 'playing') {
            // Render level
            this.renderer.renderLevel(this.levels.getCurrentLevel());
            
            // Render player
            this.player.render(this.ctx);
            
            // Render UI elements
            this.ui.updateHUD();
        }
    }
    
    startGame() {
        this.state.current = 'playing';
        this.state.score = 0;
        this.state.lives = 10;
        this.state.currentLevel = 0;
        this.loadLevel(0);
        
        // Show game UI
        this.ui.showGameUI();
        
        console.log('Game started');
    }
    
    loadLevel(levelIndex) {
        this.state.currentLevel = levelIndex;
        this.levels.loadLevel(levelIndex);
        
        // Reset player position
        const level = this.levels.getCurrentLevel();
        this.player.reset(level.playerStart.x, level.playerStart.y);
        
        // Reset level timer
        this.state.startTime = Date.now();
        this.state.levelTime = 0;
        
        console.log(`Loaded level ${levelIndex + 1}`);
    }
    
    loseLife() {
        this.state.lives--;
        this.audio.playSound('death');
        
        if (this.state.lives <= 0) {
            this.gameOver();
        } else {
            const level = this.levels.getCurrentLevel();
            this.player.reset(level.playerStart.x, level.playerStart.y);
        }
    }
    
    collectCoin(coin) {
        this.state.score += coin.value;
        this.audio.playSound('coin');
        
        // Update UI
        this.ui.updateScore();
        
        console.log(`Coin collected! Score: ${this.state.score}`);
    }
    
    completeLevel() {
        this.audio.playSound('levelComplete');
        
        if (this.state.currentLevel >= this.levels.getLevelCount() - 1) {
            // Game completed
            this.state.current = 'gameCompleted';
            this.ui.showGameCompleted();
        } else {
            // Next level
            this.state.current = 'levelComplete';
            this.ui.showLevelComplete();
        }
    }
    
    nextLevel() {
        if (this.state.currentLevel < this.levels.getLevelCount() - 1) {
            this.loadLevel(this.state.currentLevel + 1);
            this.state.current = 'playing';
        }
    }
    
    gameOver() {
        this.state.current = 'gameOver';
        this.audio.playSound('gameOver');
        this.ui.showGameOver();
        
        console.log('Game Over');
    }
    
    restartGame() {
        this.startGame();
    }
    
    pauseGame() {
        if (this.state.current === 'playing') {
            this.state.current = 'paused';
            this.ui.showPauseScreen();
        }
    }
    
    resumeGame() {
        if (this.state.current === 'paused') {
            this.state.current = 'playing';
            this.ui.hidePauseScreen();
            // Reset the start time to account for pause duration
            this.state.startTime = Date.now() - (this.state.levelTime * 1000);
        }
    }
    
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        
        if (this.debugMode) {
            this.ui.showDebugInfo();
        } else {
            this.ui.hideDebugInfo();
        }
        
        return this.debugMode;
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
}); 