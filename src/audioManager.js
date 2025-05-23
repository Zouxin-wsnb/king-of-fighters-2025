// 音频管理器 - 负责加载和播放游戏音效

// 音频文件对象
let sounds = {
  blast: null,
  fire: null,
  sunshine: null,
  thunder: null,
  lighting: null,
  planet: null,
  blood: null,
  intere: null,
  winner: null
};

// 上次播放随机音效的时间
let lastIntereTime = 0;
// 随机音效的间隔范围（毫秒）
const INTERE_MIN_INTERVAL = 20000; // 最少20秒
const INTERE_MAX_INTERVAL = 60000; // 最多60秒

// 预加载音频文件
function preloadSounds() {
  // 在p5.js的preload中调用此函数确保所有声音加载完成
  sounds.blast = loadSound('assets/sounds/blast.mp3');
  sounds.fire = loadSound('assets/sounds/fire.mp3');
  sounds.sunshine = loadSound('assets/sounds/sunshine.mp3');
  sounds.thunder = loadSound('assets/sounds/thunder.mp3');
  sounds.lighting = loadSound('assets/sounds/lighting.mp3');
  sounds.planet = loadSound('assets/sounds/planet.mp3');
  sounds.blood = loadSound('assets/sounds/blood.mp3');
  sounds.intere = loadSound('assets/sounds/interesting.mp3');
  sounds.winner = loadSound('assets/sounds/winner.mp3');
  
  // 设置音量
  Object.values(sounds).forEach(sound => {
    if (sound) sound.setVolume(0.5);
  });
  
  console.log("音效加载完成");
}

// 播放特定音效
function playSound(soundName) {
  if (!sounds[soundName]) {
    console.warn(`音效 ${soundName} 未找到`);
    return;
  }
  
  // 如果声音已经在播放，先停止再重新播放
  if (sounds[soundName].isPlaying()) {
    sounds[soundName].stop();
  }
  
  sounds[soundName].play();
}

// 简化阳光音效播放函数，移除循环播放逻辑
function startSunshineSound() {
  // 直接调用playSound函数播放一次
  playSound('sunshine');
}

// 简化阳光音效停止函数
function stopSunshineSound() {
  // 如果阳光音效正在播放，停止它
  if (sounds.sunshine && sounds.sunshine.isPlaying()) {
    sounds.sunshine.stop();
  }
}

// 随机播放背景音效（随时间随机播放）
function checkAndPlayRandomSound() {
  const currentTime = millis();
  
  // 检查是否已经过了足够的时间
  if (currentTime - lastIntereTime > INTERE_MIN_INTERVAL) {
    // 进一步根据随机概率决定是否播放
    if (random() < 0.05) { // 每帧有5%的概率播放（需要同时满足最小时间间隔）
      playSound('intere');
      lastIntereTime = currentTime;
      
      // 设置下一次最早可播放的时间
      const randomInterval = random(INTERE_MIN_INTERVAL, INTERE_MAX_INTERVAL);
      lastIntereTime += randomInterval;
    }
  }
}

// 停止所有音效
function stopAllSounds() {
  Object.values(sounds).forEach(sound => {
    if (sound && sound.isPlaying()) {
      sound.stop();
    }
  });
  
  stopSunshineSound();
}
