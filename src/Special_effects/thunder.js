class Shell {
    constructor(x, y, minSize, maxSize, transparency, speed) {
      this.x = x;
      this.y = y;
      this.minSize = minSize;
      this.maxSize = maxSize;
      this.transparency = transparency;
      this.speed = speed;
      this.angle = 0;
      this.zigzagAmplitude = 10; // Amplitude of the zigzag
      this.zigzagFrequency = 0.1; // Frequency of the zigzag
      this.numPoints = 36; // Number of points around the circle
    }
  
    update() {
      this.angle += this.speed;
  
      // Calculate the current size using a sine wave
      let size = lerp(this.minSize, this.maxSize, (sin(this.angle) + 1) / 2);
  
      // Disable stroke to remove outlines
      noStroke();
  
      // Draw the shell with a glow effect
      for (let i = 0; i < 5; i++) {
        let alpha = this.transparency - i * 20;
        fill(0, 255, 255, alpha);
        ellipse(this.x, this.y, size + i * 20, size + i * 20);
      }
  
      // Draw the main shell
      fill(0, 255, 255, this.transparency);
      ellipse(this.x, this.y, size, size);
  
      // Draw the zigzag lines twining around the shell
      this.drawZigzag(size);
  
      // Draw the lightning-like lines twining around the shell
      this.drawLightning(size);
    }
  
    drawZigzag(radius) {
      beginShape();
      for (let i = 0; i < TWO_PI; i += PI / 8) {
        let x1 = this.x + cos(i) * radius;
        let y1 = this.y + sin(i) * radius;
        let x2 = this.x + cos(i + PI / 16) * (radius + this.zigzagAmplitude * sin(this.zigzagFrequency * i));
        let y2 = this.y + sin(i + PI / 16) * (radius + this.zigzagAmplitude * sin(this.zigzagFrequency * i));
        vertex(x1, y1);
        vertex(x2, y2);
      }
      endShape(CLOSE);
    }
  
    drawLightning(radius) {
      let numBranches = 5; // Number of lightning branches
      let maxLength = 500; // Maximum length of each lightning branch
  
      stroke(255); // Set stroke color to white
      strokeWeight(2); // Set stroke weight for visibility
  
      for (let i = 0; i < numBranches; i++) {
        let angle = random(TWO_PI);
        let x1 = this.x + cos(angle) * radius;
        let y1 = this.y + sin(angle) * radius;
  
        let x2 = x1;
        let y2 = y1;
        let length = random(50, maxLength);
  
        // Generate random jagged path for the lightning
        for (let j = 0; j < length; j++) {
          let offsetX = random(-5, 5);
          let offsetY = random(-5, 5);
          x2 += offsetX;
          y2 += offsetY;
          line(x1, y1, x2, y2);
          x1 = x2;
          y1 = y2;
        }
      }
    }
  }