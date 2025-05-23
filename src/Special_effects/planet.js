class Planet {
    constructor(x, y, r, angle, texture) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.angle = angle;
      this.speed = 3;
      this.isFalling = true;
      this.explodeTime = 0;
      this.rotation = 0;
      this.rotationSpeed = 0.01;
      this.texture = texture; // 存储纹理图像
      
      // 如果没有提供纹理，创建行星的颜色和表面
      if (!this.texture) {
        // 创建行星的颜色
        this.color = {
          r: random(100, 200),
          g: random(100, 150),
          b: random(50, 100)
        };
        // 创建行星的表面纹理
        this.craterCount = floor(random(3, 8));
        this.craters = [];
        for (let i = 0; i < this.craterCount; i++) {
          this.craters.push({
            offsetX: random(-this.r * 0.6, this.r * 0.6),
            offsetY: random(-this.r * 0.6, this.r * 0.6),
            size: random(this.r * 0.1, this.r * 0.3),
            shade: random(0.2, 0.5)
          });
        }
      }
    }
  
    update() {
      // 更新旋转
      this.rotation += this.rotationSpeed;
      
      if (this.isFalling) {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
  
        if (this.y >= height - this.r) {
          this.y = height - this.r;
          this.isFalling = false;
          this.scheduleExplosion(1000); // Schedule explosion after 1 second
        }
      }
  
      // Check if it's time to explode
      if (this.explodeTime > 0 && millis() >= this.explodeTime) {
        this.explode();
        this.explodeTime = 0; // Reset to prevent multiple explosions
      }
    }
  
    show() {
      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      
      if (this.texture) {
        // 使用纹理图像绘制行星
        imageMode(CENTER);
        image(this.texture, 0, 0, this.r * 2, this.r * 2);
      } else {
        // 绘制行星主体
        fill(this.color.r, this.color.g, this.color.b);
        noStroke();
        ellipse(0, 0, this.r * 2);
        
        // 绘制行星表面纹理（陨石坑）
        for (let crater of this.craters) {
          fill(this.color.r * crater.shade, 
               this.color.g * crater.shade, 
               this.color.b * crater.shade);
          ellipse(crater.offsetX, crater.offsetY, crater.size);
        }
        
        // 添加简单的阴影效果
        noStroke();
        fill(0, 0, 0, 50);
        arc(0, 0, this.r * 2, this.r * 2, -HALF_PI, HALF_PI);
      }
      
      pop();
    }
  
    scheduleExplosion(delay) {
      this.explodeTime = millis() + delay;
    }
  
    explode() {
      let numParticles = 200; // Increased number of particles
      for (let i = 0; i < numParticles; i++) {
        let angle = random(TWO_PI);
        let speed = random(4, 8); // Increased speed for more dramatic effect
        let size = random(5, 10); // Larger particles for visibility
        
        let particleColor;
        if (this.texture) {
          // 使用默认粒子颜色
          particleColor = {
            r: 200 + random(-50, 50),
            g: 200 + random(-50, 50),
            b: 100 + random(-50, 50)
          };
        } else {
          particleColor = this.color;
        }
        
        particles.push(new Particle(this.x, this.y, angle, speed, size, particleColor));
      }
    }
  }
  
  // class Particle {
  //   constructor(x, y, angle, speed, size, planetColor) {
  //     this.x = x;
  //     this.y = y;
  //     this.angle = angle;
  //     this.speed = speed;
  //     this.size = size;
  //     this.life = 255;
  //     this.gravity = 0.1;
  //     this.friction = 0.98;
  //     this.velocity = createVector(cos(angle) * speed, sin(angle) * speed);
  //     // 继承行星的颜色但添加一些随机变化
  //     this.color = {
  //       r: planetColor.r + random(-20, 20),
  //       g: planetColor.g + random(-20, 20),
  //       b: planetColor.b + random(-20, 20)
  //     };
  //   }
  
  //   update() {
  //     this.velocity.mult(this.friction);
  //     this.velocity.y += this.gravity;
  //     this.x += this.velocity.x;
  //     this.y += this.velocity.y;
  //     this.life -= 2; // Slower fade-out
  //   }
  
  //   show() {
  //     noStroke();
  //     // 使用行星的颜色但透明度根据生命值变化
  //     fill(this.color.r, this.color.g, this.color.b, this.life);
  //     ellipse(this.x, this.y, this.size);
  //   }
  
  //   isFinished() {
  //     return this.life < 0;
  //   }
  // }