class Player {
    constructor(game) {
        this.game = game;
        
        // Player dimensions
        this.width = 30;
        this.height = 50;
        
        // Player position and movement
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        
        // Movement constants
        this.speed = 800;
        this.jumpForce = 700;
        this.gravity = 1200;
        this.friction = 0.85;
        this.airFriction = 0.97;
        
        // Player state
        this.state = 'idle'; // idle, running, jumping, falling
        this.facing = 'right'; // left, right
        this.isGrounded = false;
        this.isJumping = false;
        this.jumpPressed = false;
        
        // Animation properties
        this.frameCount = 0;
        this.animationFrame = 0;
        this.animationSpeed = 8; // Frames per second
        
        // Player colors
        this.colors = {
            body: '#ff6600',
            outline: '#000000',
            head: '#ffcc99',
            eyes: '#000000'
        };
    }
    
    update() {
        // Apply gravity
        this.acceleration.y = this.gravity;
        
        // Handle input (this will be managed by the Controls class)
        this.handleInput();
        
        // Update velocity based on acceleration
        this.velocity.x += this.acceleration.x * this.game.deltaTime;
        this.velocity.y += this.acceleration.y * this.game.deltaTime;
        
        // Apply friction
        if (this.isGrounded) {
            this.velocity.x *= this.friction;
        } else {
            this.velocity.x *= this.airFriction;
        }
        
        // Update position based on velocity
        this.position.x += this.velocity.x * this.game.deltaTime;
        this.position.y += this.velocity.y * this.game.deltaTime;
        
        // Update player state
        this.updateState();
        
        // Update animation
        this.updateAnimation();
        
        // Reset acceleration
        this.acceleration.x = 0;
    }
    
    handleInput() {
        // This is a placeholder - actual input handling is in the Controls class
        // The Controls class will call the move methods below
    }
    
    moveLeft() {
        this.acceleration.x = -this.speed;
        this.facing = 'left';
    }
    
    moveRight() {
        this.acceleration.x = this.speed;
        this.facing = 'right';
    }
    
    jump() {
        if (this.isGrounded && !this.jumpPressed) {
            this.velocity.y = -this.jumpForce;
            this.isGrounded = false;
            this.isJumping = true;
            this.jumpPressed = true;
            
            // Play jump sound
            this.game.audio.playSound('jump');
        }
    }
    
    releaseJump() {
        this.jumpPressed = false;
        
        // Cut the jump short if still rising
        if (this.velocity.y < 0) {
            this.velocity.y *= 0.5;
        }
    }
    
    updateState() {
        // Update player state based on movement
        if (!this.isGrounded) {
            if (this.velocity.y < 0) {
                this.state = 'jumping';
            } else {
                this.state = 'falling';
            }
        } else {
            if (Math.abs(this.velocity.x) > 10) {
                this.state = 'running';
            } else {
                this.state = 'idle';
            }
            
            // Reset jumping flag
            this.isJumping = false;
        }
    }
    
    updateAnimation() {
        // Update animation frame based on state
        this.frameCount++;
        
        if (this.frameCount >= 60 / this.animationSpeed) {
            this.frameCount = 0;
            this.animationFrame = (this.animationFrame + 1) % 4; // 4 frames per animation
        }
    }
    
    render(ctx) {
        // Draw player based on current state
        ctx.save();
        
        // Draw the player character
        this.drawCharacter(ctx);
        
        // Debug: draw hitbox
        if (this.game.debugMode) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        }
        
        ctx.restore();
    }
    
    drawCharacter(ctx) {
        const x = this.position.x;
        const y = this.position.y;
        
        // Body
        ctx.fillStyle = this.colors.body;
        ctx.fillRect(x, y, this.width, this.height);
        
        // Outline
        ctx.strokeStyle = this.colors.outline;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.width, this.height);
        
        // Head
        const headSize = this.width * 0.8;
        const headX = x + (this.width - headSize) / 2;
        const headY = y - headSize + 10;
        
        ctx.fillStyle = this.colors.head;
        ctx.fillRect(headX, headY, headSize, headSize);
        ctx.strokeRect(headX, headY, headSize, headSize);
        
        // Eyes
        const eyeSize = headSize * 0.2;
        const eyeY = headY + headSize * 0.3;
        
        ctx.fillStyle = this.colors.eyes;
        
        // Draw eyes based on facing direction
        if (this.facing === 'right') {
            ctx.fillRect(headX + headSize * 0.6, eyeY, eyeSize, eyeSize);
            ctx.fillRect(headX + headSize * 0.2, eyeY, eyeSize, eyeSize);
        } else {
            ctx.fillRect(headX + headSize * 0.2, eyeY, eyeSize, eyeSize);
            ctx.fillRect(headX + headSize * 0.6, eyeY, eyeSize, eyeSize);
        }
        
        // Draw animations based on state
        if (this.state === 'running') {
            this.drawRunningAnimation(ctx);
        } else if (this.state === 'jumping' || this.state === 'falling') {
            this.drawJumpingAnimation(ctx);
        }
    }
    
    drawRunningAnimation(ctx) {
        // Simple running animation - move legs
        const legWidth = this.width * 0.2;
        const legHeight = this.height * 0.3;
        
        ctx.fillStyle = this.colors.body;
        
        // Left leg
        const leftLegX = this.position.x + this.width * 0.2;
        const leftLegOffset = Math.sin((this.animationFrame / 4) * Math.PI * 2) * 5;
        const leftLegY = this.position.y + this.height - legHeight + leftLegOffset;
        
        ctx.fillRect(leftLegX, leftLegY, legWidth, legHeight);
        ctx.strokeRect(leftLegX, leftLegY, legWidth, legHeight);
        
        // Right leg
        const rightLegX = this.position.x + this.width * 0.6;
        const rightLegOffset = -leftLegOffset;
        const rightLegY = this.position.y + this.height - legHeight + rightLegOffset;
        
        ctx.fillRect(rightLegX, rightLegY, legWidth, legHeight);
        ctx.strokeRect(rightLegX, rightLegY, legWidth, legHeight);
    }
    
    drawJumpingAnimation(ctx) {
        // Simple jumping animation - bend legs
        const legWidth = this.width * 0.2;
        const legHeight = this.height * 0.3;
        
        ctx.fillStyle = this.colors.body;
        
        // Left leg
        const leftLegX = this.position.x + this.width * 0.2;
        const leftLegOffset = this.state === 'jumping' ? 5 : -5;
        const leftLegY = this.position.y + this.height - legHeight + leftLegOffset;
        
        ctx.fillRect(leftLegX, leftLegY, legWidth, legHeight);
        ctx.strokeRect(leftLegX, leftLegY, legWidth, legHeight);
        
        // Right leg
        const rightLegX = this.position.x + this.width * 0.6;
        const rightLegOffset = leftLegOffset;
        const rightLegY = this.position.y + this.height - legHeight + rightLegOffset;
        
        ctx.fillRect(rightLegX, rightLegY, legWidth, legHeight);
        ctx.strokeRect(rightLegX, rightLegY, legWidth, legHeight);
    }
    
    reset(x, y) {
        // Reset player position and state
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.acceleration.x = 0;
        this.state = 'idle';
        this.isGrounded = false;
        this.isJumping = false;
        this.jumpPressed = false;
    }
    
    // Collision response methods
    onGround() {
        this.isGrounded = true;
        this.velocity.y = 0;
    }
    
    onCeiling() {
        this.velocity.y = 0;
    }
    
    onWall() {
        this.velocity.x = 0;
    }
} 