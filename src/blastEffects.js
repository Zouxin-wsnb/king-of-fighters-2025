// 能量爆炸数组
window.blastsP1 = []; // 玩家1的能量爆炸
window.blastsP2 = []; // 玩家2的能量爆炸

// 能量爆炸发射计时器和计数器
window.blastTimer1 = 0;
window.blastTimer2 = 0;
window.blastCooldown = 1500; // 1.5秒冷却时间
window.blastCount1 = 0; // 玩家1爆炸计数
window.blastCount2 = 0; // 玩家2爆炸计数
window.maxBlastCount = 10; // 最大爆炸数量

// 检查姿势持续时间并创建能量爆炸
window.checkPoseDurationAndCreateBlasts = function() {
  const currentTime = millis();
  
  // 检查blast_l姿势(左侧玩家)
  if (poseStatesLeft && poseStatesLeft["blast_l"]) {
    poseActivationTimeLeft["blast_l"] += 1; // 每帧增加1
    
    // 确保玩家的姿势持续1.5秒(约90帧)并且冷却已过
    if (poseActivationTimeLeft["blast_l"] >= 60 && Player1_X > 0 && currentTime - blastTimer1 >= blastCooldown) {
      console.log("Player 1 创建能量爆炸");
      // 玩家1向右发射能量爆炸
      window.createBlast(Player1_X, Player1_Y, "right", 1);
      blastTimer1 = currentTime; // 更新冷却时间
      poseActivationTimeLeft["blast_l"] = 0; // 重置激活时间
    }
  }
  
  // 检查blast_r姿势(右侧玩家)
  if (poseStatesRight && poseStatesRight["blast_r"]) {
    poseActivationTimeRight["blast_r"] += 1; // 每帧增加1
    
    // 确保玩家的姿势持续1.5秒(约90帧)并且冷却已过
    if (poseActivationTimeRight["blast_r"] >= 60 && Player2_X > 0 && currentTime - blastTimer2 >= blastCooldown) {
      console.log("Player 2 创建能量爆炸");
      // 玩家2向左发射能量爆炸
      window.createBlast(Player2_X, Player2_Y, "left", 2);
      blastTimer2 = currentTime; // 更新冷却时间
      poseActivationTimeRight["blast_r"] = 0; // 重置激活时间
    }
  }
};

// 创建能量爆炸
window.createBlast = function(x, y, direction, playerNumber) {
  // 设置能量爆炸的参数，使其贯穿画布
  const maxLength = width * 2; // 长度足够贯穿整个画布
  const thickness = 40;  // 厚度
  const growthRate = 20; // 增大增长速率，使其快速贯穿
  const fadeDuration = 30; // 淡出持续时间（帧）
  
  // 设置方向（1为向右，-1为向左）
  const directionValue = direction === "right" ? 1 : -1;
  
  // 使用EnergyBlast类创建爆炸实例 (而不是使用小写blast)
  let blastObj = new EnergyBlast(x, y, maxLength, thickness, growthRate, fadeDuration, directionValue);
  
  // 添加伤害相关属性
  blastObj.playerNumber = playerNumber;
  blastObj.damage = 0.5; // 每帧造成的伤害
  blastObj.currentLength = 0; // 追踪当前长度，用于碰撞检测
  
  // 播放爆炸音效
  if (typeof playSound === "function") {
    playSound("blast");
  }
  
  // 添加到相应玩家的能量爆炸数组
  if (playerNumber === 1) {
    window.blastsP1.push(blastObj);
    window.blastCount1++; // 增加爆炸计数
    if (window.blastCount1 > window.maxBlastCount) {
      window.blastsP1.shift(); // 移除最旧的爆炸
    }
  } else {
    window.blastsP2.push(blastObj);
    window.blastCount2++; // 增加爆炸计数
    if (window.blastCount2 > window.maxBlastCount) {
      window.blastsP2.shift(); // 移除最旧的爆炸
    }
  }
};

// 更新和显示所有能量爆炸
window.updateAndDisplayBlasts = function() {
  // 保存当前的变换状态
  push();
  
  // 更新和显示玩家1的能量爆炸
  for (let i = window.blastsP1.length - 1; i >= 0; i--) {
    let blast = window.blastsP1[i];
    blast.update();
    blast.draw();
    
    // 更新当前长度用于碰撞检测
    blast.currentLength = blast.length;
    
    // 检测爆炸是否与玩家2碰撞
    // 能量爆炸是一条线，需要根据其属性计算碰撞
    let blastStartX = blast.x;
    let blastEndX = blast.x + blast.currentLength * blast.direction;
    let blastY = blast.y;
    let blastThickness = blast.thickness;
    
    // 对玩家2检测碰撞
    if (detectedPeopleData.length > 1) {
      const player2 = detectedPeopleData[1];
      // 计算是否有碰撞
      if (
        (blast.direction > 0 && player2.x < blastEndX && player2.x + player2.w > blastStartX) ||
        (blast.direction < 0 && player2.x + player2.w > blastEndX && player2.x < blastStartX)
      ) {
        // 垂直方向上的碰撞检测
        if (player2.y < blastY + blastThickness/2 && player2.y + player2.h > blastY - blastThickness/2) {
          // 初始化伤害标记
          if (blast.hasDamagedPlayer === undefined) {
            blast.hasDamagedPlayer = false;
          }
          
          // 每帧造成伤害，但只有首次触发爆炸效果
          if (!blast.hasDamagedPlayer) {
            damagePlayer(1, blast.damage, true);
            blast.hasDamagedPlayer = true;
          } else {
            damagePlayer(1, blast.damage, false);
          }
        }
      }
    }
    
    // 检查是否已淡出
    if (blast.isFinished()) {
      window.blastsP1.splice(i, 1);
    }
  }
  
  // 更新和显示玩家2的能量爆炸
  for (let i = window.blastsP2.length - 1; i >= 0; i--) {
    let blast = window.blastsP2[i];
    blast.update();
    blast.draw();
    
    // 更新当前长度用于碰撞检测
    blast.currentLength = blast.length;
    
    // 检测爆炸是否与玩家1碰撞
    let blastStartX = blast.x;
    let blastEndX = blast.x + blast.currentLength * blast.direction;
    let blastY = blast.y;
    let blastThickness = blast.thickness;
    
    // 对玩家1检测碰撞
    if (detectedPeopleData.length > 0) {
      const player1 = detectedPeopleData[0];
      // 计算是否有碰撞
      if (
        (blast.direction > 0 && player1.x < blastEndX && player1.x + player1.w > blastStartX) ||
        (blast.direction < 0 && player1.x + player1.w > blastEndX && player1.x < blastStartX)
      ) {
        // 垂直方向上的碰撞检测
        if (player1.y < blastY + blastThickness/2 && player1.y + player1.h > blastY - blastThickness/2) {
          // 初始化伤害标记
          if (blast.hasDamagedPlayer === undefined) {
            blast.hasDamagedPlayer = false;
          }
          
          // 每帧造成伤害，但只有首次触发爆炸效果
          if (!blast.hasDamagedPlayer) {
            damagePlayer(0, blast.damage, true);
            blast.hasDamagedPlayer = true;
          } else {
            damagePlayer(0, blast.damage, false);
          }
        }
      }
    }
    
    // 检查是否已淡出
    if (blast.isFinished()) {
      window.blastsP2.splice(i, 1);
    }
  }
  
  // 恢复之前的变换状态
  pop();
};
