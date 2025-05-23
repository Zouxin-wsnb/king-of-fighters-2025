class Particle {
    constructor(x, y, r) {
      this.pos = createVector(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(0.5, 2));
      this.acc = createVector();
      this.r = r;
      this.lifetime = 255;
    }
  
    // Check if particle lifetime has finished
    finished() {
      return (this.lifetime < 0);
    }
  
    // Apply force to the particle
    applyForce(force) {
      this.acc.add(force);
    }
  
    // Update particle position and velocity
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
      this.lifetime *= 0.78; // Fading effect
    }
  
    // Display the particle with current position, size, and color
    show() {
      noStroke();
      fill(rS, gS, bS, this.lifetime);
      circle(this.pos.x, this.pos.y, this.r);
    }
  }
  
  // The Emitter class handles creating and managing particles
  class Emitter {
    constructor(x, y) {
      this.position = createVector(x, y);
      this.particles = [];
      this.vel = p5.Vector.random2D();
      this.vel.mult(6);
      this.acc = createVector();
      this.size = 60;
    }
  
    // Emit specified number of particles
    emit(num) {
      for (let i = 0; i < num; i++) {
        this.particles.push(new Particle(this.position.x, this.position.y, this.size));
      }
    }
  
    // Apply force to all particles in the emitter
    applyForce(force) {
      for (let particle of this.particles) {
        particle.applyForce(force);
      }
    }
  
    // Apply force to the emitter itself
    applyBodyForce(force) {
      this.acc.add(force);
    }
  
    // Update all particles and emitter properties
    update() {
      for (let particle of this.particles) {
        particle.update();
      }
  
      // Remove particles that have finished
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (this.particles[i].finished()) {
          this.particles.splice(i, 1);
        }
      }
  
      // Update emitter's position and velocity
      this.vel.add(this.acc);
      this.position.add(this.vel);
      this.size *= 0.988888; // Gradually reduce emitter size
    }
  
    // Display all particles in the emitter
    show() {
      for (let particle of this.particles) {
        particle.show();
      }
    }
  }