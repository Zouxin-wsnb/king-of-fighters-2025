// 全局声明火焰粒子数组
window.flamesP1 = [];
window.flamesP2 = [];

// 全局变量用于粒子颜色
window.rS = 255; // 红色分量
window.gS = 100; // 绿色分量
window.bS = 50;  // 蓝色分量

// 玩家火焰冷却状态
window.player1CanShoot = true;
window.player2CanShoot = true;

// 检查姿势持续时间并创建火焰
window.checkPoseDurationAndCreateFlames = function() {
  // 检查fire_l姿势(左侧玩家)
  if (poseStatesLeft && poseStatesLeft["fire_l"]) {
    poseActivationTimeLeft["fire_l"] += 1; // 每帧增加1
    
    // 如果持续0.5秒(约30帧)且玩家1可以发射
    if (poseActivationTimeLeft["fire_l"] >= 40 && player1CanShoot && Player1_X > 0) {
      console.log("Player 1 创建火焰");
      // 玩家1向右发射火焰
      createFlame(Player1_X, Player1_Y, "right", 1);
      player1CanShoot = false;
      poseActivationTimeLeft["fire_l"] = 0; // 重置计时器
    }
  } else {
    // 不要在这里重置激活时间，让它在UI中能够正确显示
  }
  
  // 检查fire_r姿势(右侧玩家)
  if (poseStatesRight && poseStatesRight["fire_r"]) {
    poseActivationTimeRight["fire_r"] += 1; // 每帧增加1
    
    // 如果持续0.5秒(约30帧)且玩家2可以发射
    if (poseActivationTimeRight["fire_r"] >= 40 && player2CanShoot && Player2_X > 0) {
      console.log("Player 2 创建火焰");
      // 玩家2向左发射火焰
      createFlame(Player2_X, Player2_Y, "left", 2);
      player2CanShoot = false;
      poseActivationTimeRight["fire_r"] = 0; // 重置计时器
    }
  } else {
    // 不要在这里重置激活时间，让它在UI中能够正确显示
  }
};

// 创建火焰
window.createFlame = function(x, y, direction, playerNumber) {
  // 创建一个发射器实例，而不是旧的Flame类
  let emitter = new Emitter(x, y);
  
  // 根据玩家设置不同的颜色
  if (playerNumber === 1) {
    window.rS = 200; // 玩家1使用红色火焰
    window.gS = 75;
    window.bS = 0;
  } else {
    window.rS = 93;  // 玩家2使用蓝色火焰
    window.gS = 255;
    window.bS = 215;
  }
  
  // 播放火焰音效
  if (typeof playSound === "function") {
    playSound("fire");
  }
  
  // 初始发射一些粒子
  emitter.emit(100);
  
  // 设置移动方向为属性
  emitter.moveDirection = direction;
  emitter.moveSpeed = 1; // 移动速度
  
  // 添加伤害相关属性
  emitter.playerNumber = playerNumber;
  emitter.hasDamaged = false; // 是否已经造成过伤害
  emitter.damage = 20; // fire造成的伤害
  
  // 添加到对应玩家的火焰数组
  if (playerNumber === 1) {
    window.flamesP1.push(emitter);
  } else {
    window.flamesP2.push(emitter);
  }
};

// 更新和显示所有火焰
window.updateAndDisplayFlames = function() {
  // 设置混合模式为ADD，使粒子颜色叠加更明亮
  push();
  blendMode(ADD);
  
  // 更新和显示玩家1的火焰
  for (let i = window.flamesP1.length - 1; i >= 0; i--) {
    let flame = window.flamesP1[i];
    flame.update();
    
    // 根据移动方向应用力
    let force;
    if (flame.moveDirection === "right") {
      force = createVector(flame.moveSpeed * 0.1, 0);
    } else {
      force = createVector(-flame.moveSpeed * 0.1, 0);
    }
    flame.applyBodyForce(force);
    
    // 添加向上的力，模拟火焰上升
    flame.applyForce(createVector(0, -0.05));
    
    // 定期发射新粒子
    if (frameCount % 1 === 0) {
      flame.emit(100);
    }
    
    flame.show();
    
    // 检测火焰是否与对方玩家碰撞
    // 火焰粒子范围大约是80x80，以发射器位置为中心
    const hitArea = 80;
    if (!flame.hasDamaged && checkCollision(flame.position.x - hitArea/2, flame.position.y - hitArea/2, hitArea, hitArea, 1)) {
      // 玩家1的火焰击中玩家2
      damagePlayer(1, flame.damage);
      flame.hasDamaged = true; // 标记为已造成伤害
      console.log("玩家1火焰击中玩家2，造成伤害:", flame.damage);
      window.flamesP1.splice(i, 1); // 火焰消失
      continue; // 继续下一次循环
    }

    window.player1CanShoot = true;
    
    // 检查是否碰到边界或粒子全部消失
    if (flame.position.x < 0 || flame.position.x > width || flame.particles.length === 0) {
      window.flamesP1.splice(i, 1);
      // 如果没有火焰了，玩家1可以再次发射
      if (window.flamesP1.length === 0) {
        window.player1CanShoot = true;
      }
    }
  }
  
  // 更新和显示玩家2的火焰
  for (let i = window.flamesP2.length - 1; i >= 0; i--) {
    let flame = window.flamesP2[i];
    flame.update();
    
    // 根据移动方向应用力
    let force;
    if (flame.moveDirection === "right") {
      force = createVector(flame.moveSpeed * 0.1, 0);
    } else {
      force = createVector(-flame.moveSpeed * 0.1, 0);
    }
    flame.applyBodyForce(force);
    
    // 添加向上的力，模拟火焰上升
    flame.applyForce(createVector(0, -0.05));
    
    // 定期发射新粒子
    if (frameCount % 3 === 0) {
      flame.emit(100);
    }
    
    flame.show();
    
    // 检测火焰是否与对方玩家碰撞
    // 火焰粒子范围大约是80x80，以发射器位置为中心
    const hitArea = 80;
    if (!flame.hasDamaged && checkCollision(flame.position.x - hitArea/2, flame.position.y - hitArea/2, hitArea, hitArea, 0)) {
      // 玩家2的火焰击中玩家1
      damagePlayer(0, flame.damage);
      flame.hasDamaged = true; // 标记为已造成伤害
      console.log("玩家2火焰击中玩家1，造成伤害:", flame.damage);
      window.flamesP2.splice(i, 1); // 火焰消失
      continue; // 继续下一次循环
    }
    
    // 检查是否碰到边界或粒子全部消失
    if (flame.position.x < 0 || flame.position.x > width || flame.particles.length === 0) {
      window.flamesP2.splice(i, 1);
      // 如果没有火焰了，玩家2可以再次发射
      if (window.flamesP2.length === 0) {
        window.player2CanShoot = true;
      }
    }
  }
  
  // 恢复默认混合模式
  pop();
};
