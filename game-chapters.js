/* ==========================================================================
   DEAR HOWARD - 後三章深度互動與博物館級登機證引擎 (game-chapters.js)
   包含：第3章(順逆時針旋鈕收音機) / 第4章(跨時空電話亭) / 第5章(蜿蜒星軌畫布) / 典藏登機證
   ========================================================================== */

/********************************************************************
 * 1. STAGE 3: 跨越太平洋的微光收音機
 *    (360度順逆時針圓形旋鈕 × 低頻雜訊距離淡出 × 命中發光與播音鎖定)
 ********************************************************************/
let currentFreq = 88.0;
let wheelAngleDeg = 0;
let radioDialLocked = false;
let unlockedRadioIndices = new Set();

function initRadioChapter() {
  currentFreq = 88.0;
  wheelAngleDeg = 0;
  radioDialLocked = false;
  unlockedRadioIndices.clear();
  updateRadioUI();
}

function enterRadioStage() {
  initRadioChapter();
  startRadioStatic();
  evaluateRadioFrequency(currentFreq);
}

function updateRadioUI() {
  const channels = window.CONFIG.radio || [];
  const total = channels.length;
  const doneCount = unlockedRadioIndices.size;

  setText('radio-collected-stars', `已尋獲頻率：${doneCount} / ${total}`);
  setText('freq-val', currentFreq.toFixed(1));

  const wheel = document.getElementById('rotary-dial-wheel');
  if (wheel) {
    wheel.style.transform = `rotate(${wheelAngleDeg}deg)`;
    if (radioDialLocked) wheel.classList.add('locked');
    else wheel.classList.remove('locked');
  }

  const nextBtn = document.getElementById('to-ch4-btn');
  if (nextBtn) {
    if (total > 0 && doneCount >= total && !radioDialLocked) {
      nextBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.add('hidden');
    }
  }
}

// 根據當前頻率計算與最近「尚未收聽頻道」的距離，動態控制低頻雜訊與訊號燈
function evaluateRadioFrequency(freqVal) {
  if (radioDialLocked) return;

  const channels = window.CONFIG.radio || [];
  let minDiff = 999;
  let matchedIndex = -1;

  channels.forEach((ch, idx) => {
    const targetF = parseFloat(ch.freq);
    if (isNaN(targetF)) return;
    const diff = Math.abs(freqVal - targetF);
    if (diff < minDiff) {
      minDiff = diff;
    }
    // 命中尚未播放過的目標頻道 (誤差 <= 0.15 MHz)
    if (diff <= 0.15 && !unlockedRadioIndices.has(idx)) {
      matchedIndex = idx;
    }
  });

  // 更新訊號強度格數 (距離目標 2.5 MHz 內開始亮起訊號格，雜訊同步淡出)
  const bars = document.querySelectorAll('#signal-bars span');
  let litCount = 1;
  let staticRatio = 1.0;

  if (minDiff <= 0.15) {
    litCount = 5;
    staticRatio = 0.0;
  } else if (minDiff < 0.6) {
    litCount = 4;
    staticRatio = 0.22;
  } else if (minDiff < 1.3) {
    litCount = 3;
    staticRatio = 0.5;
  } else if (minDiff < 2.4) {
    litCount = 2;
    staticRatio = 0.78;
  } else {
    litCount = 1;
    staticRatio = 1.0;
  }

  bars.forEach((bar, i) => {
    if (i < litCount) bar.classList.add('lit');
    else bar.classList.remove('lit');
  });

  setRadioStaticLevel(staticRatio);

  if (minDiff < 1.2 && matchedIndex === -1) {
    setText('signal-strength-text', '✨ 訊號越來越清晰了，請放慢速度微調…');
  } else {
    setText('signal-strength-text', '訊號波段搜尋中...');
  }

  // 當精準轉到目標頻道：觸發發光特效、鎖定旋鈕、播放專屬音檔
  if (matchedIndex !== -1) {
    lockAndPlayRadioChannel(matchedIndex);
  }
}

function lockAndPlayRadioChannel(idx) {
  const channels = window.CONFIG.radio || [];
  const target = channels[idx];
  if (!target) return;

  radioDialLocked = true;
  currentFreq = parseFloat(target.freq);
  setRadioStaticLevel(0); // 雜訊完全淡出歸零

  const screenBox = document.getElementById('freq-screen-box');
  const lockBanner = document.getElementById('radio-lock-badge');
  if (screenBox) screenBox.classList.add('locked-glow');
  if (lockBanner) lockBanner.classList.remove('hidden');

  setText('freq-val', currentFreq.toFixed(1));
  setText('signal-strength-text', `★ 已鎖定波段 FM ${currentFreq.toFixed(1)}`);
  setText('freq-status', `✦ 正在播放：${target.label || '專屬語音訊號'}`);
  setText('voice-transcript', target.transcript || '');
  updateRadioUI();

  playSkyChime(740, 1.2);
  if (navigator.vibrate) navigator.vibrate([40, 60, 40]);

  // 播放音檔（期間旋鈕保持鎖定，不會因為誤觸而中斷）
  playVoiceTrackWithSync(
    target.audio,
    `FM ${currentFreq.toFixed(1)} 語音訊號`,
    12,
    null,
    () => {
      // 播音完畢：解除發光、解鎖旋鈕、標記完成並提示繼續旋轉
      unlockedRadioIndices.add(idx);
      radioDialLocked = false;
      if (screenBox) screenBox.classList.remove('locked-glow');
      if (lockBanner) lockBanner.classList.add('hidden');

      const total = channels.length;
      const done = unlockedRadioIndices.size;

      if (done < total) {
        setText('freq-status', `✓ 此波段接收完畢！請順／逆時針繼續轉動旋鈕，尋找下一道頻率 (${done}/${total})`);
        setText('signal-strength-text', '請轉動旋鈕繼續搜尋...');
        setRadioStaticLevel(0.75);
      } else {
        setText('freq-status', `🎉 恭喜！你已完整收聽所有 ${total} 道跨海頻率！`);
        setText('signal-strength-text', '所有波段已尋獲 ✦');
        stopRadioStatic();
      }
      updateRadioUI();
    }
  );
}

// 綁定 360 度順／逆時針圓盤旋鈕手勢與滑鼠滾輪支援
(function setupRotaryKnobGesture() {
  const zone = document.getElementById('rotary-dial-zone');
  const wheel = document.getElementById('rotary-dial-wheel');
  if (!zone || !wheel) return;

  let isTurning = false;
  let lastPointerAngle = 0;
  let tickAccumulator = 0;

  function getAngleFromCenter(clientX, clientY) {
    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }

  zone.addEventListener('pointerdown', e => {
    if (radioDialLocked || window.currentStageIndex !== 3) return;
    ensureAudioContext();
    startRadioStatic();
    isTurning = true;
    zone.setPointerCapture(e.pointerId);
    lastPointerAngle = getAngleFromCenter(e.clientX, e.clientY);
  });

  zone.addEventListener('pointermove', e => {
    if (!isTurning || radioDialLocked || window.currentStageIndex !== 3) return;
    const curAngle = getAngleFromCenter(e.clientX, e.clientY);
    let delta = curAngle - lastPointerAngle;

    // 處理跨過 -180 / +180 度邊界的順逆時針連續角度計算
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastPointerAngle = curAngle;
    applyRotaryDelta(delta);
  });

  function stopTurning() {
    isTurning = false;
  }
  zone.addEventListener('pointerup', stopTurning);
  zone.addEventListener('pointercancel', stopTurning);

  // 電腦版額外支援滑鼠滾輪微調旋鈕
  zone.addEventListener('wheel', e => {
    if (radioDialLocked || window.currentStageIndex !== 3) return;
    e.preventDefault();
    ensureAudioContext();
    startRadioStatic();
    const delta = e.deltaY > 0 ? 8 : -8;
    applyRotaryDelta(delta);
  }, { passive: false });

  function applyRotaryDelta(deltaDeg) {
    wheelAngleDeg += deltaDeg;
    // 每順時針旋轉 12 度增加 0.1 MHz，逆時針減少 0.1 MHz
    const freqChange = (deltaDeg / 12) * 0.1;
    currentFreq = Math.max(88.0, Math.min(108.0, currentFreq + freqChange));

    tickAccumulator += Math.abs(deltaDeg);
    if (tickAccumulator >= 14) {
      tickAccumulator = 0;
      if (navigator.vibrate) navigator.vibrate(8);
    }

    updateRadioUI();
    evaluateRadioFrequency(currentFreq);
  }
})();

document.getElementById('to-ch4-btn').addEventListener('click', () => {
  triggerChapterTransition(3, 4);
});

/********************************************************************
 * 2. STAGE 4: 午夜跨時空公共電話亭
 *    (拿起話筒過場 × 待撥長音 × 過去/現在/未來三鍵撥號與回鈴 × 播畢過場)
 ********************************************************************/
let handsetOffHook = false;
let callInProgress = false;
let completedEras = new Set();

function initPayphoneChapter() {
  handsetOffHook = false;
  callInProgress = false;
  completedEras.clear();
  stopDialTone();

  const handsetBtn = document.getElementById('payphone-handset-btn');
  const keypad = document.getElementById('payphone-keypad-panel');
  const nextBtn = document.getElementById('to-ch5-btn');

  if (handsetBtn) handsetBtn.classList.remove('off-hook');
  if (keypad) keypad.classList.add('disabled-pad');
  if (nextBtn) nextBtn.classList.add('hidden');

  setText('handset-action-label', '點擊拿起話筒');
  setText('payphone-screen-status', '請先點擊左側拿起話筒...');
  setText('payphone-timer', '00:00');
  setText('payphone-transcript', '拿起話筒聽見「嘟——」待撥音後，請點擊「過去」、「現在」或「未來」專屬按鍵撥號。');

  const phoneCfg = window.CONFIG.phone || {};
  ['past', 'present', 'future'].forEach(era => {
    const btn = document.getElementById(`btn-call-${era}`);
    if (btn) btn.classList.remove('completed');
    if (phoneCfg[era] && phoneCfg[era].label) {
      setText(`label-call-${era}`, phoneCfg[era].label);
    }
    setText(`status-call-${era}`, '未撥通');
  });
}

function enterPayphoneStage() {
  initPayphoneChapter();
}

// 點擊話筒：模擬拿起話筒貼近耳邊，背景音樂自動降低，響起「嘟——」待撥音
document.getElementById('payphone-handset-btn').addEventListener('click', () => {
  if (callInProgress) return;
  playSwitchClick();

  const handsetBtn = document.getElementById('payphone-handset-btn');
  const keypad = document.getElementById('payphone-keypad-panel');
  const bgm = document.getElementById('bgm-player');

  if (!handsetOffHook) {
    handsetOffHook = true;
    handsetBtn.classList.add('off-hook');
    keypad.classList.remove('disabled-pad');
    setText('handset-action-label', '話筒已貼近耳邊');
    setText('payphone-screen-status', '🔊 待撥號中（請選擇下方時空專線）');
    setText('payphone-transcript', '耳邊傳來「嘟————」待撥音，請點擊下方【過去】、【現在】或【未來】按鍵撥出電話。');

    // 降低背景音樂，凸顯電話待撥音與後續通話
    if (bgm) bgm.volume = Number(window.CONFIG.duckVol) || 0.08;
    startDialTone();
  } else {
    // 掛回話筒
    handsetOffHook = false;
    handsetBtn.classList.remove('off-hook');
    keypad.classList.add('disabled-pad');
    setText('handset-action-label', '點擊拿起話筒');
    setText('payphone-screen-status', '話筒已掛上');
    stopDialTone();
    if (bgm) bgm.volume = Number(window.CONFIG.bgmVol) || 0.45;
  }
});

// 點擊一般金屬數字鍵也有真實 DTMF 按鍵音效回饋
document.querySelectorAll('.metal-key').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!handsetOffHook || callInProgress) return;
    stopDialTone();
    const digit = btn.getAttribute('data-digit') || '1';
    playDTMFTone(digit, 0.13);
    setText('payphone-screen-status', `撥號輸入：${digit}（請直接點擊下方過去／現在／未來專線）`);
  });
});

// 點擊「過去 PAST」、「現在 PRESENT」、「未來 FUTURE」三顆專屬按鍵
['past', 'present', 'future'].forEach(eraKey => {
  const btn = document.getElementById(`btn-call-${eraKey}`);
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!handsetOffHook || callInProgress) return;
    const phoneData = (window.CONFIG.phone && window.CONFIG.phone[eraKey]) || {};
    const dialNumber = phoneData.number || (eraKey === 'past' ? '0101' : eraKey === 'present' ? '1119' : '9999');

    callInProgress = true;
    const keypad = document.getElementById('payphone-keypad-panel');
    if (keypad) keypad.classList.add('disabled-pad');

    setText('payphone-screen-status', `📞 正在撥打跨時空專線 (${phoneData.label || eraKey})...`);
    setText('payphone-timer', 'DIAL');
    setText('payphone-transcript', '（嘟…嘟…正在跨越時空接通中，請稍候……）');

    // 先模擬撥號音與回鈴聲，接通後播放指定音檔
    playRingbackAndPickup(dialNumber, () => {
      setText('payphone-screen-status', `🟢 通話中：${phoneData.label || eraKey}`);
      setText('payphone-transcript', phoneData.transcript || '');

      playVoiceTrackWithSync(
        phoneData.audio,
        `公共電話｜${phoneData.label || eraKey}`,
        13,
        (curSec) => {
          setText('payphone-timer', formatSec(curSec));
        },
        () => {
          // 通話結束
          callInProgress = false;
          completedEras.add(eraKey);
          btn.classList.add('completed');
          setText(`status-call-${eraKey}`, '✓ 已通話');
          if (keypad) keypad.classList.remove('disabled-pad');

          if (completedEras.size < 3) {
            setText('payphone-screen-status', `通話結束（已完成 ${completedEras.size}/3 通時空電話）`);
            startDialTone();
          } else {
            stopDialTone();
            setText('payphone-screen-status', '✦ 過去、現在、未來三通電話皆已傾聽完畢！');
            document.getElementById('to-ch5-btn').classList.remove('hidden');
          }
        }
      );
    });
  });
});

document.getElementById('to-ch5-btn').addEventListener('click', () => {
  playSwitchClick();
  triggerChapterTransition(4, 5);
});

/********************************************************************
 * 3. STAGE 5: 蜿蜒星軌時間軸畫布 (Winding Starlight Timeline Canvas)
 ********************************************************************/
let ch5ParallaxAnimId = null;

function initTimelineChapter() {
  const container = document.getElementById('timeline-nodes-container');
  if (!container) return;
  container.innerHTML = '';

  const nodes = window.CONFIG.timeline || [];
  nodes.forEach((item, idx) => {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'timeline-node-item';
    nodeEl.setAttribute('data-node-idx', idx);
    nodeEl.innerHTML = `
      <div class="polaroid-card">
        <img src="${item.img}" alt="Timeline Memory ${idx + 1}" />
        <div class="polaroid-caption-date">${item.date || `MEMORY 0${idx + 1}`}</div>
      </div>
      <div class="node-quote-box">
        <div class="node-quote-title">✦ ${item.title || ''}</div>
        <div class="node-quote-text">${item.quote || ''}</div>
      </div>
    `;
    container.appendChild(nodeEl);
  });

  setTimeout(() => {
    drawGoldenThreadSVG();
    updateTimelineScrollVisibility();
  }, 150);
}

function enterTimelineStage() {
  initTimelineChapter();
  startCh5ParallaxStars();
  const vp = document.getElementById('starlight-scroll-viewport');
  if (vp) vp.scrollTop = 0;
}

// 動態計算每個拍立得節點座標，繪製貫穿其中的 S 型發光金色時間絲線
function drawGoldenThreadSVG() {
  const svg = document.getElementById('golden-thread-svg');
  const world = document.getElementById('starlight-canvas-world');
  const nodes = document.querySelectorAll('.timeline-node-item');
  const portal = document.getElementById('timeline-end-portal');
  if (!svg || !world || !nodes.length) return;

  const w = world.clientWidth || window.innerWidth;
  const h = world.scrollHeight || 1600;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);

  const pts = [{ x: w / 2, y: 90 }];
  nodes.forEach((n, i) => {
    const ny = n.offsetTop + n.offsetHeight * 0.45;
    const offsetX = (i % 2 === 0 ? -1 : 1) * Math.min(w * 0.18, 120);
    pts.push({ x: w / 2 + offsetX, y: ny });
  });

  if (portal) {
    pts.push({ x: w / 2, y: portal.offsetTop + 40 });
  }

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }

  svg.innerHTML = `
    <defs>
      <linearGradient id="goldThreadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f6d365" stop-opacity="0.2" />
        <stop offset="50%" stop-color="#ffe89e" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#fda085" stop-opacity="0.9" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path d="${d}" fill="none" stroke="url(#goldThreadGrad)" stroke-width="3.5" stroke-dasharray="8 6" filter="url(#goldGlow)" />
  `;
}

// 監聽滾動位置，當滑動到對應高度時優雅浮現照片與手寫敘事
function updateTimelineScrollVisibility() {
  const vp = document.getElementById('starlight-scroll-viewport');
  if (!vp) return;
  const viewH = vp.clientHeight;
  const nodes = document.querySelectorAll('.timeline-node-item');

  nodes.forEach(node => {
    const rect = node.getBoundingClientRect();
    if (rect.top < viewH * 0.85 && rect.bottom > 40) {
      if (!node.classList.contains('in-view')) {
        node.classList.add('in-view');
        playSkyChime(528 + Math.random() * 180, 0.9);
      }
    }
  });
}

document.getElementById('starlight-scroll-viewport').addEventListener('scroll', () => {
  updateTimelineScrollVisibility();
});

function startCh5ParallaxStars() {
  cancelAnimationFrame(ch5ParallaxAnimId);
  const cvs = document.getElementById('ch5-parallax-canvas');
  const vp = document.getElementById('starlight-scroll-viewport');
  if (!cvs || !vp) return;
  const ctx = cvs.getContext('2d');
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;

  const dust = Array.from({ length: 70 }, () => ({
    x: Math.random() * cvs.width,
    y: Math.random() * cvs.height,
    r: Math.random() * 2 + 0.5,
    factor: Math.random() * 0.35 + 0.1
  }));

  function render() {
    if (window.currentStageIndex !== 5) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    const scrollY = vp.scrollTop || 0;
    dust.forEach(p => {
      let py = (p.y - scrollY * p.factor) % cvs.height;
      if (py < 0) py += cvs.height;
      ctx.fillStyle = 'rgba(246, 211, 101, 0.55)';
      ctx.beginPath();
      ctx.arc(p.x, py, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ch5ParallaxAnimId = requestAnimationFrame(render);
  }
  render();
}

document.getElementById('to-ticket-portal-btn').addEventListener('click', () => {
  playSkyChime(880, 1.5);
  openFinalRitualDirectly(false);
});

/********************************************************************
 * 4. 終極儀式（吹熄蠟燭 ＋ 5秒掌心心跳）＆ 博物館典藏級燙金登機證繪製
 ********************************************************************/
let candleExtinguished = false;

function openFinalRitualDirectly(skipRitual = false) {
  const modal = document.getElementById('final-letter-modal');
  const ritualBox = document.getElementById('final-ritual-box');
  const treasureBox = document.getElementById('final-treasure-box');
  const palmSec = document.getElementById('palm-section');
  const flame = document.getElementById('candle-flame');

  modal.classList.add('active');
  document.getElementById('admin-modal').style.display = 'none';

  if (skipRitual) {
    ritualBox.classList.add('hidden');
    treasureBox.classList.remove('hidden');
    renderMuseumGradeBoardingPass();
  } else {
    candleExtinguished = false;
    ritualBox.classList.remove('hidden');
    treasureBox.classList.add('hidden');
    palmSec.classList.add('hidden');
    flame.textContent = '🕯️';
    flame.style.animation = 'flicker 0.9s infinite alternate';
    document.getElementById('mic-enable-btn').classList.remove('hidden');
  }
}

function triggerCandleExtinguish() {
  if (candleExtinguished) return;
  candleExtinguished = true;

  const flame = document.getElementById('candle-flame');
  flame.textContent = '✨🎂✨';
  flame.style.animation = 'none';
  document.getElementById('mic-enable-btn').classList.add('hidden');
  setText('candle-prompt-zh', '生日願望已送達德州的星空！現在，請接收來自台灣的心跳溫度…');

  playSkyChime(880, 1.4);
  if (navigator.vibrate) navigator.vibrate([70, 50, 110]);

  if (window.CONFIG.bdayAudio && window.CONFIG.bdayAudio.trim() !== '') {
    playVoiceTrackWithSync(window.CONFIG.bdayAudio, '生日祝福語音', 15);
  }

  setTimeout(() => {
    document.getElementById('palm-section').classList.remove('hidden');
  }, 900);
}

document.getElementById('candle-flame').addEventListener('click', triggerCandleExtinguish);

document.getElementById('mic-enable-btn').addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    ensureAudioContext();
    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const btn = document.getElementById('mic-enable-btn');
    btn.textContent = '🌬️ 請對著麥克風吹一口氣！（或再點此直接吹熄）';
    btn.onclick = () => {
      stream.getTracks().forEach(t => t.stop());
      triggerCandleExtinguish();
    };

    function detectBlow() {
      if (candleExtinguished) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < 16; i++) sum += data[i];
      if (sum / 16 > 82) {
        stream.getTracks().forEach(t => t.stop());
        triggerCandleExtinguish();
        return;
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  } catch (e) {
    triggerCandleExtinguish();
  }
});

// 5秒掌心心跳長按解鎖最終登機證與親筆信
(function setupFinalPalmHold() {
  const btn = document.getElementById('palm-btn');
  if (!btn) return;
  let holdTimer = null;
  let beatTimer = null;
  let held = 0;

  function startHold(e) {
    e.preventDefault();
    if (holdTimer) return;
    btn.classList.add('pulsing');
    playHeartbeatThump();
    beatTimer = setInterval(playHeartbeatThump, 750);
    holdTimer = setInterval(() => {
      held += 0.1;
      setText('palm-timer', Math.min(5.0, held).toFixed(1));
      if (held >= 5.0) {
        stopHold();
        playSkyChime(1046.5, 1.8);
        document.getElementById('final-ritual-box').classList.add('hidden');
        document.getElementById('final-treasure-box').classList.remove('hidden');
        renderMuseumGradeBoardingPass();
      }
    }, 100);
  }

  function stopHold() {
    clearInterval(holdTimer);
    clearInterval(beatTimer);
    holdTimer = null;
    beatTimer = null;
    btn.classList.remove('pulsing');
    if (held < 5.0) {
      held = 0;
      setText('palm-timer', '0.0');
    }
  }

  btn.addEventListener('pointerdown', startHold);
  btn.addEventListener('pointerup', stopHold);
  btn.addEventListener('pointerleave', stopHold);
  btn.addEventListener('pointercancel', stopHold);
})();

/********************************************************************
 * 5. 博物館典藏級 Retina (1600×840) 燙金紀念登機證繪製引擎
 ********************************************************************/
function renderMuseumGradeBoardingPass() {
  const cvs = document.getElementById('ticket-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width;  // 1600
  const H = cvs.height; // 840
  const C = window.CONFIG;
  const isAggie = (C.ticketTheme || 'aggie') === 'aggie';

  // 配色系統：德州 A&M 典藏酒紅燙金 vs 午夜星河黑金
  const bgPrimary = isAggie ? '#3d0000' : '#0b1326';
  const bgSecondary = isAggie ? '#580810' : '#182442';
  const stubBg = isAggie ? '#faf5ea' : '#101930';
  const stubText = isAggie ? '#3d0000' : '#f8f5f0';
  const goldMain = '#e5c158';
  const goldLight = '#fff1b8';

  ctx.clearRect(0, 0, W, H);

  // 1. 左側主票面背景 (0 ~ 1120px)
  const stubX = 1120;
  const mainGrad = ctx.createLinearGradient(0, 0, stubX, H);
  mainGrad.addColorStop(0, bgPrimary);
  mainGrad.addColorStop(0.55, bgSecondary);
  mainGrad.addColorStop(1, bgPrimary);
  ctx.fillStyle = mainGrad;
  ctx.fillRect(0, 0, stubX, H);

  // 2. 右側撕票副聯背景 (1120 ~ 1600px)
  ctx.fillStyle = stubBg;
  ctx.fillRect(stubX, 0, W - stubX, H);

  // 3. 精細世界航線浮水印網格 (左側背景裝飾)
  ctx.strokeStyle = 'rgba(229, 193, 88, 0.08)';
  ctx.lineWidth = 1.5;
  for (let r = 160; r <= 640; r += 120) {
    ctx.beginPath();
    ctx.arc(560, 420, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 4. 雙層香檳燙金邊框
  const goldGrad = ctx.createLinearGradient(0, 0, W, H);
  goldGrad.addColorStop(0, goldMain);
  goldGrad.addColorStop(0.5, goldLight);
  goldGrad.addColorStop(1, '#b8860b');

  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 5;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // 5. 齒孔撕票虛線 (x = 1120) 與上下半圓缺口
  ctx.save();
  ctx.strokeStyle = goldMain;
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 12]);
  ctx.beginPath();
  ctx.moveTo(stubX, 40);
  ctx.lineTo(stubX, H - 40);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#050811';
  ctx.beginPath();
  ctx.arc(stubX, 0, 26, 0, Math.PI * 2);
  ctx.arc(stubX, H, 26, 0, Math.PI * 2);
  ctx.fill();

  // 6. 左側頂部燙金標頭橫幅
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(36, 36, stubX - 36, 96);

  ctx.fillStyle = goldGrad;
  ctx.font = '700 28px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillText('✦ FIRST CLASS COMMEMORATIVE BOARDING PASS', 76, 92);

  ctx.fillStyle = 'rgba(255, 248, 231, 0.85)';
  ctx.font = 'italic 22px "Cormorant Garamond", serif';
  ctx.textAlign = 'right';
  ctx.fillText(C.logoEn || 'DEAR HOWARD', stubX - 48, 92);
  ctx.textAlign = 'left';

  // 7. 巨型航線機場代碼：TPE (台北) ➔ CLL (德州大學城 Texas A&M)
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 112px "Cinzel", "Cormorant Garamond", serif';
  ctx.fillText('TPE', 76, 290);
  ctx.fillText('CLL', 775, 290);

  ctx.fillStyle = goldMain;
  ctx.font = '600 22px "Noto Serif TC", serif';
  ctx.fillText('台北 TAIPEI, TAIWAN', 78, 336);
  ctx.fillText('德州 COLLEGE STATION (TEXAS A&M)', 680, 336);

  // 航線弧線與 12,680 KM 飛機徽章
  ctx.save();
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(340, 250);
  ctx.quadraticCurveTo(545, 175, 740, 250);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = goldLight;
  ctx.font = '38px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✈', 545, 224);
  ctx.font = '700 22px "Cinzel", serif';
  ctx.fillStyle = goldMain;
  ctx.fillText(`${(Number(C.totalKm) || 12680).toLocaleString()} KM ACROSS TIMEZONES`, 545, 268);
  ctx.textAlign = 'left';

  // 8. 乘客、日期、雙時區時間與登機門結構化表格欄位 (y = 410 ~ 620)
  ctx.strokeStyle = 'rgba(229, 193, 88, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(76, 385);
  ctx.lineTo(stubX - 50, 385);
  ctx.moveTo(76, 520);
  ctx.lineTo(stubX - 50, 520);
  ctx.moveTo(76, 650);
  ctx.lineTo(stubX - 50, 650);
  ctx.stroke();

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase();
  const twT = now.toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false });
  const usT = now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: false });

  function drawTicketField(label, val, x, y) {
    ctx.fillStyle = 'rgba(229, 193, 88, 0.8)';
    ctx.font = '600 17px "Cinzel", sans-serif';
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 30px "Cormorant Garamond", "Noto Serif TC", serif';
    ctx.fillText(val, x, y + 44);
  }

  // 第一排欄位
  drawTicketField('PASSENGER / 壽星乘客', C.ticketPassenger || 'HOWARD', 76, 430);
  drawTicketField('FLIGHT & GATE / 專屬航班', C.ticketGate || 'FLIGHT AI-1119 / GATE 19', 410, 430);
  drawTicketField('CLASS / 艙等', 'STARLIGHT FIRST', 820, 430);

  // 第二排欄位
  drawTicketField('BOARDING DATE / 紀念日期', dateStr, 76, 562);
  drawTicketField('TAIPEI TIME / 台北時間', `${twT} (GMT+8)`, 410, 562);
  drawTicketField('TEXAS TIME / 德州時間', `${usT} (CST)`, 760, 562);

  // 9. 左側底部一維紀念條碼與燙金宣言
  ctx.fillStyle = goldMain;
  let bx = 76;
  const barSeed = [4, 2, 6, 3, 2, 8, 2, 4, 3, 6, 2, 3, 7, 2, 4, 2, 5, 3, 2, 6, 4, 2, 5, 2, 7, 3];
  for (let i = 0; i < 42; i++) {
    const bw = barSeed[i % barSeed.length];
    ctx.fillRect(bx, 685, bw, 58);
    bx += bw + 4;
  }

  ctx.fillStyle = goldLight;
  ctx.font = 'italic 600 22px "Cormorant Garamond", serif';
  ctx.fillText(C.ticketNote || 'FIRST CLASS • VALID FOREVER • EVERY STEP LEADS ME TO YOU', 395, 715);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '18px "Noto Serif TC", serif';
  ctx.fillText(C.logoZh || '跨越時差的生日星旅 • 永久有效紀念票根', 395, 748);

  // 10. 右側副聯：拍立得合照嵌入與燙金郵戳印章
  drawStubPolaroidAndStamp(ctx, stubX, W, H, stubText, goldMain, C.ticketPhoto);
}

function drawStubPolaroidAndStamp(ctx, stubX, W, H, stubText, goldMain, photoUrl) {
  const centerX = stubX + (W - stubX) / 2;

  ctx.fillStyle = stubText;
  ctx.textAlign = 'center';
  ctx.font = '700 24px "Cinzel", serif';
  ctx.fillText('MEMORY STUB', centerX, 86);
  ctx.font = 'italic 18px "Cormorant Garamond", serif';
  ctx.fillText('TPE ➔ TEXAS A&M', centerX, 114);

  // 繪製拍立得相框
  const pw = 330, ph = 390;
  const px = centerX - pw / 2;
  const py = 148;

  ctx.save();
  ctx.translate(centerX, py + ph / 2);
  ctx.rotate(-0.035);
  ctx.translate(-centerX, -(py + ph / 2));

  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px, py, pw, ph);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(px + 8, py + 8, pw - 16, ph - 16);

  ctx.fillStyle = '#2c221e';
  ctx.font = 'italic 600 22px "Cormorant Garamond", serif';
  ctx.fillText('Every step leads me to you.', centerX, py + ph - 28);

  // 載入並繪製合照 (支援 Base64 或跨域圖片)
  if (photoUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      ctx.translate(centerX, py + ph / 2);
      ctx.rotate(-0.035);
      ctx.translate(-centerX, -(py + ph / 2));
      ctx.drawImage(img, px + 18, py + 18, pw - 36, ph - 82);
      ctx.restore();
      drawGoldPostmark(ctx, centerX, 665, goldMain, stubText);
    };
    img.onerror = () => {
      drawGoldPostmark(ctx, centerX, 665, goldMain, stubText);
    };
    img.src = photoUrl;
  } else {
    drawGoldPostmark(ctx, centerX, 665, goldMain, stubText);
  }
  ctx.restore();
  ctx.textAlign = 'left';
}

function drawGoldPostmark(ctx, cx, cy, goldMain, stubText) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 56, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = stubText;
  ctx.font = '700 18px "Cinzel", serif';
  ctx.fillText('APPROVED', cx, cy - 12);
  ctx.font = '700 22px "Cinzel", serif';
  ctx.fillText('GATE 1119', cx, cy + 14);
  ctx.font = 'italic 15px "Cormorant Garamond", serif';
  ctx.fillText('FOREVER VALID', cx, cy + 36);
  ctx.restore();
}

// 下載高畫質紀念登機證與重新體驗按鈕
document.getElementById('download-ticket-btn').addEventListener('click', () => {
  const cvs = document.getElementById('ticket-canvas');
  try {
    const link = document.createElement('a');
    link.download = 'DEAR_HOWARD_BoardingPass_1600x840.png';
    link.href = cvs.toDataURL('image/png');
    link.click();
  } catch (e) {
    alert('請直接長按上方登機證圖片儲存至手機或電腦相簿！');
  }
});

document.getElementById('replay-game-btn').addEventListener('click', () => {
  document.getElementById('final-letter-modal').classList.remove('active');
  jumpToStage(0);
});
