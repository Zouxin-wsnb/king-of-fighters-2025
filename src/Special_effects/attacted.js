class Explosion {
  constructor(x, y) {
    this.particles = []; // Array to store the particles of this explosion
    this.origin = createVector(x, y); // The starting point of the explosion

    // Determine a random number of particles for this explosion
    const numParticles = floor(random(200, 300)); // Increased particle count slightly

    // Create the particles
    for (let i = 0; i < numParticles; i++) {
      // Add a mix of fiery particles and smoke particles
      if (random(1) < 0.75) { // 75% chance of being a fiery particle
        this.particles.push(new ExplosionParticle(this.origin.x, this.origin.y, 'fire'));
      } else { // 25% chance of being a smoke particle
        this.particles.push(new ExplosionParticle(this.origin.x, this.origin.y, 'smoke'));
      }
    }
    
    // 添加颜色数组用于粒子效果
    this.particleColors = [
      [255, 100, 0],  // 橙色
      [255, 50, 0],   // 红橙色
      [255, 200, 0],  // 黄色
      [255, 150, 0]   // 金色
    ];
    
    this.smokeColors = [
      [100, 100, 100], // 深灰色
      [150, 150, 150], // 中灰色
      [200, 200, 200], // 浅灰色
      [100, 100, 120]  // 蓝灰色
    ];
  }

  // Update all particles in this explosion
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      // Remove particles that are no longer visible (dead)
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Display all particles in this explosion
  display() {
    for (let particle of this.particles) {
      particle.display();
    }
  }

  // Check if all particles in this explosion have faded
  isFinished() {
    return this.particles.length === 0;
  }
}

// --- ExplosionParticle Class ---
// Represents a single particle in an explosion
class ExplosionParticle {
  constructor(x, y, type = 'fire') {
    this.position = createVector(x, y); // Particle's current position
    this.type = type; // 'fire' or 'smoke'

    // Set a random initial velocity for an outward burst effect
    this.velocity = p5.Vector.random2D(); // Get a random direction vector
    
    // 颜色数组
    this.particleColors = [
      [255, 100, 0],  // 橙色
      [255, 50, 0],   // 红橙色
      [255, 200, 0],  // 黄色
      [255, 150, 0]   // 金色
    ];
    
    this.smokeColors = [
      [100, 100, 100], // 深灰色
      [150, 150, 150], // 中灰色
      [200, 200, 200], // 浅灰色
      [100, 100, 120]  // 蓝灰色
    ];
    
    if (this.type === 'fire') {
      this.velocity.mult(random(1.5, 8)); // Fire particles are generally faster
      this.lifespan = random(150, 255);   // Fire particles have varied lifespan
      this.decayRate = random(2, 6);
      this.size = random(4, 15);
      this.color = random(this.particleColors);
      this.acceleration = createVector(0, 0.03); // Slight gravity for fire
      this.shineColor = [255, 255, 200]; // Bright yellow/white for shine
    } else { // Smoke particles
      this.velocity.mult(random(0.5, 3));  // Smoke particles are slower
      this.lifespan = random(100, 200);    // Smoke has a slightly shorter, more consistent lifespan
      this.decayRate = random(1, 3);
      this.size = random(10, 25); // Smoke particles are generally larger
      this.color = random(this.smokeColors);
      this.acceleration = createVector(random(-0.02, 0.02), -0.05); // Smoke tends to rise and spread
    }
    
    this.originalSize = this.size; // Store initial size for shrinking effect
  }

  // Update the particle's state (position, lifespan, size)
  update() {
    // Apply acceleration to velocity
    this.velocity.add(this.acceleration);

    // Update position based on velocity
    this.position.add(this.velocity);

    // Decrease lifespan
    this.lifespan -= this.decayRate;

    // Shrink particle as it fades
    // Map lifespan (initial lifespan to 0) to size (originalSize to 0)
    const initialLifespan = (this.type === 'fire') ? 255 : 200; // Approx initial for mapping
    this.size = map(this.lifespan, initialLifespan, 0, this.originalSize, 0);
    this.size = max(0, this.size); // Ensure size doesn't go negative
  }

  // Draw the particle on the canvas
  display() {
    noStroke();

    // Main particle body
    fill(this.color[0], this.color[1], this.color[2], this.lifespan);
    ellipse(this.position.x, this.position.y, this.size, this.size);

    // Add shining effect for fire particles
    if (this.type === 'fire' && this.size > 1) {
      // The shine is smaller and brighter, centered on the particle
      const shineSize = this.size * 0.5; // Shine is half the particle size
      // Shine alpha is also based on lifespan, but could be made more intense
      const shineAlpha = this.lifespan * 0.8; 
      fill(this.shineColor[0], this.shineColor[1], this.shineColor[2], shineAlpha);
      ellipse(this.position.x, this.position.y, shineSize, shineSize);
    }
  }

  // Check if the particle has faded completely
  isDead() {
    return this.lifespan < 0;
  }
}