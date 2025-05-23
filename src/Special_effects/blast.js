class EnergyBlast {
  constructor(x, y, maxLength, thickness, growthRate, fadeDuration, direction = 1) {
    this.x = x;
    this.y = y;
    this.maxLength = maxLength;
    this.thickness = thickness;
    this.growthRate = growthRate; // Growth per frame
    this.fadeDuration = fadeDuration; // Duration in frames for fading
    this.direction = direction; // 1 for left-to-right, -1 for right-to-left
    this.length = 0; // Current length of the blast
    this.alpha = 255; // Start fully opaque
    this.expanding = true; // Flag to indicate expansion phase
    this.particles = this.createParticles();
    this.ribbonOffset = 0;
  }

  createParticles() {
    let particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: random(this.x, this.x + this.length),
        y: random(this.y - this.thickness / 2, this.y + this.thickness / 2),
        size: random(4, 10),
        speed: random(2, 5) * this.direction * this.growthRate,
      });
    }
    return particles;
  }

  update() {
    if (this.expanding) {
      this.length += this.growthRate;
      if (this.length >= this.maxLength) {
        this.length = this.maxLength;
        this.expanding = false;
      }
    } else {
      this.alpha -= 255 / this.fadeDuration;
      this.alpha = max(this.alpha, 0);
    }

    for (let p of this.particles) {
      p.x += p.speed;
      if (this.direction === 1 && p.x > this.x + this.length) {
        p.x = this.x;
      } else if (this.direction === -1 && p.x < this.x - this.length) {
        p.x = this.x;
      }
      p.y = random(this.y - this.thickness / 2, this.y + this.thickness / 2);
    }

    this.ribbonOffset += 0.1;
  }

  draw() {
    noStroke();

    // Outer glow
    fill(100, 0, 255, this.alpha * 0.6);
    ellipse(this.x + (this.length / 2) * this.direction, this.y, this.length, this.thickness * 2.5);

    // Inner blast
    fill(255, 200, 0, this.alpha * 0.8);
    ellipse(this.x + (this.length / 2) * this.direction, this.y, this.length, this.thickness);

    // Core
    fill(255, 255, 100, this.alpha);
    rectMode(CENTER);
    rect(this.x + (this.length / 2) * this.direction, this.y, this.length, this.thickness / 2);

    // Particles
    fill(0, 0, 255, this.alpha);
    for (let p of this.particles) {
      ellipse(p.x, p.y, p.size);
    }

    // Shiny Ribbon
    stroke(255, 255, 255, this.alpha);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < this.length; i += 10) {
      let angle = this.ribbonOffset + i * 0.1;
      let ribbonX = this.x + i * this.direction;
      let ribbonY = this.y + sin(angle) * this.thickness;
      vertex(ribbonX, ribbonY);
    }
    endShape();
  }

  isFaded() {
    return this.alpha <= 0;
  }
}

// 添加isFinished方法
EnergyBlast.prototype.isFinished = function() {
  return this.isFaded();
};

// 可选：添加display作为draw的别名，使API一致
EnergyBlast.prototype.display = function() {
  this.draw();
};