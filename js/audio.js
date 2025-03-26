class Audio {
    constructor(game) {
        this.game = game;
        this.soundEnabled = true;
        this.sounds = {};
        
        // Sound volume levels
        this.volumeLevels = {
            sfx: 0.5,
            music: 0.3
        };
        
        // Initialize audio
        this.init();
    }
    
    init() {
        // Create audio context
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create master gain node for volume control
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = 1;
        this.masterGain.connect(this.context.destination);
        
        // Create separate gain nodes for sfx and music
        this.sfxGain = this.context.createGain();
        this.sfxGain.gain.value = this.volumeLevels.sfx;
        this.sfxGain.connect(this.masterGain);
        
        this.musicGain = this.context.createGain();
        this.musicGain.gain.value = this.volumeLevels.music;
        this.musicGain.connect(this.masterGain);
        
        // Load all sound effects
        this.loadSounds();
    }
    
    loadSounds() {
        // Define sound effects using oscillators and gainNodes for simple sounds
        this.createJumpSound();
        this.createCoinSound();
        this.createDeathSound();
        this.createLevelCompleteSound();
        this.createGameOverSound();
        
        // Create background music
        this.createBackgroundMusic();
    }
    
    createJumpSound() {
        // Create a "jump" sound using oscillators
        this.sounds.jump = {
            play: () => {
                if (!this.soundEnabled) return;
                
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(300, this.context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.sfxGain);
                
                oscillator.start();
                oscillator.stop(this.context.currentTime + 0.3);
            }
        };
    }
    
    createCoinSound() {
        // Create a "coin collect" sound
        this.sounds.coin = {
            play: () => {
                if (!this.soundEnabled) return;
                
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, this.context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, this.context.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.sfxGain);
                
                oscillator.start();
                oscillator.stop(this.context.currentTime + 0.2);
            }
        };
    }
    
    createDeathSound() {
        // Create a "death" sound
        this.sounds.death = {
            play: () => {
                if (!this.soundEnabled) return;
                
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(400, this.context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.5);
                
                gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.sfxGain);
                
                oscillator.start();
                oscillator.stop(this.context.currentTime + 0.5);
            }
        };
    }
    
    createLevelCompleteSound() {
        // Create a "level complete" sound
        this.sounds.levelComplete = {
            play: () => {
                if (!this.soundEnabled) return;
                
                const playNote = (freq, startTime, duration) => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.value = freq;
                    
                    gainNode.gain.setValueAtTime(0.3, this.context.currentTime + startTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + startTime + duration);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.sfxGain);
                    
                    oscillator.start(this.context.currentTime + startTime);
                    oscillator.stop(this.context.currentTime + startTime + duration);
                };
                
                // Play a little victory melody
                playNote(523.25, 0, 0.2);     // C5
                playNote(659.25, 0.2, 0.2);   // E5
                playNote(783.99, 0.4, 0.2);   // G5
                playNote(1046.50, 0.6, 0.4);  // C6
            }
        };
    }
    
    createGameOverSound() {
        // Create a "game over" sound
        this.sounds.gameOver = {
            play: () => {
                if (!this.soundEnabled) return;
                
                const playNote = (freq, startTime, duration) => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.value = freq;
                    
                    gainNode.gain.setValueAtTime(0.3, this.context.currentTime + startTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + startTime + duration);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.sfxGain);
                    
                    oscillator.start(this.context.currentTime + startTime);
                    oscillator.stop(this.context.currentTime + startTime + duration);
                };
                
                // Play a sad melody
                playNote(523.25, 0, 0.3);     // C5
                playNote(493.88, 0.3, 0.3);   // B4
                playNote(466.16, 0.6, 0.3);   // A#4
                playNote(440.00, 0.9, 0.6);   // A4
            }
        };
    }
    
    createBackgroundMusic() {
        // Create simple background music using oscillators
        this.sounds.backgroundMusic = {
            isPlaying: false,
            oscillators: [],
            gainNodes: [],
            
            play: () => {
                if (!this.soundEnabled || this.sounds.backgroundMusic.isPlaying) return;
                
                const notes = [
                    { freq: 261.63, duration: 0.5, offset: 0 },     // C4
                    { freq: 329.63, duration: 0.5, offset: 0.5 },   // E4
                    { freq: 392.00, duration: 0.5, offset: 1 },     // G4
                    { freq: 523.25, duration: 0.5, offset: 1.5 },   // C5
                    { freq: 392.00, duration: 0.5, offset: 2 },     // G4
                    { freq: 329.63, duration: 0.5, offset: 2.5 },   // E4
                ];
                
                const patternDuration = 3; // Total duration of the pattern in seconds
                
                // Create all oscillators and schedule them to repeat
                notes.forEach(note => {
                    const createAndScheduleNote = (startTime) => {
                        const oscillator = this.context.createOscillator();
                        const gainNode = this.context.createGain();
                        
                        oscillator.type = 'sine';
                        oscillator.frequency.value = note.freq;
                        
                        gainNode.gain.setValueAtTime(0, this.context.currentTime + startTime + note.offset);
                        gainNode.gain.linearRampToValueAtTime(0.1, this.context.currentTime + startTime + note.offset + 0.05);
                        gainNode.gain.setValueAtTime(0.1, this.context.currentTime + startTime + note.offset + note.duration - 0.05);
                        gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + startTime + note.offset + note.duration);
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(this.musicGain);
                        
                        oscillator.start(this.context.currentTime + startTime + note.offset);
                        
                        // Schedule next repetition
                        setTimeout(() => {
                            if (this.sounds.backgroundMusic.isPlaying) {
                                createAndScheduleNote(patternDuration);
                            }
                        }, (startTime + note.offset) * 1000);
                        
                        return { oscillator, gainNode };
                    };
                    
                    const { oscillator, gainNode } = createAndScheduleNote(0);
                    this.sounds.backgroundMusic.oscillators.push(oscillator);
                    this.sounds.backgroundMusic.gainNodes.push(gainNode);
                });
                
                this.sounds.backgroundMusic.isPlaying = true;
            },
            
            stop: () => {
                this.sounds.backgroundMusic.isPlaying = false;
                
                // Stop all oscillators
                this.sounds.backgroundMusic.oscillators.forEach(osc => {
                    try {
                        osc.stop();
                    } catch (e) {
                        // Ignore errors if oscillator already stopped
                    }
                });
                
                // Clear arrays
                this.sounds.backgroundMusic.oscillators = [];
                this.sounds.backgroundMusic.gainNodes = [];
            }
        };
    }
    
    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].play();
        } else {
            console.warn(`Sound ${name} not found`);
        }
    }
    
    startMusic() {
        this.sounds.backgroundMusic.play();
    }
    
    stopMusic() {
        this.sounds.backgroundMusic.stop();
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        
        if (!this.soundEnabled) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
        
        return this.soundEnabled;
    }
    
    setVolume(type, level) {
        if (type === 'sfx') {
            this.volumeLevels.sfx = level;
            this.sfxGain.gain.value = level;
        } else if (type === 'music') {
            this.volumeLevels.music = level;
            this.musicGain.gain.value = level;
        }
    }
    
    // Resume audio context on user interaction
    resumeAudio() {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }
} 