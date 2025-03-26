class Levels {
    constructor(game) {
        this.game = game;
        this.currentLevel = null;
        
        // Level design data
        this.levelData = [
            // Level 1 - Introduction
            {
                platforms: [
                    // Ground
                    { x: 0, y: 500, width: 800, height: 100, color: '#4CAF50' },
                    // Platforms
                    { x: 200, y: 400, width: 100, height: 20, color: '#8B4513' },
                    { x: 350, y: 320, width: 100, height: 20, color: '#8B4513' },
                    { x: 500, y: 240, width: 100, height: 20, color: '#8B4513' }
                ],
                coins: [
                    { x: 220, y: 370, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 370, y: 290, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 520, y: 210, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 650, y: 300, width: 20, height: 20, value: 20, color: '#FFA500' }
                ],
                hazards: [
                    { x: 300, y: 480, width: 40, height: 20, color: '#FF0000' }
                ],
                playerStart: { x: 50, y: 400 },
                goal: { x: 700, y: 400, width: 50, height: 100, color: '#00FF00' },
                backgroundColor: '#87CEEB'
            },
            
            // Level 2 - Increased Difficulty
            {
                platforms: [
                    // Ground with gaps
                    { x: 0, y: 500, width: 200, height: 100, color: '#4CAF50' },
                    { x: 300, y: 500, width: 200, height: 100, color: '#4CAF50' },
                    { x: 600, y: 500, width: 200, height: 100, color: '#4CAF50' },
                    
                    // Platforms
                    { x: 100, y: 350, width: 80, height: 20, color: '#8B4513' },
                    { x: 250, y: 400, width: 80, height: 20, color: '#8B4513' },
                    { x: 400, y: 350, width: 80, height: 20, color: '#8B4513' },
                    { x: 550, y: 400, width: 80, height: 20, color: '#8B4513' },
                    { x: 650, y: 300, width: 100, height: 20, color: '#8B4513' }
                ],
                coins: [
                    { x: 120, y: 320, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 270, y: 370, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 420, y: 320, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 570, y: 370, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 680, y: 270, width: 20, height: 20, value: 30, color: '#FFA500' }
                ],
                hazards: [
                    { x: 220, y: 580, width: 60, height: 20, color: '#FF0000' },
                    { x: 520, y: 580, width: 60, height: 20, color: '#FF0000' },
                    { x: 350, y: 330, width: 30, height: 20, color: '#FF0000' }
                ],
                playerStart: { x: 50, y: 400 },
                goal: { x: 700, y: 200, width: 50, height: 100, color: '#00FF00' },
                backgroundColor: '#6495ED'
            },
            
            // Level 3 - Challenge
            {
                platforms: [
                    // Start platform
                    { x: 0, y: 500, width: 150, height: 100, color: '#4CAF50' },
                    
                    // Moving platforms (will be animated during gameplay)
                    { x: 200, y: 450, width: 80, height: 20, color: '#8B4513', movingPlatform: true, startX: 200, endX: 350, speed: 1 },
                    { x: 400, y: 400, width: 80, height: 20, color: '#8B4513', movingPlatform: true, startY: 350, endY: 450, speed: 1 },
                    
                    // Static platforms
                    { x: 550, y: 350, width: 60, height: 20, color: '#8B4513' },
                    { x: 650, y: 300, width: 60, height: 20, color: '#8B4513' },
                    { x: 500, y: 250, width: 60, height: 20, color: '#8B4513' },
                    { x: 350, y: 200, width: 60, height: 20, color: '#8B4513' },
                    { x: 200, y: 150, width: 60, height: 20, color: '#8B4513' },
                    
                    // Goal platform
                    { x: 650, y: 150, width: 150, height: 20, color: '#4CAF50' }
                ],
                coins: [
                    { x: 220, y: 420, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 420, y: 370, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 560, y: 320, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 660, y: 270, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 510, y: 220, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 360, y: 170, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 210, y: 120, width: 20, height: 20, value: 10, color: '#FFD700' },
                    { x: 700, y: 120, width: 20, height: 20, value: 50, color: '#FFA500' }
                ],
                hazards: [
                    { x: 0, y: 600, width: 800, height: 20, color: '#FF0000' }, // Death pit
                    { x: 300, y: 450, width: 30, height: 20, color: '#FF0000' },
                    { x: 600, y: 350, width: 30, height: 20, color: '#FF0000' },
                    { x: 550, y: 250, width: 30, height: 20, color: '#FF0000' },
                    { x: 400, y: 200, width: 30, height: 20, color: '#FF0000' },
                    { x: 250, y: 150, width: 30, height: 20, color: '#FF0000' }
                ],
                playerStart: { x: 50, y: 400 },
                goal: { x: 700, y: 50, width: 50, height: 100, color: '#00FF00' },
                backgroundColor: '#4682B4'
            }
        ];
    }
    
    loadLevel(levelIndex) {
        if (levelIndex >= 0 && levelIndex < this.levelData.length) {
            this.currentLevel = this.createLevel(this.levelData[levelIndex]);
            return true;
        }
        return false;
    }
    
    createLevel(levelData) {
        // Create a deep copy of the level data to avoid modifying the original
        const level = JSON.parse(JSON.stringify(levelData));
        
        // Add additional level properties or processing here
        level.time = 0;
        
        return level;
    }
    
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    getLevelCount() {
        return this.levelData.length;
    }
    
    updateLevel() {
        // Update moving platforms
        if (this.currentLevel) {
            for (const platform of this.currentLevel.platforms) {
                if (platform.movingPlatform) {
                    this.updateMovingPlatform(platform);
                }
            }
        }
    }
    
    updateMovingPlatform(platform) {
        // Horizontal movement
        if (platform.startX !== undefined && platform.endX !== undefined) {
            // Calculate new position
            if (platform.movingRight === undefined) platform.movingRight = true;
            
            if (platform.movingRight) {
                platform.x += platform.speed;
                if (platform.x >= platform.endX) {
                    platform.movingRight = false;
                }
            } else {
                platform.x -= platform.speed;
                if (platform.x <= platform.startX) {
                    platform.movingRight = true;
                }
            }
        }
        
        // Vertical movement
        if (platform.startY !== undefined && platform.endY !== undefined) {
            // Calculate new position
            if (platform.movingDown === undefined) platform.movingDown = true;
            
            if (platform.movingDown) {
                platform.y += platform.speed;
                if (platform.y >= platform.endY) {
                    platform.movingDown = false;
                }
            } else {
                platform.y -= platform.speed;
                if (platform.y <= platform.startY) {
                    platform.movingDown = true;
                }
            }
        }
    }
} 