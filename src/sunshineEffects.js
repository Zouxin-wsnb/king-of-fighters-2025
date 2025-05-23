// 阳光特效数组
window.sunshinesP1 = [];
window.sunshinesP2 = [];

// 阳光发射计时器和设置
window.sunshineTimer1 = 0;
window.sunshineTimer2 = 0;
window.sunshineCooldown = 5000; // 5秒冷却时间

// 检查姿势持续时间并创建阳光
window.checkPoseDurationAndCreateSunshines = function() {
  const currentTime = millis();
  
  // 检查sunshine_l姿势(左侧玩家)
  const leftSunshinePose = "sunshine_l";
  if (poseStatesLeft && poseStatesLeft[leftSunshinePose]) {
    poseActivationTimeLeft[leftSunshinePose] += 1; // 每帧增加1
    
    // 确保玩家的姿势持续3秒(约180帧)并且冷却已过
    if (poseActivationTimeLeft[leftSunshinePose] >= 120 && Player1_X > 0 && currentTime - sunshineTimer1 >= sunshineCooldown) {
      console.log("Player 1 创建阳光");
      // 玩家1创建阳光
      window.createSunshine(Player1_X, 0, 1);
      sunshineTimer1 = currentTime; // 更新冷却时间
      poseActivationTimeLeft[leftSunshinePose] = 0; // 重置激活时间
    }
  }
  
  // 检查sunshine_r姿势(右侧玩家)
  const rightSunshinePose = "sunshine_r";
  if (poseStatesRight && poseStatesRight[rightSunshinePose]) {
    poseActivationTimeRight[rightSunshinePose] += 1; // 每帧增加1
    
    // 确保玩家的姿势持续3秒(约180帧)并且冷却已过
    if (poseActivationTimeRight[rightSunshinePose] >= 120 && Player2_X > 0 && currentTime - sunshineTimer2 >= sunshineCooldown) {
      console.log("Player 2 创建阳光");
      // 玩家2创建阳光
      window.createSunshine(Player2_X, 0, 2);
      sunshineTimer2 = currentTime; // 更新冷却时间
      poseActivationTimeRight[rightSunshinePose] = 0; // 重置激活时间
    }
  }
};

// 创建阳光
window.createSunshine = function(x, y, playerNumber) {
  // 使用正确类名的Sunshine类创建阳光
  // 确认我们使用的是Special_effects/sunshine.js中定义的Sunshine类（注意大写S）
  let sunshineObj = new Sunshine(x, y);
  
  // 添加属性以标识玩家和伤害数据
  sunshineObj.playerNumber = playerNumber;
  sunshineObj.damage = 2; // 每帧伤害值
  sunshineObj.life = 100; // 持续100帧，约1.7秒
  
  // 特效创建时播放音效(改为只播放一次)
  if (typeof playSound === "function") {
    playSound("sunshine");
  }
  
  // 添加到相应玩家的阳光数组
  if (playerNumber === 1) {
    window.sunshinesP1.push(sunshineObj);
  } else {
    window.sunshinesP2.push(sunshineObj);
  }
};

// 更新和显示所有阳光
window.updateAndDisplaySunshines = function() {
  // 保存当前的变换状态
  push();
  
  // 更新和显示玩家1的阳光，并对玩家2造成伤害
  for (let i = window.sunshinesP1.length - 1; i >= 0; i--) {
    let sunshineObj = window.sunshinesP1[i];
    // 使用draw方法而不是update和display方法
    sunshineObj.draw();
    
    // 阳光存在时，对玩家2造成伤害，但爆炸特效只在首次触发
    if (detectedPeopleData.length > 1) {
      // 添加标记确保爆炸效果只出现一次
      if (!sunshineObj.hasTriggeredEffect) {
        damagePlayer(1, sunshineObj.damage, true); // 传递第三个参数true表示触发爆炸效果
        sunshineObj.hasTriggeredEffect = true;
      } else {
        damagePlayer(1, sunshineObj.damage, false); // 后续伤害不触发爆炸效果
      }
    }
    
    // 管理阳光的生命周期
    sunshineObj.life--;
    if (sunshineObj.life <= 0) {
      window.sunshinesP1.splice(i, 1);
    }
  }
  
  // 更新和显示玩家2的阳光，并对玩家1造成伤害
  for (let i = window.sunshinesP2.length - 1; i >= 0; i--) {
    let sunshineObj = window.sunshinesP2[i];
    // 使用draw方法而不是update和display方法
    sunshineObj.draw();
    
    // 阳光存在时，对玩家1造成伤害，但爆炸特效只在首次触发
    if (detectedPeopleData.length > 0) {
      // 添加标记确保爆炸效果只出现一次
      if (!sunshineObj.hasTriggeredEffect) {
        damagePlayer(0, sunshineObj.damage, true); // 传递第三个参数true表示触发爆炸效果
        sunshineObj.hasTriggeredEffect = true;
      } else {
        damagePlayer(0, sunshineObj.damage, false); // 后续伤害不触发爆炸效果
      }
    }
    
    // 管理阳光的生命周期
    sunshineObj.life--;
    if (sunshineObj.life <= 0) {
      window.sunshinesP2.splice(i, 1);
    }
  }
  
  // 恢复之前的变换状态
  pop();
};
