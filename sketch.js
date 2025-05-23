// 模型URL
const MODEL_URL_LEFT = "./model/left/"; 
const MODEL_URL_RIGHT = "./model/right/";
let modelLeft, modelRight, ctx, maxPredictionsLeft, maxPredictionsRight;
let video;
let isModelLeftReady = false;
let isModelRightReady = false;
let isStarted = false;

// 游戏状态控制
let gameState = "loading"; // loading, ready, playing, gameOver

// 离屏画布用于分别处理左右玩家
let leftPlayerCanvas;
let rightPlayerCanvas;

// 姿势状态对象 - 左侧玩家
let poseStatesLeft = {
  "lighting_l": false,
  "thunder_l": false,
  "sunshine_l": false,
  "planet_l": false,
  "blast_l": false,
  "fire_l": false,
  "defence_l": false,
  "rest": false
};

// 姿势状态对象 - 右侧玩家
let poseStatesRight = {
  "lighting_r": false,
  "thunder_r": false,
  "sunshine_r": false,
  "planet_r": false,
  "blast_r": false,
  "fire_r": false,
  "defence_r": false,
  "rest": false
};

// 姿势激活持续时间跟踪 - 左侧玩家
let poseActivationTimeLeft = {
  "lighting_l": 0,
  "thunder_l": 0,
  "sunshine_l": 0,
  "planet_l": 0,
  "blast_l": 0,
  "fire_l": 0,
  "defence_l": 0
};

// 姿势激活持续时间跟踪 - 右侧玩家
let poseActivationTimeRight = {
  "lighting_r": 0,
  "thunder_r": 0,
  "sunshine_r": 0,
  "planet_r": 0,
  "blast_r": 0,
  "fire_r": 0,
  "defence_r": 0
};

// COCO-SSD模型
let cocoModel;
let isCocoModelReady = false;

// 玩家坐标
let Player1_X = 0;
let Player1_Y = 0;
let Player2_X = 0;
let Player2_Y = 0;

// 画布尺寸 - 原来为640x480，现在为960x720 (1.5倍)
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 720;

//---------- 玩家生命值和技能点数 ----------//
let HP_left = 300; // 左侧玩家生命值 
let HP_right = 300; // 右侧玩家生命值 
let skill_points_left = 0; // 左侧玩家技能点数
let skill_points_right = 0; // 右侧玩家技能点数

// 添加变量存储人物检测结果
let detectedPeopleData = [];

// 标签容器
let labelContainerLeft;
let labelContainerRight;

// 添加血液特效相关变量
let splatterActive = false;
let splatters = [];
let splatterDensity = 1;
let fadeSpeed = 1;
let baseSplatterColor;
// 添加变量跟踪最后受伤的玩家（如果poseDetection.js中未定义）
if (typeof lastDamagedPlayer === 'undefined') {
  let lastDamagedPlayer = -1;
}

// 爆炸特效数组
let explosions = [];

// 定义一个游戏暂停状态变量
let isGamePaused = false;

// 添加重置按钮引用
let restartBtn;

function preload() {
  // 预加载音频文件
  try {
    preloadSounds();
  } catch (error) {
    console.error("加载音频出错:", error);
  }
}

function setup() {
  // 创建画布并放在canvasContainer中 - 使用新的尺寸
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('canvasContainer');
  
  // 创建离屏画布用于处理左右玩家 - 也放大1.5倍
  leftPlayerCanvas = createGraphics(240 * 1.5, 320 * 1.5);
  rightPlayerCanvas = createGraphics(240 * 1.5, 320 * 1.5);
  
  // 创建视频捕获（添加错误处理） - 使用新的尺寸
  try {
    video = createCapture({
      video: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT
      },
      audio: false
    }, videoLoaded);
    
    video.elt.onloadeddata = function() {
      console.log("视频数据已加载");
    };
    
    video.elt.onerror = function(e) {
      console.error("视频元素错误:", e);
      handleVideoError();
    };
    
  } catch (error) {
    console.error("创建视频捕获出错:", error);
    handleVideoError();
  }
  
  // 设置按钮事件
  const startBtn = document.getElementById('startBtn');
  startBtn.addEventListener('click', toggleStart);
  
  // 设置重新开始按钮事件
  restartBtn = document.getElementById('restartBtn');
  restartBtn.addEventListener('click', restartGame);
  
  // 创建左右玩家的标签容器
  createLabelContainers();
  
  // 加载姿势识别模型 - 左右两个模型
  loadLeftPoseModel();
  loadRightPoseModel();
  
  // 加载COCO-SSD模型
  loadCocoModel();

  // 加载纹理图像
  if (typeof preloadPlanetTextures === "function") {
    preloadPlanetTextures();
  }
  
  // 设置技能进度条
  setupSkillBars();
  
  // 初始化后定位进度条
  setTimeout(positionSkillBars, 500);
  
  // 初始化血液颜色
  baseSplatterColor = color(255, 0, 0, 255);
  
  // 设置游戏状态为准备就绪
  gameState = "ready";
}

// 创建左右玩家的标签容器
function createLabelContainers() {
  // 获取或创建主标签容器
  let mainLabelContainer = document.getElementById('label-container');
  if (!mainLabelContainer) {
    mainLabelContainer = document.createElement('div');
    mainLabelContainer.id = 'label-container';
    document.body.appendChild(mainLabelContainer);
  }
  
  // 清空主容器
  mainLabelContainer.innerHTML = '';
  
  // 创建左侧玩家标签容器
  labelContainerLeft = document.createElement('div');
  labelContainerLeft.id = 'label-container-left';
  labelContainerLeft.className = 'player-labels';
  labelContainerLeft.style.width = '50%';
  labelContainerLeft.style.float = 'left';
  
  // 添加标题
  const leftTitle = document.createElement('h3');
  leftTitle.innerText = '左侧玩家';
  labelContainerLeft.appendChild(leftTitle);
  
  // 创建右侧玩家标签容器
  labelContainerRight = document.createElement('div');
  labelContainerRight.id = 'label-container-right';
  labelContainerRight.className = 'player-labels';
  labelContainerRight.style.width = '50%';
  labelContainerRight.style.float = 'left';
  
  // 添加标题
  const rightTitle = document.createElement('h3');
  rightTitle.innerText = '右侧玩家';
  labelContainerRight.appendChild(rightTitle);
  
  // 将左右容器添加到主容器
  mainLabelContainer.appendChild(labelContainerLeft);
  mainLabelContainer.appendChild(labelContainerRight);
}

// 视频加载成功的回调
function videoLoaded(stream) {
  console.log("视频捕获成功");
  if (video) {
    video.size(CANVAS_WIDTH, CANVAS_HEIGHT);
    video.hide();
  }
}

// 处理视频错误
function handleVideoError() {
  // 创建一个带错误信息的显示元素
  const errorMsg = createElement('div', 
    '无法访问摄像头。可能的原因：<br>'+
    '1. 您的浏览器不支持getUserMedia<br>'+
    '2. 您没有允许摄像头权限<br>'+
    '3. 您需要使用HTTPS或localhost<br>'+
    '正在使用备用方案...');
  errorMsg.style('color', 'red');
  errorMsg.style('margin', '20px');
  errorMsg.parent('canvasContainer');
  
  // 创建一个备用的视频元素（使用静态图像）
  video = createVideo(['assets/fallback.mp4'], videoReady);
  video.loop();
  video.hide();
  
  // 如果没有备用视频，也可以使用图像
  if (!video || video.elt.error) {
    console.log("尝试使用静态图像...");
    video = createImg('assets/fallback.jpg', '备用图像');
    video.hide();
  }
}

function videoReady() {
  console.log("备用视频已准备好");
  if (video) {
    video.loop();
    video.volume(0);
  }
}

async function loadCocoModel() {
  console.log("加载COCO-SSD模型中...");
  try {
    cocoModel = await cocoSsd.load();
    isCocoModelReady = true;
    console.log("COCO-SSD模型加载完成");
  } catch (error) {
    console.error("加载COCO-SSD模型出错:", error);
  }
}

// 加载左侧玩家模型
async function loadLeftPoseModel() {
  const modelURL = MODEL_URL_LEFT + "model.json";
  const metadataURL = MODEL_URL_LEFT + "metadata.json";
  
  console.log("加载左侧玩家模型中...");
  try {
    // 加载模型及元数据
    modelLeft = await tmPose.load(modelURL, metadataURL);
    maxPredictionsLeft = modelLeft.getTotalClasses();
    
    // 创建标签显示
    for (let i = 0; i < maxPredictionsLeft; i++) {
      labelContainerLeft.appendChild(document.createElement("div"));
    }
    
    isModelLeftReady = true;
    console.log("左侧玩家模型加载完成");
  } catch (error) {
    console.error("加载左侧玩家模型出错:", error);
  }
}

// 加载右侧玩家模型
async function loadRightPoseModel() {
  const modelURL = MODEL_URL_RIGHT + "model.json";
  const metadataURL = MODEL_URL_RIGHT + "metadata.json";
  
  console.log("加载右侧玩家模型中...");
  try {
    // 加载模型及元数据
    modelRight = await tmPose.load(modelURL, metadataURL);
    maxPredictionsRight = modelRight.getTotalClasses();
    
    // 创建标签显示
    for (let i = 0; i < maxPredictionsRight; i++) {
      labelContainerRight.appendChild(document.createElement("div"));
    }
    
    isModelRightReady = true;
    console.log("右侧玩家模型加载完成");
  } catch (error) {
    console.error("加载右侧玩家模型出错:", error);
  }
}

// 切换游戏开始/停止
function toggleStart() {
  if (!isModelLeftReady || !isModelRightReady) {
    alert("模型还未完全加载完成，请稍等");
    return;
  }
  
  if (gameState === "gameOver") {
    // 如果游戏已结束，不允许使用开始按钮重新开始
    return;
  }
  
  isStarted = !isStarted;
  
  if (isStarted) {
    gameState = "playing";
    // 重置游戏状态
    resetGameState();
  } else {
    gameState = "ready";
    // 停止所有音效
    stopAllSounds();
  }
  
  const startBtn = document.getElementById('startBtn');
  startBtn.innerText = isStarted ? "Stop" : "Start";
}

// 重置游戏状态
function resetGameState() {
  // 重置血量
  HP_left = 300;
  HP_right = 300;
  
  // 重置血液特效触发标志
  bloodEffectTriggeredLeft = false;
  bloodEffectTriggeredRight = false;
  
  // 重置最后受伤的玩家
  lastDamagedPlayer = -1;
  
  // 清空特效数组
  splatters = [];
  explosions = [];
  
  // 重置所有玩家特效
  if (typeof window.flamesP1 !== 'undefined') window.flamesP1 = [];
  if (typeof window.flamesP2 !== 'undefined') window.flamesP2 = [];
  if (typeof window.blastsP1 !== 'undefined') window.blastsP1 = [];
  if (typeof window.blastsP2 !== 'undefined') window.blastsP2 = [];
  // 重置其他特效数组...
}

// 重新开始游戏
function restartGame() {
  if (gameState !== "gameOver") {
    return;
  }
  
  // 隐藏重新开始按钮
  restartBtn.style.display = "none";
  
  // 显示开始按钮
  document.getElementById('startBtn').style.display = "block";
  
  // 重置游戏状态
  resetGameState();
  
  // 停止所有音效
  stopAllSounds();
  
  // 设置游戏状态为准备就绪
  gameState = "ready";
  isStarted = false;
  isGamePaused = false;
  
  // 更新开始按钮文本
  const startBtn = document.getElementById('startBtn');
  startBtn.innerText = "Start";
}

function draw() {
  // 检查视频是否可用
  if (!video || !video.elt) {
    background(0);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("视频未就绪，请刷新页面重试", width/2, height/2);
    return;
  }
  
  // 清除画布
  clear();
  
  // 显示视频
  image(video, 0, 0, width, height);
  
  // 如果COCO-SSD模型准备好，执行人类检测
  if (isCocoModelReady && isStarted) {
    detectPeople();
  }
  
  // 当停止时，重置所有姿势状态
  if (!isStarted) {
    resetAllPoseStates();
  }
  
  // 处理左右玩家区域
  if (isStarted && detectedPeopleData.length > 0) {
    processPlayers();
  }
  
  // 绘制人物中心点
  drawPeopleCenters();
  
  // 更新和显示各种特效 - 使用window前缀调用全局函数，避免递归
  if (typeof window.updateAndDisplayFlames === "function") {
    window.updateAndDisplayFlames();
  }
  
  if (typeof window.updateAndDisplayBlasts === "function") {
    window.updateAndDisplayBlasts();
  }
  
  if (typeof window.updateAndDisplayLightnings === "function") {
    window.updateAndDisplayLightnings();
  }
  
  if (typeof window.updateAndDisplaySunshines === "function") {
    window.updateAndDisplaySunshines();
  }
  
  if (typeof window.updateAndDisplayThunders === "function") {
    window.updateAndDisplayThunders();
  }
  
  if (typeof window.updateAndDisplayPlanets === "function") {
    window.updateAndDisplayPlanets();
  }
  
  // 更新技能进度条
  updateSkillBars();
  
  // 检查姿势持续时间并创建各种效果
  if (isStarted) {
    checkPoseDurationAndCreateEffects();
    // 检查并创建闪电效果
    if (typeof window.checkPoseDurationAndCreateLightnings === "function") {
      window.checkPoseDurationAndCreateLightnings();
    }
    // 检查并创建阳光效果
    if (typeof window.checkPoseDurationAndCreateSunshines === "function") {
      window.checkPoseDurationAndCreateSunshines();
    }
    // 检查并创建雷电效果
    if (typeof window.checkPoseDurationAndCreateThunders === "function") {
      window.checkPoseDurationAndCreateThunders();
    }
    // 检查并创建行星效果
    if (typeof window.checkPoseDurationAndCreatePlanets === "function") {
      window.checkPoseDurationAndCreatePlanets();
    }
    // 检查并创建火焰效果
    if (typeof window.checkPoseDurationAndCreateFlames === "function") {
      window.checkPoseDurationAndCreateFlames();
    }
    
    // 检查游戏结束条件
    checkGameEndCondition();
  }
  
  // 更新和显示爆炸效果
  if (explosions && explosions.length > 0) {
    for (let i = explosions.length - 1; i >= 0; i--) {
      explosions[i].update();
      explosions[i].display();
      
      // 移除已完成的爆炸
      if (explosions[i].isFinished()) {
        explosions.splice(i, 1);
      }
    }
  }
  
  // 显示血液效果
  if (splatters && splatters.length > 0) {
    drawblood();
  }
  
  // 如果游戏正在进行，检查随机播放背景音效
  if (gameState === "playing" && !isGamePaused) {
    checkAndPlayRandomSound();
  }
}

// 检查游戏结束条件
function checkGameEndCondition() {
  if (HP_left <= 0 || HP_right <= 0) {
    let winner = HP_left <= 0 ? "玩家2" : "玩家1";
    
    // 显示游戏结束信息
    push();
    fill(255, 0, 0);
    stroke(255);
    strokeWeight(2);
    textSize(40);
    textAlign(CENTER, CENTER);
    text(`Game, over! ${winner} WIN!`, width/2, height/2);
    pop();
    
    // 游戏结束处理
    if (!isGamePaused) {
      isGamePaused = true;
      gameState = "gameOver";
      
      // 播放胜利音效
      playSound("winner");
      
      // 隐藏开始按钮，显示重新开始按钮
      document.getElementById('startBtn').style.display = "none";
      restartBtn.style.display = "block";
    }
  }
}

// 检查姿势持续时间并创建各种效果
function checkPoseDurationAndCreateEffects() {
  // 检查左侧玩家状态
  checkPlayerEffects("left");
  
  // 检查右侧玩家状态
  checkPlayerEffects("right");
}

// 检查特定玩家的效果激活
function checkPlayerEffects(playerSide) {
  const activationTime = playerSide === "left" ? poseActivationTimeLeft : poseActivationTimeRight;
  const poseStates = playerSide === "left" ? poseStatesLeft : poseStatesRight;
  const playerNum = playerSide === "left" ? 1 : 2;
  const playerX = playerSide === "left" ? Player1_X : Player2_X;
  const playerY = playerSide === "left" ? Player1_Y : Player2_Y;
  
  // 检测火焰效果 - 使用新的时间阈值
  const firePoseName = playerSide === "left" ? "fire_l" : "fire_r";
  if (poseStates[firePoseName] && activationTime[firePoseName] >= 30) {
    // 根据玩家位置创建火焰
    createFireEffect(playerX, playerY, playerNum);
    // 重置持续时间计数器
    activationTime[firePoseName] = 0;
  }
  
  // 检测爆炸效果 - 使用新的时间阈值
  const blastPoseName = playerSide === "left" ? "blast_l" : "blast_r";
  if (poseStates[blastPoseName] && activationTime[blastPoseName] >= 90) {
    // 根据玩家位置创建爆炸
    createBlastEffect(playerX, playerY, playerNum);
    // 重置持续时间计数器
    activationTime[blastPoseName] = 0;
  }
  
  // 注: 其他技能在专门的函数中处理
}

// 创建火焰效果
function createFireEffect(x, y, playerNum) {
  // 使用window明确引用全局函数
  if (typeof window.createFlame === "function") {
    const direction = playerNum === 1 ? "right" : "left";
    window.createFlame(x, y, direction, playerNum);
  }
}

// 创建爆炸效果
function createBlastEffect(x, y, playerNum) {
  // 使用window明确引用全局函数
  if (typeof window.createBlast === "function") {
    const direction = playerNum === 1 ? "right" : "left";
    window.createBlast(x, y, direction, playerNum);
  }
}

// 重置所有姿势状态
function resetAllPoseStates() {
  // 重置左侧玩家状态
  for (let pose in poseStatesLeft) {
    poseStatesLeft[pose] = false;
  }
  
  // 重置右侧玩家状态
  for (let pose in poseStatesRight) {
    poseStatesRight[pose] = false;
  }
  
  // 重置激活时间
  for (let pose in poseActivationTimeLeft) {
    poseActivationTimeLeft[pose] = 0;
  }
  
  for (let pose in poseActivationTimeRight) {
    poseActivationTimeRight[pose] = 0;
  }
}

// 窗口大小改变时重新定位所有UI元素
function windowResized() {
  // 调整主画布大小 - 使用常量而不是硬编码尺寸
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // 重新设置离屏画布大小 - 也使用1.5倍尺寸
  leftPlayerCanvas.resizeCanvas(240 * 1.5, 320 * 1.5);
  rightPlayerCanvas.resizeCanvas(240 * 1.5, 320 * 1.5);
  
  // 重新定位技能条
  positionSkillBars();
}

// 处理玩家
function processPlayers() {
  // 处理两个玩家
  if (detectedPeopleData.length >= 1) {
    // 处理左侧玩家 (Player1)
    const player1 = detectedPeopleData[0];
    extractPlayerRegion(leftPlayerCanvas, player1);
    
    // 如果左侧模型已准备好，执行预测
    if (isModelLeftReady) {
      predictPlayer(modelLeft, leftPlayerCanvas, labelContainerLeft, maxPredictionsLeft, poseStatesLeft, "left");
    }
  }
  
  if (detectedPeopleData.length >= 2) {
    // 处理右侧玩家 (Player2)
    const player2 = detectedPeopleData[1];
    extractPlayerRegion(rightPlayerCanvas, player2);
    
    // 如果右侧模型已准备好，执行预测
    if (isModelRightReady) {
      predictPlayer(modelRight, rightPlayerCanvas, labelContainerRight, maxPredictionsRight, poseStatesRight, "right");
    }
  }
}

// 提取玩家区域到离屏画布
function extractPlayerRegion(canvas, player) {
  // 清除画布
  canvas.clear();
  
  const [x, y, w, h] = [player.x, player.y, player.w, player.h];
  
  // 扩展一些边界，确保可以捕获到完整的姿势
  const padding = 50;
  const safeX = max(0, x - padding);
  const safeY = max(0, y - padding);
  const safeW = min(width - safeX, w + padding * 2);
  const safeH = min(height - safeY, h + padding * 2);
  
  // 调整比例填充玩家画布
  const scale = min(canvas.width / safeW, canvas.height / safeH);
  const newW = safeW * scale;
  const newH = safeH * scale;
  const offsetX = (canvas.width - newW) / 2;
  const offsetY = (canvas.height - newH) / 2;
  
  // 将视频对应区域绘制到画布上
  canvas.image(video, offsetX, offsetY, newW, newH, safeX, safeY, safeW, safeH);
}

// 对特定玩家执行姿势预测
async function predictPlayer(model, canvas, labelContainer, maxPredictions, poseStates, playerSide) {
  try {
    // 通过姿势估计获取姿势和输出
    const { pose, posenetOutput } = await model.estimatePose(canvas.elt);
    
    // 运行教学机器分类模型和输出
    const prediction = await model.predict(posenetOutput);
    
    // 更新标签显示和检查姿势状态
    for (let i = 0; i < maxPredictions; i++) {
      const probability = prediction[i].probability.toFixed(2);
      const className = prediction[i].className;
      const classPrediction = className + ": " + probability;
      
      if (labelContainer.childNodes[i+1]) { // +1 因为第一个子节点是标题
        labelContainer.childNodes[i+1].innerHTML = classPrediction;
      }
      
      // 检查是否达到90%以上的识别度
      poseStates[className] = prediction[i].probability > 0.9;
      
      // 更新姿势持续时间
      updatePoseDuration(className, poseStates[className], playerSide);
    }
    
    // 绘制姿势关键点和骨架
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, canvas.drawingContext);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, canvas.drawingContext);
    }
  } catch (error) {
    console.error(`预测${playerSide}玩家姿势出错:`, error);
  }
}

// 更新姿势持续时间
function updatePoseDuration(poseName, isActive, playerSide) {
  if (playerSide === "left" && poseName !== "rest") {
    if (isActive) {
      poseActivationTimeLeft[poseName] += 1;  // 每帧增加1
    } else {
      // 当姿势不再激活时，不要立即重置,让技能进度条降低更加平滑
      if (poseActivationTimeLeft[poseName] > 0) {
        poseActivationTimeLeft[poseName] -= 3;  // 每帧减少3
        if (poseActivationTimeLeft[poseName] < 0) poseActivationTimeLeft[poseName] = 0;
      }
    }
  } else if (playerSide === "right" && poseName !== "rest") {
    if (isActive) {
      poseActivationTimeRight[poseName] += 1;  // 每帧增加1
    } else {
      // 当姿势不再激活时，不要立即重置,让技能进度条降低更加平滑
      if (poseActivationTimeRight[poseName] > 0) {
        poseActivationTimeRight[poseName] -= 3;  // 每帧减少3
        if (poseActivationTimeRight[poseName] < 0) poseActivationTimeRight[poseName] = 0;
      }
    }
  }
}