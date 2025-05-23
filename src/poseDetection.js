// 检测人
async function detectPeople() {
  try {
    // 使用COCO-SSD模型检测人
    const predictions = await cocoModel.detect(video.elt);
    
    // 过滤出人类预测结果
    const people = predictions.filter(prediction => prediction.class === 'person');
    
    // 最多处理两个人
    const detectedPeople = people.slice(0, 2);
    
    // 修正：更稳定的排序逻辑，避免玩家位置频繁切换
    if (detectedPeople.length === 2) {
      // 如果已经有现有的玩家数据，并且检测到了2个人
      if (detectedPeopleData.length === 2) {
        // 使用更稳定的匹配算法，基于距离匹配玩家
        const d1 = Math.sqrt(
          Math.pow(detectedPeople[0].bbox[0] - detectedPeopleData[0].x, 2) + 
          Math.pow(detectedPeople[0].bbox[1] - detectedPeopleData[0].y, 2)
        );
        
        const d2 = Math.sqrt(
          Math.pow(detectedPeople[0].bbox[0] - detectedPeopleData[1].x, 2) + 
          Math.pow(detectedPeople[0].bbox[1] - detectedPeopleData[1].y, 2)
        );
        
        // 如果当前检测的第一个人与上一帧的第二个人更接近，则交换顺序
        if (d2 < d1) {
          [detectedPeople[0], detectedPeople[1]] = [detectedPeople[1], detectedPeople[0]];
        }
      } else {
        // 初始情况，根据x坐标排序，左边的是player1(x值较小)，右边的是player2(x值较大)
        detectedPeople.sort((a, b) => a.bbox[0] - b.bbox[0]);
      }
    }
    
    // 清空之前的检测结果
    detectedPeopleData = [];
    
    // 重置玩家坐标 - 只在没有检测到人时重置
    if (detectedPeople.length === 0) {
      Player1_X = 0;
      Player1_Y = 0;
      Player2_X = 0;
      Player2_Y = 0;
    }
    
    // 处理检测结果，但不立即绘制边界框
    detectedPeople.forEach((person, index) => {
      const [x, y, w, h] = person.bbox;
      
      // 计算人的中心坐标
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      
      // 保存实际坐标
      if (index === 0) {
        // 画面左侧人是Player 1
        Player1_X = centerX;
        Player1_Y = centerY;
      } else {
        // 画面右侧人是Player 2
        Player2_X = centerX;
        Player2_Y = centerY;
      }
      
      // 保存检测数据供后续绘制使用
      detectedPeopleData.push({
        index: index,
        x: x,
        y: y,
        w: w,
        h: h,
        centerX: centerX,
        centerY: centerY
      });
    });
  } catch (error) {
    console.error("检测人类出错:", error);
  }
}

// 绘制人物中心点，不绘制边界框
function drawPeopleCenters() {
  // 遍历保存的检测数据进行绘制
  for (const person of detectedPeopleData) {
    // 绘制中心点
    noStroke();
    if (person.index === 0) {
      // Player 1 - 绿色中心点
      fill(0, 255, 0);
    } else {
      // Player 2 - 蓝色中心点
      fill(0, 0, 255);
    }
    ellipse(person.centerX, person.centerY, 15, 15);
    
    // 红色内部点，使中心点更明显
    fill(255, 0, 0);
    ellipse(person.centerX, person.centerY, 8, 8);
    
    // 显示玩家标签 - 调整到中心点上方
    fill(255);
    stroke(0);
    strokeWeight(1);
    textAlign(CENTER);
    text(`Player ${person.index + 1}`, person.centerX, person.centerY - 20);
  }
  
  // 绘制血条
  drawHealthBars();
}

// 绘制血条
function drawHealthBars() {
  const barWidth = 225;  // 血条宽度 - 从150增加到225 (1.5倍)
  const barHeight = 30;  // 血条高度 - 从20增加到30 (1.5倍)
  const margin = 15;     // 边距 - 从10增加到15 (1.5倍)
  
  // 绘制玩家1的血条 (左上角)
  drawPlayerHealthBar(margin, margin, barWidth, barHeight, HP_left, 300, "P1");
  
  // 绘制玩家2的血条 (右上角)
  drawPlayerHealthBar(width - margin - barWidth, margin, barWidth, barHeight, HP_right, 300, "P2");
}

// 绘制单个玩家的血条
function drawPlayerHealthBar(x, y, w, h, currentHP, maxHP, label) {
  const healthPercent = constrain(currentHP / maxHP, 0, 1);
  
  // 黄色外框
  stroke(255, 255, 0);
  strokeWeight(3); // 从2增加到3 (1.5倍)
  noFill();
  rect(x, y, w, h);
  
  // 红色血量
  noStroke();
  fill(255, 0, 0);
  rect(x, y, w * healthPercent, h);
  
  // 显示血量数值
  fill(255);
  stroke(0);
  strokeWeight(1.5); // 从1增加到1.5 (1.5倍)
  textAlign(CENTER, CENTER);
  textSize(21); // 从14增加到21 (1.5倍)
  text(`${label}: ${Math.round(currentHP)}/${maxHP}`, x + w/2, y + h/2);
}

// 检查碰撞 - 检查特效是否与玩家碰撞
function checkCollision(effectX, effectY, effectWidth, effectHeight, playerIndex) {
  // 如果没有足够的玩家数据，返回false
  if (detectedPeopleData.length <= playerIndex) return false;
  
  const player = detectedPeopleData[playerIndex];
  
  // 计算是否有重叠
  return (
    effectX < player.x + player.w &&
    effectX + effectWidth > player.x &&
    effectY < player.y + player.h &&
    effectY + effectHeight > player.y
  );
}

// 变量用于追踪血液特效是否已经触发
let bloodEffectTriggeredLeft = false;
let bloodEffectTriggeredRight = false;
// 添加变量跟踪最后受伤的玩家
let lastDamagedPlayer = -1;

// 对玩家造成伤害
function damagePlayer(playerIndex, amount, triggerExplosion = true) {
  let playerX, playerY;
  
  // 更新最后受伤的玩家
  lastDamagedPlayer = playerIndex;
  
  if (playerIndex === 0) {
    playerX = Player1_X;
    playerY = Player1_Y;
    HP_left -= amount;
    if (HP_left < 0) HP_left = 0;
    
    // 当血量低于100且特效尚未触发时，触发血液特效
    if (HP_left < 100 && !bloodEffectTriggeredLeft) {
      splatterActive = true;
      drawblood();
      bloodEffectTriggeredLeft = true;
      
      // 播放血液飞溅音效
      if (typeof playSound === "function") {
        playSound("blood");
      }
    }
    
    // 在受伤位置创建爆炸效果 - 仅当triggerExplosion为true时
    if (triggerExplosion && typeof Explosion === 'function' && playerX && playerY) {
      explosions.push(new Explosion(playerX, playerY));
    }
  } else {
    playerX = Player2_X;
    playerY = Player2_Y;
    HP_right -= amount;
    if (HP_right < 0) HP_right = 0;
    
    // 当血量低于100且特效尚未触发时，触发血液特效
    if (HP_right < 100 && !bloodEffectTriggeredRight) {
      splatterActive = true;
      drawblood();
      bloodEffectTriggeredRight = true;
      
      // 播放血液飞溅音效
      if (typeof playSound === "function") {
        playSound("blood");
      }
    }
    
    // 在受伤位置创建爆炸效果 - 仅当triggerExplosion为true时
    if (triggerExplosion && typeof Explosion === 'function' && playerX && playerY) {
      explosions.push(new Explosion(playerX, playerY));
    }
  }
}

// 显示姿势状态信息（这个函数可以被删除，因为已经在sketch.js中重新实现了）
function displayStateInfo() {
  // 这个函数现在由sketch.js中的displayStateInfo替代
  // 为了向后兼容，保留函数但不执行任何操作
}
