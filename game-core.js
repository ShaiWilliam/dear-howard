/* ==========================================================================
   DEAR HOWARD - 核心引擎、擬真音效合成器與前兩章邏輯 (game-core.js)
   ========================================================================== */

/********************************************************************
 * 1. 預設全局資料庫 (DEFAULT_CONFIG) - 100% 可由超級後台視覺化修改
 ********************************************************************/
const DEFAULT_CONFIG = {
  passcode: "1119",
  totalKm: 12680,
  stepKm: 48,
  bgmVol: 0.45,
  duckVol: 0.08,
  staticVol: 0.22,
  bgmUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-piano-112191.mp3",
  bdayAudio: "",

  // 開場動畫與 Logo
  introSalutation: "Dear Howard,",
  introZh: "「親愛的 Howard，有些事情，我想讓你親眼看看……」",
  introEn: "There is something I want to show you…",
  logoZh: "跨越時差的生日星旅",
  logoEn: "DEAR HOWARD",
  logoSub: "Every step leads me to you.",

  // 第一章：3D 光遇世界三階段字幕與雙城天空照
  ch1Sub1Zh: "我們隔著太平洋與十四個小時的時差……",
  ch1Sub1En: "Across the Pacific and fourteen hours apart…",
  ch1Sub2Zh: "但你往前奔跑的每一步，都在讓彼此的世界更清晰。",
  ch1Sub2En: "Yet every step forward brings our two worlds into focus.",
  ch1Sub3Zh: "12,680 公里的思念盡頭，我就在天際線等你。",
  ch1Sub3En: "At the end of 12,680 kilometers of longing, I am right here.",
  ch1PhotoTw: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1000&q=80",
  ch1PhotoUs: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",

  // 跨章節電影級無縫轉場字幕 (1➔2, 2➔3, 3➔4, 4➔5)
  trans12Zh: "你跨出的每一步，都凝結成這座只為你開放的午夜美術館。",
  trans12En: "Every step you took has crystallized into this midnight gallery curated only for you.",
  trans23Zh: "影像留住了我們過去的模樣；但此刻跨越 12,680 公里的想念，需要閉上眼，用聽的……",
  trans23En: "Photographs keep our past alive; yet across 12,680 km, longing is best heard with eyes closed…",
  trans34Zh: "收音機只能單向聽見我的聲音……如果夜霧裡有一座跨越時空的電話亭，你想撥給哪一個時刻的我？",
  trans34En: "A radio only plays one way… Step into this midnight phone booth and call me across time.",
  trans45Zh: "聽完了過去、現在與未來的我，現在，讓我們順著這條發光的時間長河，看看我們走過的每一步……",
  trans45En: "Having heard my past, present, and future, follow this golden thread through every memory we share…",

  // 第二章：午夜微型美術館（三階段：破冰提問 ➔ 開燈找光點 ➔ 典藏銘牌）
  museum: [
    {
      question: "館長破冰提問 #01：在拉開燈繩之前，先跟視訊裡的我猜猜看——這張館藏定格的是我們哪一次約會的瞬間？",
      hotspotX: 52,
      hotspotY: 45,
      hotspotNote: "✦ 你找到了第一個記憶光點！那天你的眼神真的超溫柔。",
      title: "典藏編號 #01｜最初心動的頻率",
      date: "Collection I • Where It All Began",
      desc: "那時候的我們還不知道，未來會隔著半個地球思念彼此。但現在回頭看，那一天你的笑容早就把我的心定格了。",
      img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80",
      audio: ""
    },
    {
      question: "館長破冰提問 #02：還記得我們一起走過最難忘的一段路嗎？猜猜這幅畫藏著什麼小秘密？",
      hotspotX: 64,
      hotspotY: 58,
      hotspotNote: "✦ 被你發現了！其實那天我偷偷在心裡許願希望時間走慢一點。",
      title: "典藏編號 #02｜並肩走過的風景",
      date: "Collection II • Side By Side",
      desc: "別人眼裡只是尋常的街角與日常，因為身邊的人是你，每一幀畫面都變成了我最想反覆溫習的館藏。",
      img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
      audio: ""
    },
    {
      question: "館長破冰提問 #03：最後一幅館藏！在飛往德州前，我們心裡最重要的那個約定是什麼？",
      hotspotX: 48,
      hotspotY: 40,
      hotspotNote: "✦ 不管台北到德州有多遠，我們都在往同一個未來前進！",
      title: "典藏編號 #03｜飛往德州前的約定",
      date: "Collection III • Taipei ➔ Texas A&M",
      desc: "看著你為了夢想在 Texas A&M 努力發光，我既驕傲又想念。不管距離多遠，我永遠是你最堅定的後盾。",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
      audio: ""
    }
  ],

  // 第三章：微光收音機（支援後台動態新增任意數量頻道）
  radio: [
    {
      freq: "92.6",
      label: "第一道頻率｜相遇的起點",
      transcript: "「喂喂，Howard 聽得到嗎？這是來自台北的第一道波段。恭喜你在雜訊裡找到了我！每次想你的時候，我都會想起我們剛認識的那天……」",
      audio: ""
    },
    {
      freq: "101.4",
      label: "第二道頻率｜德州的星空下",
      transcript: "「這是第二道秘密頻率。一個人在德州農工大學趕報告、準備考試很辛苦對吧？累的時候記得深呼吸，台北的我也正在為你加油喔！」",
      audio: ""
    },
    {
      freq: "106.8",
      label: "第三道頻率｜跨越時差的擁抱",
      transcript: "「你找到最後一道收音機訊號了！親愛的壽星，祝你生日快樂！現在，請走出窗台，去接聽那座午夜電話亭為你響起的電話吧……」",
      audio: ""
    }
  ],

  // 第四章：跨時空公共電話亭（過去、現在、未來）
  phone: {
    past: {
      label: "過去 PAST",
      number: "0101",
      transcript: "【來自「過去的我」的通話】：「喂？是未來的 Howard 嗎？我是剛認識你不久時候的我。那時候我還害羞不敢說，但我真的很慶幸自己勇敢牽起了你的手。」",
      audio: ""
    },
    present: {
      label: "現在 PRESENT",
      number: "1119",
      transcript: "【來自「現在的我」的通話】：「親愛的 Howard，生日快樂！此時此刻我正隔著視訊看著你玩這個遊戲。雖然今年不能親手抱抱你，但我的心早就飛到德州陪你了。」",
      audio: ""
    },
    future: {
      label: "未來 FUTURE",
      number: "9999",
      transcript: "【來自「未來的我」的通話】：「喂，Howard！我是已經結束遠距離、每天早上都能幫你泡咖啡的未來的我喔！再堅持一下下，我們很快就能把所有時差都變成日常了。」",
      audio: ""
    }
  },

  // 第五章：蜿蜒星軌時間軸畫布（支援後台動態新增任意數量節點）
  timeline: [
    {
      date: "MEMORY 01 • THE BEGINNING",
      title: "故事開始的那一天",
      quote: "所有的星光都有起點，而我的宇宙是從遇見你的那一刻開始發亮的。",
      img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"
    },
    {
      date: "MEMORY 02 • SWEET DAYS",
      title: "笑得最燦爛的日常",
      quote: "和你在一起的時光總是過得特別快，連吹過耳邊的風都是甜的。",
      img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
    },
    {
      date: "MEMORY 03 • ACROSS THE OCEAN",
      title: "12,680 公里的勇敢",
      quote: "距離從來沒有把我們分開，它只是證明了我們有多麼珍惜彼此。",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
      date: "MEMORY 04 • OUR FUTURE",
      title: "走向有你的每一個明天",
      quote: "Every step leads me to you. 下一個生日，換我站在你身邊陪你吹蠟燭。",
      img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80"
    }
  ],

  // 博物館級登機證與最終生日長信
  ticketTheme: "aggie",
  ticketPassenger: "HOWARD",
  ticketGate: "FLIGHT AI-1119 / GATE 19",
  ticketNote: "FIRST CLASS • VALID FOREVER • EVERY STEP LEADS ME TO YOU",
  ticketPhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
  candlePrompt: "閉上眼睛許個願，對著麥克風輕吹一口氣（或直接點擊燭火）",
  finalLetter: "親愛的 Howard：\n\n生日快樂！\n雖然今年沒辦法直接飛到德州親手為你插上蠟燭，但我把這 12,680 公里的想念，全部寫進了這個屬於我們的星光世界裡。\n\n在 Texas A&M 努力的每一天，請記得台灣永遠有一個人在為你驕傲、為你守候。\n\nEvery step leads me to you.\n等我們下次見面，再把所有欠你的擁抱一次補齊！\n\n永遠愛你的我 敬上"
};

window.CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
window.currentStageIndex = 0;

/********************************************************************
 * 2. 讀取設定檔與雙時區時鐘 (Asia/Taipei vs America/Chicago)
 ********************************************************************/
async function loadInitialConfig() {
  try {
    const res = await fetch('./config.json?t=' + Date.now());
    if (res.ok) {
      const remoteCfg = await res.json();
      window.CONFIG = deepMergeConfig(DEFAULT_CONFIG, remoteCfg);
    } else {
      const localSaved = localStorage.getItem('DEAR_HOWARD_CONFIG_V2');
      if (localSaved) window.CONFIG = deepMergeConfig(DEFAULT_CONFIG, JSON.parse(localSaved));
    }
  } catch (e) {
    const localSaved = localStorage.getItem('DEAR_HOWARD_CONFIG_V2');
    if (localSaved) window.CONFIG = deepMergeConfig(DEFAULT_CONFIG, JSON.parse(localSaved));
  }
  applyConfigToUI();
}

function deepMergeConfig(base, override) {
  const out = JSON.parse(JSON.stringify(base));
  if (!override) return out;
  Object.keys(override).forEach(k => {
    if (override[k] !== undefined && override[k] !== null) {
      out[k] = override[k];
    }
  });
  return out;
}

function applyConfigToUI() {
  const C = window.CONFIG;
  // 開場與 Logo
  setText('intro-salutation', C.introSalutation);
  setText('intro-zh-line', C.introZh);
  setText('intro-en-line', C.introEn);
  setText('logo-zh-main', C.logoZh);
  setText('logo-en-title', C.logoEn);
  setText('logo-en-sub', C.logoSub);

  // 第一章天空圖與初始距離
  const twPhoto = document.getElementById('sky-photo-tw');
  const usPhoto = document.getElementById('sky-photo-us');
  if (twPhoto) twPhoto.style.backgroundImage = `url('${C.ch1PhotoTw}')`;
  if (usPhoto) usPhoto.style.backgroundImage = `url('${C.ch1PhotoUs}')`;

  currentKm = Number(C.totalKm) || 12680;
  setText('km-counter', currentKm.toLocaleString());
  setText('ch1-zh-sub', C.ch1Sub1Zh);
  setText('ch1-en-sub', C.ch1Sub1En);

  // BGM 設定
  const bgm = document.getElementById('bgm-player');
  if (bgm && C.bgmUrl && bgm.getAttribute('data-src') !== C.bgmUrl) {
    bgm.src = C.bgmUrl;
    bgm.setAttribute('data-src', C.bgmUrl);
  }
  if (bgm) bgm.volume = Number(C.bgmVol) || 0.45;

  // 刷新各章節內容
  if (typeof initMuseumChapter === 'function') initMuseumChapter();
  if (typeof initRadioChapter === 'function') initRadioChapter();
  if (typeof initPayphoneChapter === 'function') initPayphoneChapter();
  if (typeof initTimelineChapter === 'function') initTimelineChapter();

  setText('candle-prompt-zh', C.candlePrompt);
  setText('final-letter-body', C.finalLetter);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.textContent = val;
}

function updateDualClocks() {
  const now = new Date();
  const twStr = now.toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false });
  const usStr = now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: false });
  setText('clock-tw', `台北 TPE ${twStr}`);
  setText('clock-us', `德州 A&M ${usStr}`);
}
setInterval(updateDualClocks, 1000);
updateDualClocks();

/********************************************************************
 * 3. Web Audio 擬真音效合成器 ＆ 視訊共遊音訊進度同步器
 ********************************************************************/
let audioCtx = null;
let staticNoiseNode = null;
let staticGainNode = null;
let dialToneOsc1 = null;
let dialToneOsc2 = null;
let dialToneGain = null;

function ensureAudioContext() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

// 空靈《光·遇》風鈴聲
function playSkyChime(freq = 528, duration = 1.3) {
  try {
    ensureAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.498, audioCtx.currentTime + duration * 0.85);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0008, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// 復古黃銅燈繩／話筒開關「咔噠」聲
function playSwitchClick() {
  try {
    ensureAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(65, audioCtx.currentTime + 0.065);
    gain.gain.setValueAtTime(0.32, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.075);
    if (navigator.vibrate) navigator.vibrate(25);
  } catch (e) {}
}

// 掌心心跳撲通聲
function playHeartbeatThump() {
  try {
    ensureAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(78, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(36, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.45, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.24);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
    if (navigator.vibrate) navigator.vibrate([55, 70, 35]);
  } catch (e) {}
}

// 收音機真實低頻溫潤雜訊合成器 (Filtered Warm Low-Freq Radio Static)
function startRadioStatic() {
  try {
    ensureAudioContext();
    if (staticNoiseNode) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      output[i] = (b0 + b1 + b2 + white * 0.04) * 0.45;
    }

    staticNoiseNode = audioCtx.createBufferSource();
    staticNoiseNode.buffer = buffer;
    staticNoiseNode.loop = true;

    // 低通濾波器營造復古真空管低頻沙沙感
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.7;

    staticGainNode = audioCtx.createGain();
    const baseStatic = Number(window.CONFIG.staticVol) || 0.22;
    staticGainNode.gain.setValueAtTime(baseStatic, audioCtx.currentTime);

    staticNoiseNode.connect(filter);
    filter.connect(staticGainNode);
    staticGainNode.connect(audioCtx.destination);
    staticNoiseNode.start();
  } catch (e) {}
}

function setRadioStaticLevel(ratio) {
  if (!staticGainNode || !audioCtx) return;
  const maxStatic = Number(window.CONFIG.staticVol) || 0.22;
  const target = Math.max(0, Math.min(1, ratio)) * maxStatic;
  staticGainNode.gain.setTargetAtTime(target, audioCtx.currentTime, 0.08);
}

function stopRadioStatic() {
  try {
    if (staticNoiseNode) {
      staticNoiseNode.stop();
      staticNoiseNode.disconnect();
      staticNoiseNode = null;
      staticGainNode = null;
    }
  } catch (e) {}
}

// 公共電話「嘟————」待撥長音 (350Hz + 440Hz 標準美規待撥音)
function startDialTone() {
  try {
    ensureAudioContext();
    stopDialTone();
    dialToneOsc1 = audioCtx.createOscillator();
    dialToneOsc2 = audioCtx.createOscillator();
    dialToneGain = audioCtx.createGain();
    dialToneOsc1.frequency.value = 350;
    dialToneOsc2.frequency.value = 440;
    dialToneGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    dialToneOsc1.connect(dialToneGain);
    dialToneOsc2.connect(dialToneGain);
    dialToneGain.connect(audioCtx.destination);
    dialToneOsc1.start();
    dialToneOsc2.start();
  } catch (e) {}
}

function stopDialTone() {
  try {
    if (dialToneOsc1) { dialToneOsc1.stop(); dialToneOsc1.disconnect(); dialToneOsc1 = null; }
    if (dialToneOsc2) { dialToneOsc2.stop(); dialToneOsc2.disconnect(); dialToneOsc2 = null; }
    if (dialToneGain) { dialToneGain.disconnect(); dialToneGain = null; }
  } catch (e) {}
}

// 電話按鍵雙音多頻 (DTMF) 撥號音效
const DTMF_MAP = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
};

function playDTMFTone(digit = '1', duration = 0.13) {
  try {
    ensureAudioContext();
    const pair = DTMF_MAP[String(digit)] || [770, 1336];
    const o1 = audioCtx.createOscillator();
    const o2 = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o1.frequency.value = pair[0];
    o2.frequency.value = pair[1];
    g.gain.setValueAtTime(0.12, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    o1.connect(g);
    o2.connect(g);
    g.connect(audioCtx.destination);
    o1.start();
    o2.start();
    o1.stop(audioCtx.currentTime + duration);
    o2.stop(audioCtx.currentTime + duration);
    if (navigator.vibrate) navigator.vibrate(20);
  } catch (e) {}
}

// 模擬撥出號碼串 ➔ 響鈴兩聲 ➔ 咔噠接起電話
function playRingbackAndPickup(digitsStr = "1119", onConnected) {
  stopDialTone();
  const digits = digitsStr.split('');
  let delay = 0;
  digits.forEach(d => {
    setTimeout(() => playDTMFTone(d, 0.12), delay);
    delay += 180;
  });

  // 撥完號碼後響一聲回鈴音 (440+480Hz)
  setTimeout(() => {
    try {
      ensureAudioContext();
      const r1 = audioCtx.createOscillator();
      const r2 = audioCtx.createOscillator();
      const rg = audioCtx.createGain();
      r1.frequency.value = 440;
      r2.frequency.value = 480;
      rg.gain.setValueAtTime(0.09, audioCtx.currentTime);
      rg.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);
      r1.connect(rg);
      r2.connect(rg);
      rg.connect(audioCtx.destination);
      r1.start();
      r2.start();
      r1.stop(audioCtx.currentTime + 0.95);
      r2.stop(audioCtx.currentTime + 0.95);
    } catch (e) {}
  }, delay + 250);

  setTimeout(() => {
    playSwitchClick();
    if (typeof onConnected === 'function') onConnected();
  }, delay + 1450);
}

// 統一語音播放與視訊共遊進度同步條 (自動降低 BGM + 顯示頂部秒數)
let activeVoiceTimer = null;

function formatSec(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const r = String(s % 60).padStart(2, '0');
  return `${m}:${r}`;
}

function playVoiceTrackWithSync(audioUrl, labelText, fallbackDurationSec = 10, onTick, onFinish) {
  stopActiveVoiceTrack(false);
  const bgm = document.getElementById('bgm-player');
  const vp = document.getElementById('voice-player');
  const syncPill = document.getElementById('visual-audio-sync');
  const syncLabel = document.getElementById('audio-sync-label');
  const syncTime = document.getElementById('audio-sync-time');

  // 自動壓低背景音樂 (Audio Ducking)
  if (bgm) bgm.volume = Number(window.CONFIG.duckVol) || 0.08;

  if (syncPill) {
    syncPill.classList.remove('hidden');
    syncLabel.textContent = labelText || '語音播放中';
  }

  // 若有真實音檔則播放真實音檔，若尚未上傳則以字幕閱讀計時模擬
  if (audioUrl && audioUrl.trim() !== '') {
    vp.src = audioUrl;
    vp.currentTime = 0;
    vp.play().catch(() => {});

    activeVoiceTimer = setInterval(() => {
      const cur = vp.currentTime || 0;
      const dur = vp.duration && isFinite(vp.duration) ? vp.duration : fallbackDurationSec;
      if (syncTime) syncTime.textContent = `${formatSec(cur)} / ${formatSec(dur)}`;
      if (typeof onTick === 'function') onTick(cur, dur);
    }, 200);

    vp.onended = () => {
      completeVoicePlayback(onFinish);
    };
    vp.onerror = () => {
      runSimulatedTimer(fallbackDurationSec, syncTime, onTick, onFinish);
    };
  } else {
    runSimulatedTimer(fallbackDurationSec, syncTime, onTick, onFinish);
  }
}

function runSimulatedTimer(durationSec, syncTimeEl, onTick, onFinish) {
  let elapsed = 0;
  if (syncTimeEl) syncTimeEl.textContent = `00:00 / ${formatSec(durationSec)}`;
  activeVoiceTimer = setInterval(() => {
    elapsed += 0.25;
    if (syncTimeEl) syncTimeEl.textContent = `${formatSec(elapsed)} / ${formatSec(durationSec)}`;
    if (typeof onTick === 'function') onTick(elapsed, durationSec);
    if (elapsed >= durationSec) {
      completeVoicePlayback(onFinish);
    }
  }, 250);
}

function completeVoicePlayback(onFinish) {
  clearInterval(activeVoiceTimer);
  activeVoiceTimer = null;
  const bgm = document.getElementById('bgm-player');
  if (bgm) bgm.volume = Number(window.CONFIG.bgmVol) || 0.45;
  const syncPill = document.getElementById('visual-audio-sync');
  if (syncPill) syncPill.classList.add('hidden');
  playSkyChime(880, 0.9);
  if (typeof onFinish === 'function') onFinish();
}

function stopActiveVoiceTrack(restoreBgm = true) {
  clearInterval(activeVoiceTimer);
  activeVoiceTimer = null;
  const vp = document.getElementById('voice-player');
  if (vp) {
    vp.pause();
    vp.onended = null;
  }
  const syncPill = document.getElementById('visual-audio-sync');
  if (syncPill) syncPill.classList.add('hidden');
  if (restoreBgm) {
    const bgm = document.getElementById('bgm-player');
    if (bgm) bgm.volume = Number(window.CONFIG.bgmVol) || 0.45;
  }
}

/********************************************************************
 * 4. 跨章節電影級無縫轉場引擎 (triggerChapterTransition)
 ********************************************************************/
let transAnimId = null;

function triggerChapterTransition(fromCh, toCh) {
  stopActiveVoiceTrack(true);
  stopRadioStatic();
  stopDialTone();

  const overlay = document.getElementById('cinematic-transition-overlay');
  const iconEl = document.getElementById('trans-visual-icon');
  const zhEl = document.getElementById('trans-zh');
  const enEl = document.getElementById('trans-en');
  const btn = document.getElementById('trans-continue-btn');
  const C = window.CONFIG;

  let icon = '✦';
  let zhText = '';
  let enText = '';
  let btnLabel = '繼續前行 ➔';
  let mode = 'arch';

  if (fromCh === 1 && toCh === 2) {
    icon = '🏛️';
    zhText = C.trans12Zh;
    enText = C.trans12En;
    btnLabel = '推開午夜美術館大門 ➔';
    mode = 'arch';
  } else if (fromCh === 2 && toCh === 3) {
    icon = '📻';
    zhText = C.trans23Zh;
    enText = C.trans23En;
    btnLabel = '走近窗台上的微光收音機 ➔';
    mode = 'lightsOut';
  } else if (fromCh === 3 && toCh === 4) {
    icon = '☎️';
    zhText = C.trans34Zh;
    enText = C.trans34En;
    btnLabel = '推開午夜電話亭玻璃門 ➔';
    mode = 'phoneBooth';
  } else if (fromCh === 4 && toCh === 5) {
    icon = '🌌';
    zhText = C.trans45Zh;
    enText = C.trans45En;
    btnLabel = '踏入時光星河長卷 ➔';
    mode = 'goldenThread';
  }

  iconEl.textContent = icon;
  zhEl.textContent = zhText;
  enEl.textContent = enText;
  btn.textContent = btnLabel;
  btn.style.display = 'none';

  overlay.classList.add('active');
  playSkyChime(659.25, 1.6);
  startTransitionCanvasEffect(mode);

  // 停頓 2.2 秒讓情緒沉澱後浮現進入下一章按鈕
  setTimeout(() => {
    btn.style.display = 'inline-block';
  }, 2200);

  btn.onclick = () => {
    playSkyChime(783.99, 1.2);
    cancelAnimationFrame(transAnimId);
    overlay.classList.remove('active');
    jumpToStage(toCh);
  };
}

function startTransitionCanvasEffect(mode) {
  cancelAnimationFrame(transAnimId);
  const cvs = document.getElementById('transition-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  const w = cvs.width;
  const h = cvs.height;

  const particles = Array.from({ length: 90 }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2.4 + 0.8,
    ang: (i / 90) * Math.PI * 2,
    spd: Math.random() * 0.02 + 0.008
  }));

  let t = 0;
  function render() {
    t += 0.025;
    ctx.clearRect(0, 0, w, h);

    if (mode === 'arch') {
      // 金色星塵向中央拱門匯聚
      particles.forEach(p => {
        p.ang += p.spd;
        const rx = Math.min(w, h) * 0.28;
        const tx = w / 2 + Math.cos(p.ang) * rx;
        const ty = h / 2 + Math.sin(p.ang) * rx * 0.8;
        p.x += (tx - p.x) * 0.04;
        p.y += (ty - p.y) * 0.04;
        ctx.fillStyle = 'rgba(246, 211, 101, 0.78)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (mode === 'lightsOut') {
      // 聚光燈逐一溫暖熄滅、中央亮起真空管橘光
      const glowRadius = 60 + Math.sin(t * 2) * 18;
      const g = ctx.createRadialGradient(w / 2, h * 0.35, 4, w / 2, h * 0.35, glowRadius);
      g.addColorStop(0, 'rgba(253, 160, 133, 0.55)');
      g.addColorStop(1, 'rgba(253, 160, 133, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.35, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    } else if (mode === 'phoneBooth') {
      // 迷霧中浮現電話亭暖黃光暈框
      ctx.strokeStyle = `rgba(246, 211, 101, ${0.25 + Math.sin(t * 2) * 0.12})`;
      ctx.lineWidth = 2;
      const bw = 150, bh = 250;
      ctx.strokeRect(w / 2 - bw / 2, h / 2 - bh / 2 - 20, bw, bh);
    } else {
      // 金色時間絲線蜿蜒流動
      ctx.strokeStyle = 'rgba(246, 211, 101, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < w; x += 12) {
        const y = h / 2 + Math.sin(x * 0.012 + t * 2) * 55;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    transAnimId = requestAnimationFrame(render);
  }
  render();
}

/********************************************************************
 * 5. STAGE 0: 電影質感開場動畫與密碼驗證
 ********************************************************************/
function playIntroSequence() {
  const sal = document.getElementById('intro-salutation');
  const openWrap = document.getElementById('intro-opening-wrap');
  const logoCard = document.getElementById('intro-logo-card');

  sal.classList.remove('show');
  openWrap.classList.remove('show');
  logoCard.classList.remove('show');

  setTimeout(() => sal.classList.add('show'), 300);
  setTimeout(() => openWrap.classList.add('show'), 2300);
  setTimeout(() => logoCard.classList.add('show'), 4600);
}

function initIntroStars() {
  const cvs = document.getElementById('intro-star-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  function resize() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * cvs.width,
    y: Math.random() * cvs.height,
    r: Math.random() * 1.8 + 0.4,
    a: Math.random() * Math.PI * 2,
    s: Math.random() * 0.018 + 0.005
  }));

  function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    stars.forEach(st => {
      st.a += st.s;
      const alpha = ((Math.sin(st.a) + 1) / 2) * 0.8 + 0.15;
      ctx.fillStyle = `rgba(246, 211, 101, ${alpha})`;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

document.getElementById('start-journey-btn').addEventListener('click', () => {
  const val = document.getElementById('passcode-input').value.trim();
  const targetPass = String(window.CONFIG.passcode || '1119').trim();
  if (val === targetPass) {
    setText('passcode-error', '');
    ensureAudioContext();
    playSkyChime(587.33, 1.4);
    const bgm = document.getElementById('bgm-player');
    if (bgm) bgm.play().catch(() => {});
    jumpToStage(1);
  } else {
    setText('passcode-error', '密碼不正確喔，請輸入專屬的 4 位數字 ✦');
    if (navigator.vibrate) navigator.vibrate(120);
  }
});

document.getElementById('passcode-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('start-journey-btn').click();
});

document.getElementById('bgm-toggle-btn').addEventListener('click', () => {
  const bgm = document.getElementById('bgm-player');
  const btn = document.getElementById('bgm-toggle-btn');
  if (!bgm) return;
  if (bgm.paused) {
    bgm.play().catch(() => {});
    btn.style.opacity = '1';
  } else {
    bgm.pause();
    btn.style.opacity = '0.45';
  }
});

/********************************************************************
 * 6. STAGE 1: Three.js 3D《光·遇》世界 (支援搖桿 ＋ 鍵盤 WASD/方向鍵 ＋ 三態自適應視角)
 ********************************************************************/
let threeScene, threeCamera, threeRenderer, playerGroup, partnerGroup, capeMesh, starParticles;
let currentKm = 12680;
let joyVec = { x: 0, y: 0 };
let keyVec = { x: 0, y: 0 };
let ch1Completed = false;
let reunionZoomProgress = 0;

function initThreeSkyWorld() {
  const container = document.getElementById('three-container');
  if (!container) return;

  currentKm = Number(window.CONFIG.totalKm) || 12680;
  ch1Completed = false;
  reunionZoomProgress = 0;
  setText('km-counter', currentKm.toLocaleString());

  if (threeRenderer) {
    resetSkyPositions();
    updateThreeCameraResponsive();
    return;
  }

  threeScene = new THREE.Scene();
  threeScene.fog = new THREE.FogExp2(0x0a1124, 0.024);

  threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
  updateThreeCameraResponsive();

  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  threeRenderer.setSize(window.innerWidth, window.innerHeight);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(threeRenderer.domElement);

  const ambLight = new THREE.AmbientLight(0x738bc0, 1.15);
  threeScene.add(ambLight);

  const horizonLight = new THREE.PointLight(0xf6d365, 2.8, 130);
  horizonLight.position.set(0, 6, -45);
  threeScene.add(horizonLight);

  // 星光淺灘反射地面
  const groundGeo = new THREE.PlaneGeometry(200, 260, 32, 32);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0e1830,
    roughness: 0.22,
    metalness: 0.65
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  threeScene.add(ground);

  // 主角小人與流光披風
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffe4a0,
    emissiveIntensity: 0.7
  });
  playerGroup = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), bodyMat);
  head.position.y = 1.35;
  const torso = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.95, 16), bodyMat);
  torso.position.y = 0.72;

  const capeGeo = new THREE.PlaneGeometry(0.78, 1.08, 8, 8);
  const capeMat = new THREE.MeshStandardMaterial({
    color: 0xf6d365,
    emissive: 0xfda085,
    emissiveIntensity: 0.55,
    side: THREE.DoubleSide
  });
  capeMesh = new THREE.Mesh(capeGeo, capeMat);
  capeMesh.position.set(0, 0.85, 0.22);
  capeMesh.rotation.x = 0.35;
  playerGroup.add(head, torso, capeMesh);
  threeScene.add(playerGroup);

  // 遠方天際線等待的你與發光燈塔光柱
  partnerGroup = new THREE.Group();
  const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), bodyMat);
  pHead.position.y = 1.35;
  const pTorso = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.95, 16), bodyMat);
  pTorso.position.y = 0.72;
  const beaconGeo = new THREE.CylinderGeometry(0.18, 0.9, 36, 16, 1, true);
  const beaconMat = new THREE.MeshBasicMaterial({
    color: 0xf6d365,
    transparent: true,
    opacity: 0.24,
    side: THREE.DoubleSide
  });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.y = 18;
  partnerGroup.add(pHead, pTorso, beacon);
  partnerGroup.position.set(0, 0, -45);
  threeScene.add(partnerGroup);

  // 漫天流光星塵粒子
  const pCount = 360;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 55;
    pPos[i + 1] = Math.random() * 15 + 0.2;
    pPos[i + 2] = -Math.random() * 65 + 10;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xf6d365, size: 0.19, transparent: true, opacity: 0.85 });
  starParticles = new THREE.Points(pGeo, pMat);
  threeScene.add(starParticles);

  resetSkyPositions();
  animateThreeWorld();
}

function resetSkyPositions() {
  if (!playerGroup || !partnerGroup) return;
  playerGroup.position.set(0, 0, 0);
  partnerGroup.position.set(0, 0, -45);
  const twCard = document.getElementById('sky-photo-tw');
  const usCard = document.getElementById('sky-photo-us');
  if (twCard && usCard) {
    twCard.style.filter = 'blur(18px)';
    usCard.style.filter = 'blur(18px)';
    twCard.style.opacity = '0.28';
    usCard.style.opacity = '0.28';
  }
}

// 依據電腦寬螢幕橫式 / 手機直式 / 手機橫式自動調整 3D 攝影機視野
function updateThreeCameraResponsive() {
  if (!threeCamera) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const aspect = w / h;
  threeCamera.aspect = aspect;
  // 橫式寬螢幕採用更遼闊的視角，直式螢幕拉高仰角確保天際線與雙城照片完整呈現
  if (aspect > 1.1) {
    threeCamera.fov = 54;
    threeCamera.position.set(0, 2.15, 5.8);
    threeCamera.lookAt(0, 1.85, -12);
  } else {
    threeCamera.fov = 65;
    threeCamera.position.set(0, 2.45, 6.8);
    threeCamera.lookAt(0, 2.0, -10);
  }
  threeCamera.updateProjectionMatrix();
}

let skyClock = 0;
function animateThreeWorld() {
  requestAnimationFrame(animateThreeWorld);
  if (!threeRenderer || window.currentStageIndex !== 1) return;
  skyClock += 0.05;

  const inputX = Math.max(-1, Math.min(1, joyVec.x + keyVec.x));
  const inputY = Math.max(-1, Math.min(1, joyVec.y + keyVec.y));
  const moveIntensity = Math.max(0, -inputY);

  if (moveIntensity > 0.06 && !ch1Completed) {
    const stepDec = (Number(window.CONFIG.stepKm) || 48) * moveIntensity * 0.45;
    currentKm = Math.max(0, currentKm - stepDec);
    setText('km-counter', Math.round(currentKm).toLocaleString());

    playerGroup.position.x = THREE.MathUtils.clamp(playerGroup.position.x + inputX * 0.08, -2.8, 2.8);
    playerGroup.position.y = Math.abs(Math.sin(skyClock * 2.7)) * 0.16;
    capeMesh.rotation.x = 0.46 + Math.sin(skyClock * 4.2) * 0.18;

    const total = Number(window.CONFIG.totalKm) || 12680;
    const progress = 1 - currentKm / total;

    partnerGroup.position.z = -45 + progress * 43.2;

    const blurPx = Math.max(0, (1 - progress) * 18).toFixed(1);
    const opacityVal = (0.28 + progress * 0.68).toFixed(2);
    const twCard = document.getElementById('sky-photo-tw');
    const usCard = document.getElementById('sky-photo-us');
    if (twCard && usCard) {
      twCard.style.filter = `blur(${blurPx}px)`;
      usCard.style.filter = `blur(${blurPx}px)`;
      twCard.style.opacity = opacityVal;
      usCard.style.opacity = opacityVal;
    }

    const C = window.CONFIG;
    if (progress < 0.35) {
      setText('ch1-zh-sub', C.ch1Sub1Zh);
      setText('ch1-en-sub', C.ch1Sub1En);
    } else if (progress < 0.78) {
      setText('ch1-zh-sub', C.ch1Sub2Zh);
      setText('ch1-en-sub', C.ch1Sub2En);
    } else {
      setText('ch1-zh-sub', C.ch1Sub3Zh);
      setText('ch1-en-sub', C.ch1Sub3En);
    }

    if (currentKm <= 0 && !ch1Completed) {
      ch1Completed = true;
      playSkyChime(783.99, 1.8);
      setText('ch1-zh-sub', '距離 0 KM｜星光相擁，正在凝聚你們的記憶長廊… ✦');
      setText('ch1-en-sub', '0 KM — Together in starlight. Crystallizing our memories…');
      setTimeout(() => {
        triggerChapterTransition(1, 2);
      }, 2200);
    }
  } else if (ch1Completed) {
    // 0 KM 相擁時鏡頭緩緩推進並讓星塵向上升起
    reunionZoomProgress = Math.min(1, reunionZoomProgress + 0.015);
    threeCamera.position.z = THREE.MathUtils.lerp(threeCamera.position.z, 3.2, 0.04);
    if (starParticles) starParticles.position.y += 0.06;
  } else {
    playerGroup.position.y = Math.sin(skyClock) * 0.04;
    capeMesh.rotation.x = 0.3 + Math.sin(skyClock * 1.5) * 0.05;
  }

  if (starParticles && !ch1Completed) {
    starParticles.position.z += moveIntensity > 0.06 ? 0.26 : 0.03;
    if (starParticles.position.z > 15) starParticles.position.z = 0;
  }

  threeRenderer.render(threeScene, threeCamera);
}

// 觸控／滑鼠虛擬搖桿 + 電腦鍵盤 WASD / 方向鍵支援
(function setupChapter1Controls() {
  const zone = document.getElementById('joystick-zone');
  const knob = document.getElementById('joystick-knob');
  if (!zone || !knob) return;
  let dragging = false;
  const maxR = 40;

  function updateKnob(clientX, clientY) {
    const r = zone.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    joyVec.x = dx / maxR;
    joyVec.y = dy / maxR;
  }

  function resetKnob() {
    dragging = false;
    knob.style.transform = 'translate(0px, 0px)';
    joyVec.x = 0;
    joyVec.y = 0;
  }

  zone.addEventListener('pointerdown', e => {
    dragging = true;
    zone.setPointerCapture(e.pointerId);
    updateKnob(e.clientX, e.clientY);
  });
  zone.addEventListener('pointermove', e => {
    if (dragging) updateKnob(e.clientX, e.clientY);
  });
  zone.addEventListener('pointerup', resetKnob);
  zone.addEventListener('pointercancel', resetKnob);

  // 電腦鍵盤支援 (W/A/S/D 與 方向鍵)
  window.addEventListener('keydown', e => {
    if (window.currentStageIndex !== 1) return;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keyVec.y = -1;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keyVec.x = -0.8;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keyVec.x = 0.8;
  });
  window.addEventListener('keyup', e => {
    if (['ArrowUp', 'w', 'W'].includes(e.key)) keyVec.y = 0;
    if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) keyVec.x = 0;
  });
})();

/********************************************************************
 * 7. STAGE 2: 午夜微型美術館（三階段深度互動：破冰提問 ➔ 開燈找光點 ➔ 典藏銘牌）
 ********************************************************************/
let currentMuseumIdx = 0;

function initMuseumChapter() {
  currentMuseumIdx = 0;
  renderMuseumArtwork(0);
}

function renderMuseumArtwork(idx) {
  const list = window.CONFIG.museum || [];
  if (!list.length) return;
  currentMuseumIdx = Math.max(0, Math.min(idx, list.length - 1));
  const item = list[currentMuseumIdx];

  stopActiveVoiceTrack(true);

  // 重置為階段 1：聚光燈關閉、畫作暗幕、顯示破冰提問卡
  const beam = document.getElementById('museum-spotlight-beam');
  const dimMask = document.getElementById('museum-dim-mask');
  const imgEl = document.getElementById('museum-current-img');
  const hotspotBtn = document.getElementById('museum-hotspot-btn');
  const hotspotPop = document.getElementById('museum-hotspot-pop');

  const step1Card = document.getElementById('museum-step1-card');
  const step2Card = document.getElementById('museum-step2-card');
  const step3Plaque = document.getElementById('museum-step3-plaque');

  if (beam) beam.classList.remove('lit');
  if (dimMask) dimMask.classList.remove('lit');
  if (imgEl) imgEl.src = item.img || '';

  if (hotspotBtn) {
    hotspotBtn.classList.add('hidden');
    hotspotBtn.style.left = `${item.hotspotX || 50}%`;
    hotspotBtn.style.top = `${item.hotspotY || 50}%`;
  }
  if (hotspotPop) {
    hotspotPop.classList.add('hidden');
    hotspotPop.textContent = item.hotspotNote || '✦ 你找到了這幅畫裡的專屬細節！';
  }

  if (step1Card) step1Card.classList.remove('hidden');
  if (step2Card) step2Card.classList.add('hidden');
  if (step3Plaque) step3Plaque.classList.add('hidden');

  setText('museum-progress-text', `館藏 ${currentMuseumIdx + 1} / ${list.length}`);
  setText('museum-q-text', item.question || '先猜猜看這張照片背後的故事吧！');
  setText('museum-plaque-title', item.title || '');
  setText('museum-plaque-date', item.date || '');
  setText('museum-plaque-desc', item.desc || '');

  const audioBtn = document.getElementById('museum-audio-btn');
  if (audioBtn) {
    if (item.audio && item.audio.trim() !== '') {
      audioBtn.classList.remove('hidden');
      audioBtn.onclick = () => {
        playVoiceTrackWithSync(item.audio, `館藏 #${currentMuseumIdx + 1} 語音導覽`, 15);
      };
    } else {
      audioBtn.classList.add('hidden');
    }
  }

  const nextBtn = document.getElementById('museum-next-btn');
  if (nextBtn) {
    if (currentMuseumIdx < list.length - 1) {
      nextBtn.textContent = `走向下一幅館藏 (${currentMuseumIdx + 2}/${list.length}) ➔`;
    } else {
      nextBtn.textContent = '走出畫廊・前往窗台微光收音機 ➔';
    }
  }
}

// 階段 1 ➔ 階段 2：拉開黃銅燈繩點亮聚光燈，浮現照片上的閃爍記憶光點
document.getElementById('museum-light-switch').addEventListener('click', () => {
  playSwitchClick();
  playSkyChime(587.33, 1.1);
  document.getElementById('museum-spotlight-beam').classList.add('lit');
  document.getElementById('museum-dim-mask').classList.add('lit');
  document.getElementById('museum-step1-card').classList.add('hidden');
  document.getElementById('museum-step2-card').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('museum-hotspot-btn').classList.remove('hidden');
  }, 450);
});

// 階段 2 ➔ 階段 3：點擊照片上的記憶光點，彈出細節小語並解鎖黃銅典藏銘牌
document.getElementById('museum-hotspot-btn').addEventListener('click', () => {
  playSkyChime(783.99, 1.3);
  document.getElementById('museum-hotspot-btn').classList.add('hidden');
  const pop = document.getElementById('museum-hotspot-pop');
  pop.classList.remove('hidden');
  document.getElementById('museum-step2-card').classList.add('hidden');
  document.getElementById('museum-step3-plaque').classList.remove('hidden');

  // 若該畫作有設定導覽語音，自動貼心播放
  const item = (window.CONFIG.museum || [])[currentMuseumIdx];
  if (item && item.audio && item.audio.trim() !== '') {
    playVoiceTrackWithSync(item.audio, `館藏 #${currentMuseumIdx + 1} 語音導覽`, 15);
  }
});

// 階段 3：前往下一幅畫作或觸發【第2章 ➔ 第3章】熄燈轉場
document.getElementById('museum-next-btn').addEventListener('click', () => {
  const list = window.CONFIG.museum || [];
  if (currentMuseumIdx < list.length - 1) {
    playSwitchClick();
    renderMuseumArtwork(currentMuseumIdx + 1);
  } else {
    triggerChapterTransition(2, 3);
  }
});

/********************************************************************
 * 8. 全局舞台跳轉與視窗自適應監聽 (jumpToStage & Resize)
 ********************************************************************/
const STAGE_IDS = ['stage-intro', 'stage-ch1', 'stage-ch2', 'stage-ch3', 'stage-ch4', 'stage-ch5'];

function jumpToStage(idx) {
  window.currentStageIndex = idx;
  stopActiveVoiceTrack(true);
  stopRadioStatic();
  stopDialTone();

  STAGE_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (i === idx) el.classList.add('active');
    else el.classList.remove('active');
  });

  if (idx === 0) playIntroSequence();
  if (idx === 1) initThreeSkyWorld();
  if (idx === 2) initMuseumChapter();
  if (idx === 3 && typeof enterRadioStage === 'function') enterRadioStage();
  if (idx === 4 && typeof enterPayphoneStage === 'function') enterPayphoneStage();
  if (idx === 5 && typeof enterTimelineStage === 'function') enterTimelineStage();

  const adminModal = document.getElementById('admin-modal');
  if (adminModal) adminModal.style.display = 'none';
}

window.addEventListener('resize', () => {
  if (threeRenderer && threeCamera) {
    updateThreeCameraResponsive();
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  if (typeof drawGoldenThreadSVG === 'function' && window.currentStageIndex === 5) {
    drawGoldenThreadSVG();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  initIntroStars();
  await loadInitialConfig();
  playIntroSequence();
});
