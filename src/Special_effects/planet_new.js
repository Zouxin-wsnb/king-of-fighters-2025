class ShiningPlanet {
    constructor(x, y, size, baseClr, glowClr, highlightClr, sparkleClr, vx, vy) {
      this.pos = createVector(x, y);
      this.vel = createVector(vx, vy);
      this.size = size;
      this.baseColor = baseClr;
      this.glowColor = glowClr;
      this.highlightColor = highlightClr;
      this.sparkleColor = sparkleClr;
      // this.angle = 0; // Could be used for rotating highlight if desired
    }
  
    update() {
      this.pos.add(this.vel);
      // this.angle += 0.01; 
    }
  
    display() {
      noStroke();
  
      // 1. Glow effect
      // Multiple layers for a softer glow
      for (let i = 0; i < 5; i++) {
        fill(
          red(this.glowColor), 
          green(this.glowColor), 
          blue(this.glowColor), 
          alpha(this.glowColor) / (i + 1.5) // Make glow slightly more subtle
        );
        ellipse(this.pos.x, this.pos.y, this.size + i * 12, this.size + i * 12); // Slightly increased glow spread
      }
      
      // 2. Base ball
      fill(this.baseColor);
      ellipse(this.pos.x, this.pos.y, this.size, this.size);
  
      // 3. Shine/Highlight
      // Offset the highlight. A fixed offset gives a consistent light source feel.
      let shineOffsetX = -this.size * 0.15; 
      let shineOffsetY = -this.size * 0.15;
      
      fill(this.highlightColor);
      ellipse(this.pos.x + shineOffsetX, this.pos.y + shineOffsetY, this.size * 0.55, this.size * 0.55); // Slightly larger main highlight
      
      // A smaller, brighter spot for more "sparkle"
      fill(this.sparkleColor);
      ellipse(this.pos.x + shineOffsetX * 1.2, this.pos.y + shineOffsetY * 1.2, this.size * 0.25, this.size * 0.25);
    }
  
    isOffscreen() {
      // Using a larger margin for the offscreen check to account for glow
      return (
        this.pos.x < -this.size * 2 || 
        this.pos.x > width + this.size * 2 ||
        this.pos.y < -this.size * 2 ||
        this.pos.y > height + this.size * 2
      );
    }
    
    reset(x, y) {
      this.pos.set(x, y);
      // Optionally randomize velocity again or keep it
      // this.vel = createVector(random(-3,3), random(-3,3)); 
    }
  }