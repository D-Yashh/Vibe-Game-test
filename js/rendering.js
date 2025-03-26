class Renderer {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // For debugging
        this.showHitboxes = false;
        
        // Camera properties
        this.cameraFollowSpeed = 0.1;
    }
    
    calculateScale() {
        // Calculate the scale based on canvas size vs original design dimensions
        const horizontalScale = this.game.canvas.width / this.game.width;
        const verticalScale = this.game.canvas.height / this.game.height;
        
        // Use the smaller scale to ensure everything fits
        this.scale = Math.min(horizontalScale, verticalScale);
    }
    
    renderLevel(level) {
        const ctx = this.ctx;
        
        // Clear the canvas with background color
        ctx.fillStyle = level.backgroundColor || '#87CEEB';
        ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Calculate camera position to follow player
        this.updateCamera();
        
        // Apply scaling and translation
        ctx.save();
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offsetX, this.offsetY);
        
        // Draw platforms
        this.renderPlatforms(level.platforms);
        
        // Draw coins
        this.renderCoins(level.coins);
        
        // Draw hazards
        this.renderHazards(level.hazards);
        
        // Draw goal
        this.renderGoal(level.goal);
        
        // Restore context
        ctx.restore();
    }
    
    updateCamera() {
        // Calculate target position - center on player but with bounds
        const targetX = -(this.game.player.position.x + this.game.player.width / 2 - this.game.canvas.width / this.scale / 2);
        const targetY = -(this.game.player.position.y + this.game.player.height / 2 - this.game.canvas.height / this.scale / 2);
        
        // Apply bounds
        const currentLevel = this.game.levels.getCurrentLevel();
        const levelWidth = 800; // Assuming fixed level width
        const levelHeight = 600; // Assuming fixed level height
        
        // Limit camera movement to level bounds
        const minX = -(levelWidth - this.game.canvas.width / this.scale);
        const maxX = 0;
        const minY = -(levelHeight - this.game.canvas.height / this.scale);
        const maxY = 0;
        
        const boundedTargetX = Math.min(maxX, Math.max(minX, targetX));
        const boundedTargetY = Math.min(maxY, Math.max(minY, targetY));
        
        // Smoothly interpolate camera position
        this.offsetX += (boundedTargetX - this.offsetX) * this.cameraFollowSpeed;
        this.offsetY += (boundedTargetY - this.offsetY) * this.cameraFollowSpeed;
    }
    
    renderPlatforms(platforms) {
        const ctx = this.ctx;
        
        for (const platform of platforms) {
            ctx.fillStyle = platform.color;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Add platform details - just a simple top line for grass or wood texture
            if (platform.color === '#4CAF50') {
                // Grass platform
                ctx.fillStyle = '#2E7D32';
                ctx.fillRect(platform.x, platform.y, platform.width, 5);
            } else if (platform.color === '#8B4513') {
                // Wooden platform
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(platform.x, platform.y, platform.width, 5);
                
                // Add some wood grain
                ctx.strokeStyle = '#3E2723';
                ctx.lineWidth = 1;
                
                for (let i = 5; i < platform.width - 5; i += 15) {
                    ctx.beginPath();
                    ctx.moveTo(platform.x + i, platform.y);
                    ctx.lineTo(platform.x + i, platform.y + platform.height);
                    ctx.stroke();
                }
            }
            
            // Draw hitbox if debugging is enabled
            if (this.showHitboxes) {
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 1;
                ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            }
        }
    }
    
    renderCoins(coins) {
        const ctx = this.ctx;
        
        for (const coin of coins) {
            // Save context for rotation
            ctx.save();
            
            // Move to coin center
            ctx.translate(coin.x + coin.width / 2, coin.y + coin.height / 2);
            
            // Animate coin by rotating
            const rotationSpeed = 0.02;
            const elapsedTime = Date.now() / 1000;
            ctx.rotate(elapsedTime * rotationSpeed * Math.PI);
            
            // Draw coin - use a circle with a star shape for gold coins
            const radius = coin.width / 2;
            
            // Outer circle
            ctx.fillStyle = coin.color;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner details
            if (coin.color === '#FFD700') {
                // Gold coin
                ctx.fillStyle = '#FFC107';
                ctx.beginPath();
                ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
                ctx.fill();
                
                // $ sign for gold coins
                ctx.fillStyle = '#5D4037';
                ctx.font = `bold ${radius}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', 0, 0);
            } else {
                // Bonus coin (orange)
                ctx.fillStyle = '#FF9800';
                ctx.beginPath();
                ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
                ctx.fill();
                
                // Star shape for bonus
                ctx.fillStyle = '#FFC107';
                ctx.font = `bold ${radius}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('★', 0, 0);
            }
            
            // Draw hitbox if debugging is enabled
            if (this.showHitboxes) {
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 1;
                ctx.strokeRect(-radius, -radius, coin.width, coin.height);
            }
            
            // Restore context
            ctx.restore();
        }
    }
    
    renderHazards(hazards) {
        const ctx = this.ctx;
        
        for (const hazard of hazards) {
            // Basic hazard rendering
            ctx.fillStyle = hazard.color;
            ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
            
            // Add spikes or warning patterns
            // For spikes
            ctx.fillStyle = '#FF3D00';
            
            const spikeWidth = 8;
            const spikeCount = Math.floor(hazard.width / spikeWidth);
            
            for (let i = 0; i < spikeCount; i++) {
                const spikeX = hazard.x + i * spikeWidth;
                
                ctx.beginPath();
                ctx.moveTo(spikeX, hazard.y);
                ctx.lineTo(spikeX + spikeWidth / 2, hazard.y - 10);
                ctx.lineTo(spikeX + spikeWidth, hazard.y);
                ctx.closePath();
                ctx.fill();
            }
            
            // Add warning stripes
            ctx.fillStyle = '#FFEB3B';
            
            const stripeWidth = 10;
            const stripeCount = Math.floor(hazard.width / (stripeWidth * 2));
            
            for (let i = 0; i < stripeCount; i++) {
                const stripeX = hazard.x + i * stripeWidth * 2;
                ctx.fillRect(stripeX, hazard.y, stripeWidth, hazard.height);
            }
            
            // Draw hitbox if debugging is enabled
            if (this.showHitboxes) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 1;
                ctx.strokeRect(hazard.x, hazard.y, hazard.width, hazard.height);
            }
        }
    }
    
    renderGoal(goal) {
        const ctx = this.ctx;
        
        // Draw goal flag
        ctx.fillStyle = goal.color;
        ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
        
        // Flag pole
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(goal.x + 5, goal.y, 5, goal.height);
        
        // Flag
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.moveTo(goal.x + 10, goal.y + 10);
        ctx.lineTo(goal.x + 40, goal.y + 20);
        ctx.lineTo(goal.x + 10, goal.y + 30);
        ctx.closePath();
        ctx.fill();
        
        // Add a checkered pattern at the bottom
        ctx.fillStyle = '#000000';
        const checkerSize = 10;
        const checkerRows = 2;
        
        for (let r = 0; r < checkerRows; r++) {
            for (let c = 0; c < goal.width / checkerSize; c++) {
                if ((r + c) % 2 === 0) {
                    ctx.fillRect(
                        goal.x + c * checkerSize, 
                        goal.y + goal.height - (r + 1) * checkerSize, 
                        checkerSize, 
                        checkerSize
                    );
                }
            }
        }
        
        // Draw hitbox if debugging is enabled
        if (this.showHitboxes) {
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 1;
            ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);
        }
    }
    
    // Helper method to draw text with an outline
    drawText(text, x, y, color, fontSize, outlineColor = '#000', outlineWidth = 4) {
        const ctx = this.ctx;
        
        ctx.font = `${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw outline
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.strokeText(text, x, y);
        
        // Draw text
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
    
    // Debug helpers
    toggleHitboxes() {
        this.showHitboxes = !this.showHitboxes;
    }
} 