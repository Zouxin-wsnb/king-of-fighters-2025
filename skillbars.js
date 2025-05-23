// 创建技能进度条系统

// 初始化技能进度条
function setupSkillBars() {
  // 创建容器
  createSkillBarContainer("left-skillbars", "left");
  createSkillBarContainer("right-skillbars", "right");
  
  // 监听窗口大小变化以重新定位进度条
  window.addEventListener('resize', positionSkillBars);
}

// 创建技能条容器
function createSkillBarContainer(id, side) {
  // 检查是否已存在
  let container = document.getElementById(id);
  if (container) {
    container.innerHTML = '';
  } else {
    container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
  }
  
  // 设置基本样式 - 调整宽度为原来的1.5倍
  container.style.position = "fixed"; // 使用fixed而不是absolute，让它不受滚动影响
  container.style.width = "225px"; // 从150px增加到225px (1.5倍)
  container.style.padding = "15px"; // 从10px增加到15px (1.5倍)
  container.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  container.style.borderRadius = "8px"; // 从5px增加到8px
  container.style.color = "white";
  container.style.fontSize = "18px"; // 从12px增加到18px (1.5倍)
  container.style.fontFamily = "Arial, sans-serif";
  container.style.zIndex = "100";
  
  // 设置初始位置在画布外侧
  if (side === "left") {
    container.style.left = "0";
    container.style.top = "50px";
  } else {
    container.style.right = "0";
    container.style.top = "50px";
  }
  
  // 创建技能条标题
  const title = document.createElement("div");
  title.innerText = side === "left" ? "skills--left" : "skills--right";
  title.style.textAlign = "center";
  title.style.marginBottom = "10px";
  title.style.fontWeight = "bold";
  container.appendChild(title);
  
  // 为每个技能创建进度条
  const skills = side === "left" ? Object.keys(poseStatesLeft) : Object.keys(poseStatesRight);
  
  for (const skill of skills) {
    if (skill === "rest") continue; // 跳过休息状态
    
    // 创建技能条容器
    const skillBarContainer = document.createElement("div");
    skillBarContainer.style.marginBottom = "8px";
    
    // 创建技能名称标签
    const skillLabel = document.createElement("div");
    skillLabel.innerText = skill;
    skillLabel.style.marginBottom = "2px";
    skillBarContainer.appendChild(skillLabel);
    
    // 创建进度条背景
    const progressBg = document.createElement("div");
    progressBg.style.width = "100%";
    progressBg.style.height = "12px"; // 从8px增加到12px (1.5倍)
    progressBg.style.backgroundColor = "#333";
    progressBg.style.position = "relative";
    progressBg.style.borderRadius = "6px"; // 从4px增加到6px (1.5倍)
    progressBg.style.overflow = "hidden";
    
    // 创建进度条填充
    const progressFill = document.createElement("div");
    progressFill.id = `${side}-${skill}-progress`;
    progressFill.style.height = "100%";
    progressFill.style.width = "0%";
    progressFill.style.backgroundColor = "#f00"; // 默认红色
    progressFill.style.position = "absolute";
    progressFill.style.left = "0";
    progressFill.style.top = "0";
    progressFill.style.transition = "width 0.1s ease-in-out";
    
    // 组装进度条
    progressBg.appendChild(progressFill);
    skillBarContainer.appendChild(progressBg);
    container.appendChild(skillBarContainer);
  }
  
  // 创建冷却时间显示区域
  const cooldownTitle = document.createElement("div");
  cooldownTitle.innerText = "冷却时间";
  cooldownTitle.style.textAlign = "center";
  cooldownTitle.style.marginTop = "15px";
  cooldownTitle.style.marginBottom = "10px";
  cooldownTitle.style.fontWeight = "bold";
  container.appendChild(cooldownTitle);
  
  // 行星冷却
  const planetCooldownContainer = document.createElement("div");
  planetCooldownContainer.style.marginBottom = "8px";
  
  const planetCooldownLabel = document.createElement("div");
  planetCooldownLabel.innerText = "行星冷却";
  planetCooldownLabel.style.marginBottom = "2px";
  planetCooldownContainer.appendChild(planetCooldownLabel);
  
  const planetCooldownBg = document.createElement("div");
  planetCooldownBg.style.width = "100%";
  planetCooldownBg.style.height = "8px"; // 从5px增加到8px (约1.5倍)
  planetCooldownBg.style.backgroundColor = "#333";
  planetCooldownBg.style.position = "relative";
  planetCooldownBg.style.borderRadius = "4px"; // 从2px增加到4px
  planetCooldownBg.style.overflow = "hidden";
  
  const planetCooldownFill = document.createElement("div");
  planetCooldownFill.id = `${side}-planet-cooldown`;
  planetCooldownFill.style.height = "100%";
  planetCooldownFill.style.width = "0%";
  planetCooldownFill.style.backgroundColor = "#ffa500";
  planetCooldownFill.style.position = "absolute";
  planetCooldownFill.style.left = "0";
  planetCooldownFill.style.top = "0";
  
  planetCooldownBg.appendChild(planetCooldownFill);
  planetCooldownContainer.appendChild(planetCooldownBg);
  
  const planetCooldownText = document.createElement("div");
  planetCooldownText.id = `${side}-planet-cooldown-text`;
  planetCooldownText.innerText = "ready";
  planetCooldownText.style.textAlign = "right";
  planetCooldownText.style.fontSize = "15px"; // 从10px增加到15px (1.5倍)
  planetCooldownContainer.appendChild(planetCooldownText);
  
  container.appendChild(planetCooldownContainer);
  
  // 爆炸冷却
  const blastCooldownContainer = document.createElement("div");
  blastCooldownContainer.style.marginBottom = "8px";
  
  const blastCooldownLabel = document.createElement("div");
  blastCooldownLabel.innerText = "爆炸冷却";
  blastCooldownLabel.style.marginBottom = "2px";
  blastCooldownContainer.appendChild(blastCooldownLabel);
  
  const blastCooldownBg = document.createElement("div");
  blastCooldownBg.style.width = "100%";
  blastCooldownBg.style.height = "8px"; // 从5px增加到8px (约1.5倍)
  blastCooldownBg.style.backgroundColor = "#333";
  blastCooldownBg.style.position = "relative";
  blastCooldownBg.style.borderRadius = "4px"; // 从2px增加到4px
  blastCooldownBg.style.overflow = "hidden";
  
  const blastCooldownFill = document.createElement("div");
  blastCooldownFill.id = `${side}-blast-cooldown`;
  blastCooldownFill.style.height = "100%";
  blastCooldownFill.style.width = "0%";
  blastCooldownFill.style.backgroundColor = "#ff4500";
  blastCooldownFill.style.position = "absolute";
  blastCooldownFill.style.left = "0";
  blastCooldownFill.style.top = "0";
  
  blastCooldownBg.appendChild(blastCooldownFill);
  blastCooldownContainer.appendChild(blastCooldownBg);
  
  const blastCooldownText = document.createElement("div");
  blastCooldownText.id = `${side}-blast-cooldown-text`;
  blastCooldownText.innerText = "ready";
  blastCooldownText.style.textAlign = "right";
  blastCooldownText.style.fontSize = "15px"; // 从10px增加到15px (1.5倍)
  blastCooldownContainer.appendChild(blastCooldownText);
  
  container.appendChild(blastCooldownContainer);
}

// 定位技能条
function positionSkillBars() {
  const canvas = document.querySelector("#canvasContainer");
  if (!canvas) return;
  
  const canvasRect = canvas.getBoundingClientRect();
  const leftContainer = document.getElementById("left-skillbars");
  const rightContainer = document.getElementById("right-skillbars");
  
  if (leftContainer) {
    leftContainer.style.left = `${canvasRect.left - leftContainer.offsetWidth}px`;
    leftContainer.style.top = `${canvasRect.top}px`;
  }
  
  if (rightContainer) {
    rightContainer.style.left = `${canvasRect.right}px`;
    rightContainer.style.top = `${canvasRect.top}px`;
  }
}

// 更新技能进度条
function updateSkillBars() {
  // 更新左侧玩家技能条
  updatePlayerSkillBars("left", poseStatesLeft, poseActivationTimeLeft);
  
  // 更新右侧玩家技能条
  updatePlayerSkillBars("right", poseStatesRight, poseActivationTimeRight);
  
  // 更新冷却时间
  updateCooldowns();
}

// 更新特定玩家技能条
function updatePlayerSkillBars(side, poseStates, activationTimes) {
  for (const [pose, isActive] of Object.entries(poseStates)) {
    if (pose === "rest") continue; // 跳过休息状态
    
    // 获取进度条元素
    const progressBar = document.getElementById(`${side}-${pose}-progress`);
    if (!progressBar) continue;
    
    // 获取激活时间占比
    const timeValue = activationTimes[pose] || 0;
    
    // 不同技能需要的持续时间不同
    let maxTime = 15; // 默认值，但实际上不会使用
    
    if (pose.includes("fire")) maxTime = 0.5 * 60; // 0.5秒 (帧率约60fps)
    else if (pose.includes("lighting")) maxTime = 0.5 * 60; // 0.5秒
    else if (pose.includes("thunder")) maxTime = 1 * 60; // 1秒
    else if (pose.includes("blast")) maxTime = 1.5 * 60; // 1.5秒
    else if (pose.includes("planet")) maxTime = 2.5 * 40; // 2.5秒
    else if (pose.includes("sunshine")) maxTime = 3 * 40; // 3秒
    
    // 计算进度百分比
    const progress = Math.min(timeValue / maxTime * 100, 100);
    
    // 更新进度条宽度
    progressBar.style.width = `${progress}%`;
    
    // 更新进度条颜色
    if (isActive) {
      if (progress >= 100) {
        progressBar.style.backgroundColor = "#0f0"; // 绿色表示可激活
      } else {
        progressBar.style.backgroundColor = "#ff0"; // 黄色表示正在激活
      }
    } else {
      progressBar.style.backgroundColor = "#f00"; // 红色表示未激活
    }
  }
}

// 更新冷却时间显示
function updateCooldowns() {
  const currentTime = millis();
  
  // 更新左侧玩家冷却
  updatePlayerCooldown("left", currentTime);
  
  // 更新右侧玩家冷却
  updatePlayerCooldown("right", currentTime);
}

// 更新特定玩家冷却时间
function updatePlayerCooldown(side, currentTime) {
  // 获取对应玩家的定时器
  const planetTimer = side === "left" ? window.planetTimer1 : window.planetTimer2;
  const blastTimer = side === "left" ? window.blastTimer1 : window.blastTimer2;
  
  // 行星冷却
  const planetCooldownFill = document.getElementById(`${side}-planet-cooldown`);
  const planetCooldownText = document.getElementById(`${side}-planet-cooldown-text`);
  
  if (planetCooldownFill && planetCooldownText && typeof window.planetCooldown !== 'undefined') {
    if (currentTime - planetTimer < window.planetCooldown) {
      const progress = (window.planetCooldown - (currentTime - planetTimer)) / window.planetCooldown * 100;
      planetCooldownFill.style.width = `${progress}%`;
      
      const remainTime = Math.ceil((window.planetCooldown - (currentTime - planetTimer)) / 1000);
      planetCooldownText.innerText = `${remainTime}秒`;
    } else {
      planetCooldownFill.style.width = "0%";
      planetCooldownText.innerText = "ready";
    }
  }
  
  // 爆炸冷却
  const blastCooldownFill = document.getElementById(`${side}-blast-cooldown`);
  const blastCooldownText = document.getElementById(`${side}-blast-cooldown-text`);
  
  if (blastCooldownFill && blastCooldownText && typeof window.blastCooldown !== 'undefined') {
    if (currentTime - blastTimer < window.blastCooldown) {
      const progress = (window.blastCooldown - (currentTime - blastTimer)) / window.blastCooldown * 100;
      blastCooldownFill.style.width = `${progress}%`;
      
      const remainTime = Math.ceil((window.blastCooldown - (currentTime - blastTimer)) / 1000);
      blastCooldownText.innerText = `${remainTime}秒`;
    } else {
      blastCooldownFill.style.width = "0%";
      blastCooldownText.innerText = "ready";
    }
  }
}
