class UI {
    constructor(game) {
        this.game = game;
        
        // UI elements
        this.mainMenu = document.getElementById('main-menu');
        this.instructionsScreen = document.getElementById('instructions-screen');
        this.settingsScreen = document.getElementById('settings-screen');
        this.gameUI = document.getElementById('game-ui');
        this.levelCompleteScreen = document.getElementById('level-complete');
        this.gameOverScreen = document.getElementById('game-over');
        
        // UI elements for scores and stats
        this.scoreValue = document.getElementById('score-value');
        this.livesValue = document.getElementById('lives-value');
        this.levelValue = document.getElementById('level-value');
        this.timerValue = document.getElementById('timer-value');
        
        // Final score elements
        this.finalScoreElements = document.querySelectorAll('.final-score');
        this.finalTimeElements = document.querySelectorAll('.final-time');
        
        // Initialize UI
        this.init();
    }
    
    init() {
        // Add event listeners to UI elements
        this.addEventListeners();
        
        // Show main menu
        this.showMainMenu();
    }
    
    addEventListeners() {
        // Main menu buttons
        document.getElementById('play-button').addEventListener('click', () => {
            this.game.startGame();
            
            // Resume audio context on user interaction
            this.game.audio.resumeAudio();
            this.game.audio.startMusic();
        });
        
        document.getElementById('instructions-button').addEventListener('click', () => {
            this.showInstructions();
        });
        
        document.getElementById('settings-button').addEventListener('click', () => {
            this.showSettings();
        });
        
        // Back buttons
        const backButtons = document.querySelectorAll('.back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.showMainMenu();
            });
        });
        
        // Level complete screen
        document.getElementById('next-level-button').addEventListener('click', () => {
            this.hideAllScreens();
            this.game.nextLevel();
        });
        
        // Game over screen
        document.getElementById('restart-button').addEventListener('click', () => {
            this.hideAllScreens();
            this.game.restartGame();
        });
        
        document.getElementById('main-menu-button').addEventListener('click', () => {
            this.hideAllScreens();
            this.showMainMenu();
            this.game.state.current = 'menu';
        });
        
        // Sound toggle in settings
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            const soundEnabled = e.target.checked;
            
            if (soundEnabled) {
                this.game.audio.soundEnabled = true;
                this.game.audio.resumeAudio();
            } else {
                this.game.audio.soundEnabled = false;
                this.game.audio.stopMusic();
            }
        });
    }
    
    // Screen management
    hideAllScreens() {
        this.mainMenu.classList.add('hidden');
        this.instructionsScreen.classList.add('hidden');
        this.settingsScreen.classList.add('hidden');
        this.gameUI.classList.add('hidden');
        this.levelCompleteScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
    }
    
    showMainMenu() {
        this.hideAllScreens();
        this.mainMenu.classList.remove('hidden');
    }
    
    showInstructions() {
        this.hideAllScreens();
        this.instructionsScreen.classList.remove('hidden');
    }
    
    showSettings() {
        this.hideAllScreens();
        this.settingsScreen.classList.remove('hidden');
    }
    
    showGameUI() {
        this.hideAllScreens();
        this.gameUI.classList.remove('hidden');
        this.updateHUD();
    }
    
    showLevelComplete() {
        this.hideAllScreens();
        
        // Update final score and time
        this.updateFinalStats();
        
        this.levelCompleteScreen.classList.remove('hidden');
    }
    
    showGameOver() {
        this.hideAllScreens();
        
        // Update final score
        this.updateFinalStats();
        
        this.gameOverScreen.classList.remove('hidden');
    }
    
    showPauseScreen() {
        // Create pause screen if it doesn't exist
        if (!document.getElementById('pause-screen')) {
            const pauseScreen = document.createElement('div');
            pauseScreen.id = 'pause-screen';
            pauseScreen.className = 'screen';
            
            pauseScreen.innerHTML = `
                <h2>Game Paused</h2>
                <button id="resume-button">Resume</button>
                <button id="pause-main-menu-button">Main Menu</button>
            `;
            
            document.getElementById('game-container').appendChild(pauseScreen);
            
            // Add event listeners
            document.getElementById('resume-button').addEventListener('click', () => {
                this.game.resumeGame();
            });
            
            document.getElementById('pause-main-menu-button').addEventListener('click', () => {
                this.hidePauseScreen();
                this.showMainMenu();
                this.game.state.current = 'menu';
            });
        } else {
            document.getElementById('pause-screen').classList.remove('hidden');
        }
    }
    
    hidePauseScreen() {
        const pauseScreen = document.getElementById('pause-screen');
        if (pauseScreen) {
            pauseScreen.classList.add('hidden');
        }
    }
    
    showGameCompleted() {
        this.hideAllScreens();
        
        // Create game completed screen if it doesn't exist
        if (!document.getElementById('game-completed-screen')) {
            const completedScreen = document.createElement('div');
            completedScreen.id = 'game-completed-screen';
            completedScreen.className = 'screen';
            
            completedScreen.innerHTML = `
                <h2>Congratulations!</h2>
                <h3>You completed all levels!</h3>
                <div>Final Score: <span class="final-score"></span></div>
                <button id="play-again-button">Play Again</button>
                <button id="completed-main-menu-button">Main Menu</button>
            `;
            
            document.getElementById('game-container').appendChild(completedScreen);
            
            // Update final score
            completedScreen.querySelector('.final-score').textContent = this.game.state.score;
            
            // Add event listeners
            document.getElementById('play-again-button').addEventListener('click', () => {
                document.getElementById('game-completed-screen').classList.add('hidden');
                this.game.restartGame();
            });
            
            document.getElementById('completed-main-menu-button').addEventListener('click', () => {
                document.getElementById('game-completed-screen').classList.add('hidden');
                this.showMainMenu();
                this.game.state.current = 'menu';
            });
        } else {
            const completedScreen = document.getElementById('game-completed-screen');
            completedScreen.querySelector('.final-score').textContent = this.game.state.score;
            completedScreen.classList.remove('hidden');
        }
    }
    
    // HUD updates
    updateHUD() {
        // Update score
        this.updateScore();
        
        // Update lives
        this.updateLives();
        
        // Update level
        this.updateLevel();
        
        // Update timer
        this.updateTimer();
    }
    
    updateScore() {
        if (this.scoreValue) {
            this.scoreValue.textContent = this.game.state.score;
        }
    }
    
    updateLives() {
        if (this.livesValue) {
            this.livesValue.textContent = this.game.state.lives;
        }
    }
    
    updateLevel() {
        if (this.levelValue) {
            this.levelValue.textContent = this.game.state.currentLevel + 1;
        }
    }
    
    updateTimer() {
        if (this.timerValue) {
            this.timerValue.textContent = this.game.state.levelTime.toFixed(1);
        }
    }
    
    updateFinalStats() {
        // Update all final score elements
        this.finalScoreElements.forEach(element => {
            element.textContent = this.game.state.score;
        });
        
        // Update all final time elements
        this.finalTimeElements.forEach(element => {
            element.textContent = this.game.state.levelTime.toFixed(1) + 's';
        });
    }
    
    // Debugging UI
    showDebugInfo() {
        // Create debug info panel if it doesn't exist
        if (!document.getElementById('debug-panel')) {
            const debugPanel = document.createElement('div');
            debugPanel.id = 'debug-panel';
            debugPanel.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; font-family: monospace; z-index: 100; font-size: 12px;';
            
            debugPanel.innerHTML = `
                <div>FPS: <span id="debug-fps">0</span></div>
                <div>Player X: <span id="debug-player-x">0</span></div>
                <div>Player Y: <span id="debug-player-y">0</span></div>
                <div>Velocity X: <span id="debug-velocity-x">0</span></div>
                <div>Velocity Y: <span id="debug-velocity-y">0</span></div>
                <div>Grounded: <span id="debug-grounded">false</span></div>
                <button id="toggle-hitboxes">Toggle Hitboxes</button>
            `;
            
            document.getElementById('game-container').appendChild(debugPanel);
            
            // Add event listener for toggle hitboxes button
            document.getElementById('toggle-hitboxes').addEventListener('click', () => {
                this.game.renderer.toggleHitboxes();
            });
        }
        
        // Update debug info
        this.updateDebugInfo();
    }
    
    updateDebugInfo() {
        if (!document.getElementById('debug-panel')) return;
        
        // Calculate FPS
        const now = performance.now();
        const deltaTime = now - (this._lastUpdateTime || now);
        this._lastUpdateTime = now;
        const fps = Math.round(1000 / deltaTime);
        
        // Update debug info
        document.getElementById('debug-fps').textContent = fps;
        document.getElementById('debug-player-x').textContent = this.game.player.position.x.toFixed(1);
        document.getElementById('debug-player-y').textContent = this.game.player.position.y.toFixed(1);
        document.getElementById('debug-velocity-x').textContent = this.game.player.velocity.x.toFixed(1);
        document.getElementById('debug-velocity-y').textContent = this.game.player.velocity.y.toFixed(1);
        document.getElementById('debug-grounded').textContent = this.game.player.isGrounded;
        
        // Schedule next update
        if (this.game.state.current === 'playing') {
            requestAnimationFrame(() => this.updateDebugInfo());
        }
    }
    
    hideDebugInfo() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.remove();
        }
    }
} 