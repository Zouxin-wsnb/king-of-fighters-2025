function renderSplatter(splatterObj, splatterBaseColor) {
    let currentSplatterColor = color(
      red(splatterBaseColor),
      green(splatterBaseColor),
      blue(splatterBaseColor),
      splatterObj.alpha // Use alpha from the splatter object
    );
  
    push(); // Isolate transformations for this entire splatter complex
    translate(splatterObj.x, splatterObj.y); // Translate to the splatter's main origin
  
    // Loop through each element of the splatter
    for (let el of splatterObj.elements) {
      fill(currentSplatterColor);
      noStroke();
      push(); // Isolate transformations for this individual element
      translate(el.relX, el.relY);
      rotate(el.rotation);
      ellipse(0, 0, el.sizeX, el.sizeY);
      pop(); // Restore transformation state for the next element
    }
    pop(); // Restore transformation state for the next splatter
  }
  // --- End of new renderSplatter function ---
  
  function drawblood() {
  
    if (splatterActive) {
      // --- Splatter Creation Logic (modified for player position) ---
      for (let i = 0; i < splatterDensity; i++) {
        // 根据最后受伤的玩家决定血液效果的位置
        let x, y;
        if (lastDamagedPlayer === 0) {
          // 左侧玩家受伤，在左侧显示血液效果
          x = width * 0.25; // 屏幕左侧四分之一处
          y = height * 0.5; // 垂直居中
        } else {
          // 右侧玩家受伤，在右侧显示血液效果
          x = width * 0.75; // 屏幕右侧四分之一处
          y = height * 0.5; // 垂直居中
        }
        
        // 减小血液范围
        let screenDiagonal = sqrt(width * width + height * height);
        let baseOverallSize = screenDiagonal * 0.6;
        let elements = [];
  
        // 1. Dense Core Elements - 减少数量和范围
        let numCoreElements = 60; // 减少核心元素数量
        let coreSpreadFactor = baseOverallSize * 0.2; // 减小核心扩散因子
        for (let j = 0; j < numCoreElements; j++) {
          let angle = random(TWO_PI);
          let dist = random(coreSpreadFactor) * random();
          let eX = cos(angle) * dist;
          let eY = sin(angle) * dist;
          // 减小元素大小
          let eSize = random(baseOverallSize * 0.01, baseOverallSize * 0.05);
          elements.push({
            type: 'ellipse',
            relX: eX,
            relY: eY,
            sizeX: eSize,
            sizeY: eSize * random(0.7, 1.3),
            rotation: random(TWO_PI)
          });
        }
  
        // 2. Radiating Streaks & Trailing Dots - 减少数量和长度
        let numStreaks = int(random(20, 40)); // 减少射线数量
        for (let j = 0; j < numStreaks; j++) {
          let streakAngle = random(TWO_PI);
          // 减小射线长度
          let streakLength = baseOverallSize * 0.4 * random(0.4, 1.0);
          let initialOffset = baseOverallSize * 0.02 * random(0.5, 1.0);
          let currentDist = initialOffset;
          let currentSize = random(baseOverallSize * 0.01, baseOverallSize * 0.04);
          let numSegments = int(random(3, 10)); // 减少线段数量
          for (let k = 0; k < numSegments; k++) {
            if (currentSize < 1) break;
            let eX = cos(streakAngle) * currentDist;
            let eY = sin(streakAngle) * currentDist;
            elements.push({
              type: 'ellipse',
              relX: eX,
              relY: eY,
              sizeX: currentSize,
              sizeY: currentSize * random(0.4, 2.0),
              rotation: streakAngle + HALF_PI
            });
            currentDist += currentSize * random(1.0, 2.5) + baseOverallSize * 0.004;
            currentSize *= random(0.65, 0.9);
          }
        }
  
        // 3. Scattered Outer Droplets - 减少数量和范围
        let numOuterDroplets = int(random(80, 150)); // 减少外围液滴数量
        let outerSpreadFactorMin = baseOverallSize * 0.1;
        let outerSpreadFactorMax = baseOverallSize * 0.4; // 减小外围扩散范围
        for (let j = 0; j < numOuterDroplets; j++) {
          let angle = random(TWO_PI);
          let dist = sqrt(random()) * outerSpreadFactorMax;
          if (dist < outerSpreadFactorMin) dist = outerSpreadFactorMin + (dist % (outerSpreadFactorMax - outerSpreadFactorMin));
          let eX = cos(angle) * dist;
          let eY = sin(angle) * dist;
          // 减小液滴大小
          let eSize = random(baseOverallSize * 0.004, baseOverallSize * 0.02);
          elements.push({
            type: 'ellipse',
            relX: eX,
            relY: eY,
            sizeX: eSize,
            sizeY: eSize * random(0.7, 1.3),
            rotation: random(TWO_PI)
          });
        }
  
        splatters.push({
          x: x, // 使用根据玩家位置确定的坐标
          y: y,
          alpha: 255,
          elements: elements,
        });
      }
      splatterActive = false;
      // --- End of Splatter Creation Logic ---
    }
  
    // Update and draw all splatters - 加快衰减速度
    for (let i = splatters.length - 1; i >= 0; i--) {
      let s = splatters[i];
  
      // Call the new function to draw the current splatter
      renderSplatter(s, baseSplatterColor);
  
      // 加快透明度减少速度，使血液效果更快消失
      s.alpha -= fadeSpeed * 2.5; // 增加衰减速度为原来的2.5倍
      if (s.alpha <= 0) {
        splatters.splice(i, 1);
      }
    }
  }
