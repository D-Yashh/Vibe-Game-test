class Physics {
    constructor() {
        // Collision detection properties
        this.collisionPadding = 1;
    }
    
    checkCollisions(player, level) {
        // Check platform collisions
        this.checkPlatformCollisions(player, level.platforms);
        
        // Check coin collisions
        this.checkCoinCollisions(player, level);
        
        // Check hazard collisions
        this.checkHazardCollisions(player, level.hazards);
    }
    
    checkPlatformCollisions(player, platforms) {
        // Reset grounded state
        player.isGrounded = false;
        
        // Check collision with each platform
        for (const platform of platforms) {
            // Calculate collision bounds
            const playerLeft = player.position.x;
            const playerRight = player.position.x + player.width;
            const playerTop = player.position.y;
            const playerBottom = player.position.y + player.height;
            
            const platformLeft = platform.x;
            const platformRight = platform.x + platform.width;
            const platformTop = platform.y;
            const platformBottom = platform.y + platform.height;
            
            // Check for collision
            if (playerRight > platformLeft && 
                playerLeft < platformRight && 
                playerBottom > platformTop && 
                playerTop < platformBottom) {
                    
                // Calculate overlap on each axis
                const overlapLeft = playerRight - platformLeft;
                const overlapRight = platformRight - playerLeft;
                const overlapTop = playerBottom - platformTop;
                const overlapBottom = platformBottom - playerTop;
                
                // Find the smallest overlap
                const minOverlapX = Math.min(overlapLeft, overlapRight);
                const minOverlapY = Math.min(overlapTop, overlapBottom);
                
                // Resolve collision based on smallest overlap
                if (minOverlapX < minOverlapY) {
                    // Horizontal collision
                    if (overlapLeft < overlapRight) {
                        // Collision from right
                        player.position.x = platformLeft - player.width - this.collisionPadding;
                    } else {
                        // Collision from left
                        player.position.x = platformRight + this.collisionPadding;
                    }
                    
                    player.onWall();
                } else {
                    // Vertical collision
                    if (overlapTop < overlapBottom) {
                        // Collision from bottom
                        player.position.y = platformTop - player.height - this.collisionPadding;
                        player.onGround();
                    } else {
                        // Collision from top
                        player.position.y = platformBottom + this.collisionPadding;
                        player.onCeiling();
                    }
                }
            }
        }
    }
    
    checkCoinCollisions(player, level) {
        // Get the player bounds
        const playerLeft = player.position.x;
        const playerRight = player.position.x + player.width;
        const playerTop = player.position.y;
        const playerBottom = player.position.y + player.height;
        
        // Check collision with each coin
        for (let i = level.coins.length - 1; i >= 0; i--) {
            const coin = level.coins[i];
            
            // Calculate coin bounds
            const coinLeft = coin.x;
            const coinRight = coin.x + coin.width;
            const coinTop = coin.y;
            const coinBottom = coin.y + coin.height;
            
            // Check for collision
            if (playerRight > coinLeft && 
                playerLeft < coinRight && 
                playerBottom > coinTop && 
                playerTop < coinBottom) {
                // Remove the coin
                level.coins.splice(i, 1);
                
                // Update score
                player.game.collectCoin(coin);
            }
        }
    }
    
    checkHazardCollisions(player, hazards) {
        // Get the player bounds
        const playerLeft = player.position.x;
        const playerRight = player.position.x + player.width;
        const playerTop = player.position.y;
        const playerBottom = player.position.y + player.height;
        
        // Check collision with each hazard
        for (const hazard of hazards) {
            // Calculate hazard bounds
            const hazardLeft = hazard.x;
            const hazardRight = hazard.x + hazard.width;
            const hazardTop = hazard.y;
            const hazardBottom = hazard.y + hazard.height;
            
            // Check for collision
            if (playerRight > hazardLeft && 
                playerLeft < hazardRight && 
                playerBottom > hazardTop && 
                playerTop < hazardBottom) {
                // Player hit a hazard
                player.game.loseLife();
                return; // Exit after first collision
            }
        }
    }
    
    // Helper methods for collision detection
    isAABBCollision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
    
    isPointInsideRect(point, rect) {
        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height
        );
    }
} 