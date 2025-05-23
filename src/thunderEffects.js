// 创建持续的雷电特效，这个特效与闪电不同，代表持续的电流攻击
window.thundersP1 = [];
window.thundersP2 = [];

// 雷电发射计时器
window.thunderTimer1 = 0;
window.thunderTimer2 = 0;
window.thunderCooldown = 3000; // 3秒冷却时间

// 检查姿势持续时间并创建雷电
window.checkPoseDurationAndCreateThunders = function() {
  const currentTime = millis();
  
  // 检查thunder_l姿势(左侧玩家)
  if (poseStatesLeft && poseStatesLeft["thunder_l"]) {
    poseActivationTimeLeft["thunder_l"] += 1; // 每帧增加1
    
    // 确保玩家的姿势持续2秒(约120帧)并且冷却已过
    if (poseActivationTimeLeft["thunder_l"] >= 60 && Player1_X > 0 && currentTime - thunderTimer1 >= thunderCooldown) {
      console.log("Player 1 创建雷电");
      // 玩家1创建雷电
      window.createThunder(Player1_X, Player1_Y, 1);
      thunderTimer1 = currentTime; // 更新冷却时间
      poseActivationTimeLeft["thunder_l"] = 0; // 重置激活时间
    }
  }
  
  // 检查thunder_r姿势(右侧玩家)
  if (poseStatesRight && poseStatesRight["thunder_r"]) {
    poseActivationTimeRight["thunder_r"] += 1; // 每帧增加1
    
    // 确保玩家的姿势持续2秒(约120帧)并且冷却已过
    if (poseActivationTimeRight["thunder_r"] >= 60 && Player2_X > 0 && currentTime - thunderTimer2 >= thunderCooldown) {
      console.log("Player 2 创建雷电");
      // 玩家2创建雷电
      window.createThunder(Player2_X, Player2_Y, 2);
      thunderTimer2 = currentTime; // 更新冷却时间
      poseActivationTimeRight["thunder_r"] = 0; // 重置激活时间
    }
  }
};

// 创建雷电 - 使用Shell类而不是thunder类
window.createThunder = function(x, y, playerNumber) {
  // 使用Shell类创建雷电特效
  // 参数: x, y, minSize, maxSize, transparency, speed
  let minSize = 50;
  let maxSize = 100;
  let transparency = 150;
  let speed = 0.05;
  
  let shellObj = new Shell(x, y, minSize, maxSize, transparency, speed);
  
  // 添加属性以标识玩家和伤害值
  shellObj.playerNumber = playerNumber;
  shellObj.damage = 1; // 每帧伤害值
  shellObj.life = 60; // 生命周期，用于管理特效的持续时间
  shellObj.pos = { x: x, y: y }; // 位置属性，用于碰撞检测
  
  // 播放雷电音效
  if (typeof playSound === "function") {
    playSound("thunder");
  }
  
  // 添加到相应玩家的雷电数组
  if (playerNumber === 1) {
    window.thundersP1.push(shellObj);
  } else {
    window.thundersP2.push(shellObj);
  }
};

// 更新和显示所有雷电
window.updateAndDisplayThunders = function() {
  // 保存当前的变换状态
  push();
  
  // 更新和显示玩家1的雷电
  for (let i = window.thundersP1.length - 1; i >= 0; i--) {
    let shellObj = window.thundersP1[i];
    shellObj.update(); // 使用Shell类的update方法
    
    // 检测与玩家2的碰撞
    // 雷电的碰撞区域是一个垂直区域，考虑到Shell的特殊效果
    let hitAreaX = shellObj.x - 50; // 宽度大约100
    let hitAreaWidth = 100;
    let hitAreaY = shellObj.y - 50;
    let hitAreaHeight = 400; // 垂直高度
    
    // 检查是否与玩家2碰撞
    if (checkCollision(hitAreaX, hitAreaY, hitAreaWidth, hitAreaHeight, 1)) {
      // 初始化伤害标记
      if (shellObj.hasDamagedPlayer === undefined) {
        shellObj.hasDamagedPlayer = false;
      }
      
      // 对玩家2造成伤害，但只有第一次触发爆炸特效
      if (!shellObj.hasDamagedPlayer) {
        damagePlayer(1, shellObj.damage, true); // 传递第三个参数true表示触发爆炸效果
        shellObj.hasDamagedPlayer = true;
      } else {
        damagePlayer(1, shellObj.damage, false); // 后续伤害不触发爆炸效果
      }
    }
    
    // 管理雷电的生命周期
    shellObj.life--;
    if (shellObj.life <= 0) {
      window.thundersP1.splice(i, 1);
    }
  }
  
  // 更新和显示玩家2的雷电
  for (let i = window.thundersP2.length - 1; i >= 0; i--) {
    let shellObj = window.thundersP2[i];
    shellObj.update(); // 使用Shell类的update方法
    
    // 检测与玩家1的碰撞
    let hitAreaX = shellObj.x - 50; // 宽度大约100
    let hitAreaWidth = 100;
    let hitAreaY = shellObj.y - 50;
    let hitAreaHeight = 400; // 垂直高度
    
    // 检查是否与玩家1碰撞
    if (checkCollision(hitAreaX, hitAreaY, hitAreaWidth, hitAreaHeight, 0)) {
      // 初始化伤害标记
      if (shellObj.hasDamagedPlayer === undefined) {
        shellObj.hasDamagedPlayer = false;
      }
      
      // 对玩家1造成伤害，但只有第一次触发爆炸特效
      if (!shellObj.hasDamagedPlayer) {
        damagePlayer(0, shellObj.damage, true); // 传递第三个参数true表示触发爆炸效果
        shellObj.hasDamagedPlayer = true;
      } else {
        damagePlayer(0, shellObj.damage, false); // 后续伤害不触发爆炸效果
      }
    }
    
    // 管理雷电的生命周期
    shellObj.life--;
    if (shellObj.life <= 0) {
      window.thundersP2.splice(i, 1);
    }
  }
  
  // 恢复之前的变换状态
  pop();
};
