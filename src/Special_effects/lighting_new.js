class lightning {
    constructor(x, y, rot, len, depth = 0) {
      this.x = x;
      this.y = y;
      this.rot = rot;
      this.len = len;
      this.depth = depth;
      this.boom = false;
      noiseSeed(40);
    }
  
    update() {
      if (this.y > height) {
        this.boom = true;
      }
    }
  
    draw() {
      push();
      translate(this.x, this.y);
      rotate(this.rot);
      stroke(255);
      strokeWeight(2);
      noFill();
      beginShape();
      for (let i = 0; i < this.len; i++) {
        vertex(i, noise(i * 0.05) * 5);
      }
      endShape();
  
      if (frameCount % 80 == 0 && !this.boom && this.depth < 10) {
        translate(this.len, noise((this.len + 1) * 0.05) * 5);
        // rotate(PI);
        // line(0,0,100,100)
        if (random(1) < 0.3) {
          let light = new lightning(
            0,
            0,
            random(-0.5, 0.5),
            random(50, 100),
            this.depth + 1
          );
          light.draw();
          light.update();
        }
  
        let light2 = new lightning(
          0,
          0,
          random(-0.5, 0.5),
          random(50, 100),
          this.depth + 1
        );
        light2.draw();
        light2.update();
        this.boom = true;
      }
      pop();
    }
  }

// Usage example
// light = new lightning(mouseX, -50, PI / 2, 50);