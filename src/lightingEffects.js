// 全局声明闪电数组
window.lightningsP1 = [];
window.lightningsP2 = [];

// 闪电发射计时器
window.lightningTimer1 = 0;
window.lightningTimer2 = 0;
window.lightningCooldown = 2000; // 2秒冷却时间

// 检查姿势持续时间并创建闪电
window.checkPoseDurationAndCreateLightnings = function() {
  const currentTime = millis();
  
  // 检查lighting_l姿势(左侧玩家)
  if (poseStatesLeft && poseStatesLeft["lighting_l"]) {
    poseActivationTimeLeft["lighting_l"] += 1; // 每帧增加1
    
    // 确保玩家的姿势持续1秒(约60帧)并且冷却已过
    if (poseActivationTimeLeft["lighting_l"] >= 30 && Player1_X > 0 && currentTime - lightningTimer1 >= lightningCooldown) {
      console.log("Player 1 创建闪电");
      // 玩家1创建闪电
      window.createLightning(random(40,600), -150, 1);
      lightningTimer1 = currentTime; // 更新冷却时间
      poseActivationTimeLeft["lighting_l"] = 0; // 重置激活时间
    }
  }
  
  // 检查lighting_r姿势(右侧玩家)
  if (poseStatesRight && poseStatesRight["lighting_r"]) {
    poseActivationTimeRight["lighting_r"] += 1; // 每帧增加1
    
    // 确保玩家的姿势持续1秒(约60帧)并且冷却已过
    if (poseActivationTimeRight["lighting_r"] >= 30 && Player2_X > 0 && currentTime - lightningTimer2 >= lightningCooldown) {
      console.log("Player 2 创建闪电");
      // 玩家2创建闪电
      window.createLightning(random(40,600), -150, 2);
      lightningTimer2 = currentTime; // 更新冷却时间
      poseActivationTimeRight["lighting_r"] = 0; // 重置激活时间
    }
  }
};

// 创建闪电
window.createLightning = function(x, y, playerNumber) {
  // 创建闪电参数
  const length = 250; // 闪电长度
  
  // 根据玩家确定闪电方向
  const angle = playerNumber === 1 ? 0 : PI; // 玩家1向右，玩家2向左
  
  // 使用现有的lightning类创建闪电实例
  // 参数: x, y, rot, len, depth
  let lightningObj = new lightning(x, y, PI / 2, length, 0);
  
  // 添加属性以跟踪伤害状态
  lightningObj.playerNumber = playerNumber;
  lightningObj.hasDamagedPlayer1 = false;
  lightningObj.hasDamagedPlayer2 = false;
  lightningObj.damage = 30; // 每次伤害值
  
  // 添加到相应玩家的闪电数组
  if (playerNumber === 1) {
    window.lightningsP1.push(lightningObj);
  } else {
    window.lightningsP2.push(lightningObj);
  }
};

// 更新和显示所有闪电
window.updateAndDisplayLightnings = function() {
  // 保存当前的变换状态
  push();
  
  // 更新和显示玩家1的闪电
  for (let i = window.lightningsP1.length - 1; i >= 0; i--) {
    let lightningObj = window.lightningsP1[i];
    lightningObj.update();
    lightningObj.draw();
    
    // 改进碰撞检测：使用垂直方向的碰撞区域，因为闪电是从上到下的
    // 闪电碰撞区域是一个垂直的矩形，从闪电起点到终点
    const hitAreaX = lightningObj.x - 25; // 碰撞区域宽度为50
    const hitAreaWidth = 50;
    const hitAreaY = lightningObj.y;
    const hitAreaHeight = height - lightningObj.y; // 从闪电位置到画布底部
    
    // 检测是否与玩家1碰撞（自己）
    if (!lightningObj.hasDamagedPlayer1 && checkCollision(hitAreaX, hitAreaY, hitAreaWidth, hitAreaHeight, 0)) {
      damagePlayer(0, lightningObj.damage);
      lightningObj.hasDamagedPlayer1 = true;
      console.log("玩家1闪电击中玩家1，造成伤害:", lightningObj.damage);
      
      // 播放闪电击中音效
      if (typeof playSound === "function") {
        playSound("lighting");
      }
    }
    
    // 检测是否与玩家2碰撞
    if (!lightningObj.hasDamagedPlayer2 && checkCollision(hitAreaX, hitAreaY, hitAreaWidth, hitAreaHeight, 1)) {
      damagePlayer(1, lightningObj.damage);
      lightningObj.hasDamagedPlayer2 = true;
      console.log("玩家1闪电击中玩家2，造成伤害:", lightningObj.damage);
      
      // 播放闪电击中音效
      if (typeof playSound === "function") {
        playSound("lighting");
      }
    }
    
    // 检查闪电是否已消亡（使用boom属性）
    if (lightningObj.boom) {
      window.lightningsP1.splice(i, 1);
    }
  }
  
  // 更新和显示玩家2的闪电
  for (let i = window.lightningsP2.length - 1; i >= 0; i--) {
    let lightningObj = window.lightningsP2[i];
    lightningObj.update();
    lightningObj.draw();
    
    // 改进碰撞检测：使用垂直方向的碰撞区域
    const hitAreaX = lightningObj.x - 25; // 碰撞区域宽度为50
    const hitAreaWidth = 50;
    const hitAreaY = lightningObj.y;
    const hitAreaHeight = height - lightningObj.y; // 从闪电位置到画布底部
    
    // 检测是否与玩家1碰撞
    if (!lightningObj.hasDamagedPlayer1 && checkCollision(hitAreaX, hitAreaY, hitAreaWidth, hitAreaHeight, 0)) {
      damagePlayer(0, lightningObj.damage);
      lightningObj.hasDamagedPlayer1 = true;
      console.log("玩家2闪电击中玩家1，造成伤害:", lightningObj.damage);
      
      // 播放闪电击中音效
      if (typeof playSound === "function") {
        playSound("lighting");
      }
    }
    
    // 检测是否与玩家2碰撞（自己）
    if (!lightningObj.hasDamagedPlayer2 && checkCollision(hitAreaX, hitAreaY, hitAreaWidth, hitAreaHeight, 1)) {
      damagePlayer(1, lightningObj.damage);
      lightningObj.hasDamagedPlayer2 = true;
      console.log("玩家2闪电击中玩家2，造成伤害:", lightningObj.damage);
      
      // 播放闪电击中音效
      if (typeof playSound === "function") {
        playSound("lighting");
      }
    }
    
    // 检查闪电是否已消亡（使用boom属性）
    if (lightningObj.boom) {
      window.lightningsP2.splice(i, 1);
    }
  }
  
  // 恢复之前的变换状态
  pop();
};
