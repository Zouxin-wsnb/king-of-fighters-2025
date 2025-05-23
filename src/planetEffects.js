// 定义行星系统
let planets = [];
let maxPlanets = 20;

// 添加行星纹理
let planetTextures = [];

// 预加载行星纹理（更改为不使用纹理图片）
function preloadPlanetTextures() {
  console.log("行星系统初始化 - 使用ShiningPlanet");
}

// 创建新的行星
function createPlanet(x, y, direction, playerNum) {
  // 如果行星数量已经达到最大值，不再创建
  if (planets.length >= maxPlanets) return;
  
  console.log(`创建行星 - 来自玩家${playerNum}`);
  
  let startX, startY;
  let targetX, targetY;
  
  // 根据玩家设置起始点和目标点
  if (playerNum === 1) {
    // 左侧玩家 - 从左上角发射，指向右侧玩家
    startX = 50;  // 左上角位置X
    startY = 50;  // 左上角位置Y
    targetX = Player2_X; // 右侧玩家X坐标
    targetY = Player2_Y; // 右侧玩家Y坐标
  } else {
    // 右侧玩家 - 从右上角发射，指向左侧玩家
    startX = width - 50; // 右上角位置X
    startY = 50;         // 右上角位置Y
    targetX = Player1_X; // 左侧玩家X坐标
    targetY = Player1_Y; // 左侧玩家Y坐标
  }
  
  // 计算方向向量
  let directionVector = createVector(targetX - startX, targetY - startY);
  // 标准化向量并设置速度
  directionVector.normalize();
  let speed = random(4, 7);
  let vx = directionVector.x * speed;
  let vy = directionVector.y * speed;
  
  // 添加一些随机性
  vx += random(-0.5, 0.5);
  vy += random(-0.5, 0.5);
  
  // 随机确定行星大小
  const size = random(60, 100);
  
  // 根据玩家选择颜色
  let baseClr, glowClr, highlightClr, sparkleClr;
  
  if (playerNum === 1) {
    // 左侧玩家 - 使用红色系
    baseClr = color(random(150, 200), random(20, 50), random(20, 50), 255);
    glowClr = color(random(200, 255), random(50, 100), random(50, 100), 150);
  } else {
    // 右侧玩家 - 使用蓝色系
    baseClr = color(random(20, 50), random(50, 100), random(150, 200), 255);
    glowClr = color(random(50, 100), random(100, 150), random(200, 255), 150);
  }
  
  highlightClr = color(200, 200, 255, 200);
  sparkleClr = color(255, 255, 255, 230);
  
  // 创建新的发光行星，使用计算出的起始点
  const planet = new ShiningPlanet(startX, startY, size, baseClr, glowClr, highlightClr, sparkleClr, vx, vy);
  
  // 将行星添加到数组
  planets.push({
    planet: planet,
    playerNum: playerNum, // 添加创建者信息用于检测碰撞
    damage: 60 + floor(size / 2)  // 根据大小确定伤害值
  });
}

// 更新和显示所有行星
function updateAndDisplayPlanets() {
  // 遍历所有行星
  for (let i = planets.length - 1; i >= 0; i--) {
    const planetObj = planets[i];
    
    // 更新行星位置
    planetObj.planet.update();
    
    // 显示行星
    planetObj.planet.display();
    
    // 检查是否超出屏幕 - 如果超出则移除
    if (planetObj.planet.isOffscreen()) {
      planets.splice(i, 1);
      continue;
    }
    
    // 检查与玩家的碰撞
    const opponentIndex = planetObj.playerNum === 1 ? 1 : 0; // 获取对手索引
    
    // 获取行星的坐标和尺寸用于碰撞检测
    const planetX = planetObj.planet.pos.x - planetObj.planet.size/2;
    const planetY = planetObj.planet.pos.y - planetObj.planet.size/2;
    const planetSize = planetObj.planet.size;
    
    // 检查与对手的碰撞
    if (checkCollision(planetX, planetY, planetSize, planetSize, opponentIndex)) {
      console.log(`行星击中玩家${opponentIndex + 1}`);
      
      // 播放行星击中音效
      if (typeof playSound === "function") {
        playSound("planet");
      }
      
      // 造成伤害
      damagePlayer(opponentIndex, planetObj.damage);
      
      // 移除行星
      planets.splice(i, 1);
    }
  }
}

// 检查姿势持续时间并创建行星
function checkPoseDurationAndCreatePlanets() {
  // 检查左侧玩家的行星姿势
  const leftPlanetPose = "planet_l";
  if (poseStatesLeft[leftPlanetPose] && poseActivationTimeLeft[leftPlanetPose] >= 80) {
    // 创建从左上角发出的行星，指向右侧玩家
    createPlanet(Player1_X, Player1_Y, "target", 1);
    // 重置持续时间计数器
    poseActivationTimeLeft[leftPlanetPose] = 0;
  }
  
  // 检查右侧玩家的行星姿势
  const rightPlanetPose = "planet_r";
  if (poseStatesRight[rightPlanetPose] && poseActivationTimeRight[rightPlanetPose] >= 80) {
    // 创建从右上角发出的行星，指向左侧玩家
    createPlanet(Player2_X, Player2_Y, "target", 2);
    // 重置持续时间计数器
    poseActivationTimeRight[rightPlanetPose] = 0;
  }
}
