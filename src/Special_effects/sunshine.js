class Sunshine {
    constructor(x, y, numLines = 1000, maxOpacity = 255) {
      this.x = x;
      this.y = y;
      this.numLines = numLines;
      this.maxOpacity = maxOpacity;
      this.maxLength = 2 * width + height; // Length of lines
    }
  
    draw() {
      for (let i = 0; i < this.numLines; i++) {
        let angle = random(TWO_PI);
        let distance = random(this.maxLength);
        let opacity = map(distance, 0, this.maxLength, this.maxOpacity, 0); // Opacity decreases with distance
  
        // Calculate the end point of the line
        let x2 = this.x + cos(angle) * distance;
        let y2 = this.y + sin(angle) * distance;
  
        // Draw the line from the center to the calculated point
        stroke(255, opacity);
        strokeWeight(2);
        line(this.x, this.y, x2, y2);
      }
    }
  }